<template>
  <div class="address-book-page">
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <h2 class="fw-bold section-title text-center mb-0 text-light">Book Order Address</h2>
        <button class="btn btn-primary rounded-pill px-4" @click="openAddModal">
          <i class="fas fa-plus me-2"></i>Add New Address
        </button>
      </div>

      <div v-if="isLoading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else class="row">
        <div class="col-md-6 mb-4" v-for="address in addresses" :key="address.id">
          <div class="card shadow-sm h-100 address-card" :class="{ 'default-address': address.is_default }">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h5 class="card-title fw-bold">{{ address.name }}</h5>
                  <p class="card-text text-muted mb-1">{{ address.phone }}</p>
                  <p class="card-text text-muted">{{ address.full_address }}</p>
                </div>
                <span v-if="address.is_default" class="badge bg-success">Default</span>
              </div>
            </div>

            <div class="card-footer bg-white d-flex justify-content-between align-items-center">
              <button
                class="btn btn-sm btn-link text-success"
                @click="handleAddressAction(address)"
                :disabled="isSettingDefault === address.id"
              >
                <span
                  v-if="isSettingDefault === address.id"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-else>
                  {{ address.is_default ? 'Confirm' : 'Set as Default' }}
                </span>
              </button>
              <div class="ms-auto">
                <button class="btn btn-sm btn-light border me-2" @click="openEditModal(address)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" @click="handleDeleteAddress(address.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isLoading && addresses.length === 0" class="col-12">
          <div class="text-center p-5 bg-light rounded">
            <i class="fas fa-map-marked-alt fa-3x text-muted mb-3"></i>
            <h4 class="fw-bold">No Addresses Found</h4>
            <p class="text-muted">Add a new address to get started.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" v-if="showModal"></div>
    <div class="modal fade" :class="{ 'show': showModal }" style="display: block;" v-if="showModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">{{ isEditing ? 'Edit Address' : 'Add New Address' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSaveAddress">
              <div class="mb-3">
                <label for="name" class="form-label">Recipient Name</label>
                <input type="text" class="form-control" id="name" v-model="currentAddress.name" required />
              </div>

              <div class="mb-3">
                <label for="phone" class="form-label">Phone Number (e.g., +639xxxxxxxxx or 09xxxxxxxxx)</label>
                <input type="tel" class="form-control" id="phone" v-model="currentAddress.phone" required @input="validatePhone" />
                <div v-if="phoneError" class="text-danger mt-1">{{ phoneError }}</div>
              </div>

              <div class="mb-3">
                <label for="province" class="form-label">Province *</label>
                <select
                  class="form-select"
                  id="province"
                  v-model="currentAddress.province"
                  @change="loadCities"
                  required
                  disabled
                >
                  <option value="" disabled>Select Province</option>
                  <option v-for="province in provinces" :key="province.prov_code" :value="province.prov_code">{{ province.prov_name }}</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="city" class="form-label">City/Municipality *</label>
                <select
                  class="form-select"
                  id="city"
                  v-model="currentAddress.city_municipality"
                  @change="loadBarangays"
                  :disabled="!currentAddress.province"
                  required
                >
                  <option value="" disabled>Select City/Municipality</option>
                  <option v-for="city in cities" :key="city.mun_code" :value="city.mun_code">{{ city.mun_name }}</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="barangay" class="form-label">Barangay *</label>
                <select
                  class="form-select"
                  id="barangay"
                  v-model="currentAddress.barangay"
                  :disabled="!currentAddress.city_municipality"
                  required
                >
                  <option value="" disabled>Select Barangay</option>
                  <option v-for="barangay in barangays" :key="barangay.brgy_code" :value="barangay.brgy_code">{{ barangay.brgy_name }}</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="street" class="form-label">Street/House No./Building Name</label>
                <input type="text" class="form-control" id="street" v-model="currentAddress.street" required />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleSaveAddress"
              :disabled="isSaving || phoneError || !currentAddress.barangay || !currentAddress.street"
            >
              <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
              <span v-else>Save Address</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <button @click="goToOrderingSystem" class="fab" title="Continue Shopping">
      <i class="fas fa-shopping-bag"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../server/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- STATE MANAGEMENT ---
const addresses = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const currentAddress = ref({
  id: null,
  name: '',
  phone: '',
  // Structured Address Fields (used in the form)
  province: '',
  city_municipality: '',
  barangay: '',
  street: '',
  full_address: '', // Stores the final concatenated string
});
const user = ref(null);
const isSettingDefault = ref(null);
const phoneError = ref('');

// PH Geo Data State (CAVITE-SPECIFIC)
const provinces = ref([]);
const cities = ref([]);
const barangays = ref([]);

// --- CAVITE GEO DATA DEFINITIONS ---

const CAVITE_PROVINCE = [{ prov_code: '0421', prov_name: 'Cavite' }];

const CAVITE_CITIES = [
    { mun_code: '042106', mun_name: 'Imus City', type: 'City' },
    { mun_code: '042118', mun_name: 'Silang', type: 'Municipality' },
    { mun_code: '042104', mun_name: 'Dasmariñas City', type: 'City' }
];

const BARANGAYS_DATA = {
    '042106': [ // Imus City Examples
        { brgy_code: '042106001', brgy_name: 'Alapan I-A' },
        { brgy_code: '042106006', brgy_name: 'Anabu I-A' },
        { brgy_code: '042106029', brgy_name: 'Bucandala I' },
        { brgy_code: '042106037', brgy_name: 'Buhay na Tubig' },
    ],
    '042118': [ // Silang Examples
        { brgy_code: '042118001', brgy_name: 'Acacia' },
        { brgy_code: '042118016', brgy_name: 'Biga I' },
        { brgy_code: '042118020', brgy_name: 'Biluso' },
        { brgy_code: '042118025', brgy_name: 'Bulihan' },
    ],
    '042104': [ // Dasmariñas City Examples
        { brgy_code: '042104010', brgy_name: 'Burol' },
        { brgy_code: '042104022', brgy_name: 'Langkaan I' },
        { brgy_code: '042104033', brgy_name: 'Paliparan I' },
        { brgy_code: '042104052', brgy_name: 'Salawag' },
        { brgy_code: '042104060', brgy_name: 'San Jose' },
    ]
};

// --- GEO DATA LOADING FUNCTIONS ---

const loadProvinces = async () => {
    provinces.value = CAVITE_PROVINCE;
    cities.value = []; barangays.value = [];
    currentAddress.value.city_municipality = ''; currentAddress.value.barangay = '';

    if (!currentAddress.value.province && provinces.value.length > 0) {
        currentAddress.value.province = provinces.value[0].prov_code;
    }
    await loadCities();
};

const loadCities = async () => {
    cities.value = CAVITE_CITIES;
    barangays.value = [];
    currentAddress.value.barangay = '';
};

const loadBarangays = async () => {
    barangays.value = BARANGAYS_DATA[currentAddress.value.city_municipality] || [];
    currentAddress.value.barangay = '';
};

// --- VALIDATION & CONCATENATION ---

const validatePhone = () => {
  const phPhoneRegex = /^(?:\+63|0)9\d{9}$|^(?:\+63|0)[2-8]\d{6,8}$/;
  const phone = currentAddress.value.phone.trim();
  phoneError.value = (!phone || !phPhoneRegex.test(phone))
    ? 'Invalid Philippine phone format. Use +63XXXXXXXXX or 09XXXXXXXXX.'
    : '';
};

// Concatenates structured data into the required single sentence format
const constructedFullAddress = computed(() => {
    const { street, barangay, city_municipality, province } = currentAddress.value;

    const findObj = (code, list) => list.find(item => item[Object.keys(item)[0]] === code);

    const provObj = findObj(province, provinces.value);
    const cityObj = findObj(city_municipality, cities.value);
    const brgyObj = findObj(barangay, barangays.value);

    if (!provObj || !cityObj || !brgyObj) return "Incomplete Address. Please select all dropdowns.";

    const provPart = `Province of ${provObj.prov_name}`;
    const cityType = cityObj.type === 'City' ? 'City of' : 'Municipality of';
    const cityPart = `${cityType} ${cityObj.mun_name}`;
    const brgyPart = `Barangay ${brgyObj.brgy_name}`;
    const streetPart = street.trim();

    const parts = [provPart, cityPart, brgyPart, streetPart].filter(p => p);
    return parts.join(', ');
});

// --- MODAL & ROUTER HANDLERS ---
const goToOrderingSystem = () => { router.push({ name: 'ordering system' }); };

const openAddModal = async () => {
  isEditing.value = false;
  currentAddress.value = { id: null, name: '', phone: '', province: '', city_municipality: '', barangay: '', street: '', full_address: '' };
  phoneError.value = '';
  await loadProvinces();
  showModal.value = true;
};

// ✅ Updated Edit Modal: Removed warning and simplified logic
const openEditModal = (address) => {
  isEditing.value = true;
  // Reset structured fields and set default Cavite to force user to re-select
  currentAddress.value = {
    ...address,
    province: CAVITE_PROVINCE[0].prov_code,
    city_municipality: '',
    barangay: '',
    street: '', // Clear street for re-entry
    full_address: address.full_address // Keep old full address for reference
  };
  phoneError.value = '';
  loadProvinces();
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; };
const handleDeleteAddress = async (addressId) => { /* ... existing logic ... */ };


// --- DATA FETCHING & CRUD ---

const fetchAddresses = async () => {
  isLoading.value = true;
  try {
    if (!user.value) { addresses.value = []; return; }
    const { data, error } = await supabase
      .from('addresses')
      .select('id, user_id, name, phone, full_address, is_default, created_at')
      .eq('user_id', user.value.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    addresses.value = data;
  } catch (error) {
    console.error('Error fetching addresses:', error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleSaveAddress = async () => {
  validatePhone();

  if (phoneError.value || !currentAddress.value.province || !currentAddress.value.city_municipality || !currentAddress.value.barangay || !currentAddress.value.street) {
      alert('Please correct errors and ensure all required address fields are selected/filled.');
      return;
  }

  currentAddress.value.full_address = constructedFullAddress.value;

  isSaving.value = true;
  try {
    const addressData = {
      name: currentAddress.value.name,
      phone: currentAddress.value.phone,
      full_address: currentAddress.value.full_address,
      user_id: user.value.id,
    };

    if (isEditing.value) {
      const { error } = await supabase.from('addresses').update(addressData).eq('id', currentAddress.value.id);
      if (error) throw error;
    } else {
      const is_default = addresses.value.length === 0;
      const { error } = await supabase.from('addresses').insert([{ ...addressData, is_default }]);
      if (error) throw error;
    }

    closeModal();
    await fetchAddresses();
  } catch (error) {
    console.error('Error saving address:', error.message);
    alert('An error occurred while saving the address.');
  } finally {
    isSaving.value = false;
  }
};


// ✅ Restored Default/Confirm Logic for "Set as Default" and "Confirm" button
const handleAddressAction = async (address) => {
  if (address.is_default) {
    // Already default → "Confirm" button leads to payment system
    router.push({ name: 'payment system' });
    return;
  }

  // Otherwise, set it as default first
  isSettingDefault.value = address.id;
  try {
    // This RPC (Remote Procedure Call) is assumed to handle setting the default address in Supabase
    const { error } = await supabase.rpc('set_default_address', {
      address_id_to_set: address.id,
    });

    if (error) throw error;

    // Refresh data to show new default status and then proceed
    await fetchAddresses();
    router.push({ name: 'payment system' });
  } catch (error) {
    console.error('Error setting default address:', error.message);
    alert('Failed to set default address.');
  } finally {
    isSettingDefault.value = null;
  }
};

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data.user;
  await fetchAddresses();
});
</script>

<style scoped>
/* ============================================================
    STYLES from UI-focused Code (Modern Aurora Background & Glassmorphism)
    MODAL Z-INDEX FIXES ADDED HERE
  ============================================================
*/
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400&display=swap');

.address-book-page {
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 🌈 Animated Aurora Gradient Background */
.address-book-page::before {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image:
    radial-gradient(circle at 15% 20%, #5a7dff 10%, transparent 50%),
    radial-gradient(circle at 80% 80%, #d08bff 10%, transparent 40%),
    radial-gradient(circle at 50% 40%, #ff8ed1 10%, transparent 40%),
    linear-gradient(120deg, #0c0a24, #241e4e, #17133d);
  filter: blur(80px);
  opacity: 0.9;
  animation: auroraAnimation 25s ease-in-out infinite;
  z-index: 0;
}

@keyframes auroraAnimation {
  0% { transform: rotate(0deg) translateX(0); }
  50% { transform: rotate(180deg) translateX(10%); }
  100% { transform: rotate(360deg) translateX(0); }
}

/* Keep main content (container and FAB) above background but below modal */
.container, .fab {
  position: relative;
  z-index: 2; /* Below the modal, above the background */
}

/* --- Section Title --- */
.section-title {
  font-family: 'Poppins', sans-serif;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* --- Card Styling (Glassmorphism Effect) --- */
.address-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
.address-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(13, 110, 253, 0.2);
}
.address-card.default-address {
  border-color: #198754;
  border-width: 2px;
}
.card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}

/* --- Typography --- */
.card-title, .modal-title { font-family: 'Poppins', sans-serif; color: #212529; }
.card-text { color: #6c757d !important; }
.btn-primary { font-family: 'Poppins', sans-serif; }
.btn-link { font-weight: 600; text-decoration: none; }

/* --- MODAL STYLES (Fixing the Stacking Issue) --- */
.modal {
    position: fixed; /* Crucial for overlaying the entire screen */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
    z-index: 1060; /* Higher than backdrop */
}
.modal-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    border-radius: 1rem;
}
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050; /* Needs to be higher than main content (z-index: 2) */
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.5;
}


/* --- Floating Button (FAB) --- */
.fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.2s ease-in-out;
}
.fab:hover {
  transform: scale(1.1);
}
</style>