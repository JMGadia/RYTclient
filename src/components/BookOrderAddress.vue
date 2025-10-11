<template>
  <div class="address-book-page">
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <h2 class="fw-bold section-title text-center mb-0">Book Order Address</h2>
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
              <button v-if="!address.is_default" class="btn btn-sm btn-link text-success" @click="handleSetDefault(address.id)" :disabled="isSettingDefault === address.id">
                <span v-if="isSettingDefault === address.id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span v-else>Set as Default</span>
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
                <input type="text" class="form-control" id="name" v-model="currentAddress.name" required>
              </div>
              <div class="mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="tel" class="form-control" id="phone" v-model="currentAddress.phone" required>
              </div>
              <div class="mb-3">
                <label for="full_address" class="form-label">Full Address</label>
                <textarea class="form-control" id="full_address" rows="3" v-model="currentAddress.full_address" required></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="handleSaveAddress">
              <span v-if="isSaving" class="spinner-border spinner-border-sm"></span>
              <span v-else>Save Address</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../server/supabase';
import { useRouter } from 'vue-router';

// --- STATE ---
const router = useRouter();
const addresses = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const currentAddress = ref({ id: null, name: '', phone: '', full_address: '' });
const user = ref(null);
const isSettingDefault = ref(null); // New state for tracking the loading default button

// --- MODAL CONTROLS ---
const openAddModal = () => {
  isEditing.value = false;
  currentAddress.value = { id: null, name: '', phone: '', full_address: '' };
  showModal.value = true;
};

const openEditModal = (address) => {
  isEditing.value = true;
  currentAddress.value = { ...address };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// --- DATABASE FUNCTIONS ---
const fetchAddresses = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase.from('addresses').select('*').order('is_default', { ascending: false }).order('created_at', { ascending: false });
    if (error) throw error;
    addresses.value = data;
  } catch (error) {
    console.error('Error fetching addresses:', error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleSaveAddress = async () => {
  isSaving.value = true;
  try {
    const addressData = {
      name: currentAddress.value.name,
      phone: currentAddress.value.phone,
      full_address: currentAddress.value.full_address,
      user_id: user.value.id
    };

    if (isEditing.value) {
      const { error } = await supabase.from('addresses').update(addressData).eq('id', currentAddress.value.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('addresses').insert([addressData]);
      if (error) throw error;
    }
    
    closeModal();
    await fetchAddresses();
  } catch (error) {
    console.error('Error saving address:', error.message);
  } finally {
    isSaving.value = false;
  }
};

const handleDeleteAddress = async (addressId) => {
  if (window.confirm('Are you sure you want to delete this address?')) {
    try {
      const { error } = await supabase.from('addresses').delete().eq('id', addressId);
      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error.message);
    }
  }
};

// --- UPDATED FUNCTION ---
const handleSetDefault = async (addressId) => {
  isSettingDefault.value = addressId; // Set loading state for the specific button
  try {
    const { error } = await supabase.rpc('set_default_address', {
      address_id_to_set: addressId
    });

    if (error) {
      // This makes sure the error is caught by the catch block below
      throw error;
    }
    
    // On success, redirect to the payment system
    router.push({ name: 'payment system' });

  } catch (error) {
    console.error('Error setting default address:', error.message);
    // You can add a user-facing notification here (e.g., a toast or alert)
    alert('Failed to set default address. Check the console for more details.');
  } finally {
    isSettingDefault.value = null; // Reset loading state regardless of outcome
  }
};

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  user.value = data.user;
  await fetchAddresses();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400&display=swap');
.address-book-page { font-family: 'Roboto', sans-serif; background-color: #f8f9fa; min-height: 100vh; }
.section-title, .modal-title { font-family: 'Poppins', sans-serif; }
.card { border: none; }
.btn-primary { font-family: 'Poppins', sans-serif; }
.address-card { transition: all 0.2s ease-in-out; border: 1px solid #dee2e6; }
.address-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important; }
.address-card.default-address { border-color: #198754; border-width: 2px; }
.card-footer { border-top: 1px solid #f0f0f0; }
.modal.show { display: block; }
.modal-backdrop { position: fixed; top: 0; left: 0; z-index: 1050; width: 100vw; height: 100vh; background-color: #000; opacity: 0.5; }
.btn-link { font-weight: 600; text-decoration: none; }
</style>