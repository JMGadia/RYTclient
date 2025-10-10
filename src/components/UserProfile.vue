<template>
  <div class="user-profile-page d-flex align-items-center justify-content-center">
    <div class="profile-container card shadow-sm">
      <div class="card-body p-4 p-md-5">
        <h3 class="text-center fw-bold mb-4">Profile Detail</h3>

        <div class="mb-3">
          <label for="usernameDisplay" class="form-label fw-semibold">Username</label>
          <div v-if="!isEditing" @click="startEditing" class="read-only-input">
            <span>{{ username }}</span>
            <i class="fas fa-pencil-alt text-muted"></i>
          </div>
          <div v-else>
            <input type="text" class="form-control" id="usernameDisplay" v-model="editableUsername" ref="usernameInput">
            <div class="mt-2">
              <button @click="saveUsername" class="btn btn-sm btn-success me-2" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else>Save</span>
              </button>
              <button @click="cancelEditing" class="btn btn-sm btn-secondary">Cancel</button>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label for="email" class="form-label fw-semibold">Email Address</label>
          <input type="email" class="form-control" id="email" :value="email" disabled readonly>
        </div>

        <div class="row g-3">
          <div class="col-6">
            <button class="btn btn-outline-secondary w-100 h-100 p-3" @click="router.push({ name: 'BookOrderAddress' })">
              <i class="fas fa-map-marker-alt d-block mb-1"></i>
              Book Order Address
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-outline-secondary w-100 h-100 p-3" @click="router.push({ name: 'OrderHistory' })">
              <i class="fas fa-history d-block mb-1"></i>
              Order History
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-outline-secondary w-100 h-100 p-3" @click="router.push({ name: 'order tracking' })">
              <i class="fas fa-box d-block mb-1"></i>
              Track Recents
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-outline-danger w-100 h-100 p-3" @click="showLogoutConfirm = true">
              <i class="fas fa-sign-out-alt d-block mb-1"></i>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" v-if="showLogoutConfirm"></div>
    <div class="modal fade" :class="{ 'show': showLogoutConfirm }" style="display: block;" v-if="showLogoutConfirm">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Confirm Logout</h5>
            <button type="button" class="btn-close" @click="showLogoutConfirm = false"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to log out?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showLogoutConfirm = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="handleLogout">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../server/supabase';

const router = useRouter();

const isEditing = ref(false);
const username = ref('Loading...');
const email = ref('Loading...');
const editableUsername = ref('');
const usernameInput = ref(null);
const isLoading = ref(false);
const user = ref(null);
const showLogoutConfirm = ref(false); // NEW: State to control the modal

onMounted(async () => {
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (authUser) {
      user.value = authUser;
      email.value = authUser.email;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.value.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      if (profileData) username.value = profileData.username;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    username.value = 'Error loading profile';
  }
});

const startEditing = async () => {
  editableUsername.value = username.value;
  isEditing.value = true;
  await nextTick();
  usernameInput.value.focus();
};

const saveUsername = async () => {
  if (!editableUsername.value.trim() || editableUsername.value === username.value) {
    isEditing.value = false;
    return;
  }
  
  isLoading.value = true;
  try {
    const { error } = await supabase.rpc('update_my_username', {
      new_username_text: editableUsername.value
    });
    if (error) throw error;
    username.value = editableUsername.value;
    alert('Username updated successfully!');
  } catch (error) {
    console.error('An error occurred during saveUsername:', error);
    alert(`Failed to update username. See console for details. Error: ${error.message}`);
  } finally {
    isLoading.value = false;
    isEditing.value = false;
  }
};

const cancelEditing = () => {
  isEditing.value = false;
};

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    showLogoutConfirm.value = false; // Close the modal
    router.push({ name: 'login' }); // Redirect
  } catch (error) {
    alert(error.message);
  }
};
</script>

<style scoped>
/* All existing styles remain the same */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400;500&display=swap');
.user-profile-page { font-family: 'Roboto', sans-serif; background-color: #f8f9fa; min-height: calc(100vh - 56px); padding: 2rem 0; }
.profile-container { width: 100%; max-width: 500px; border: none; border-radius: 0.75rem; }
.card-body h3, .modal-title { font-family: 'Poppins', sans-serif; }
.form-label { font-family: 'Poppins', sans-serif; font-size: 0.9rem; }
.read-only-input { display: flex; justify-content: space-between; align-items: center; padding: 0.375rem 0.75rem; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #212529; background-color: #fff; border: 1px solid #ced4da; border-radius: 0.375rem; cursor: pointer; min-height: 38px; }
.read-only-input:hover { border-color: #86b7fe; }
input:disabled { background-color: #e9ecef; cursor: not-allowed; }
.btn { font-family: 'Poppins', sans-serif; font-size: 0.9rem; transition: all 0.2s ease-in-out; }
.btn i { font-size: 1.2rem; }

/* Modal Styles */
.modal.show { display: block; }
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}
</style>