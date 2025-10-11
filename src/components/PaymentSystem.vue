<template>
  <div class="payment-page-background">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4 p-sm-5">
              
              <div class="text-center mb-4">
                <h2 class="card-title fw-bold text-dark mb-2">
                  <i class="fas fa-shield-alt me-2 text-primary"></i>Secure Payment
                </h2>
                <p class="text-muted">Complete your purchase</p>
              </div>

              <div class="mb-4">
                <h5 class="fw-semibold">Select Customer Type</h5>
                <div class="d-grid gap-2 d-sm-flex">
                  <button 
                    @click="setCustomerType('Regular')" 
                    :class="['btn', 'flex-grow-1', customerType === 'Regular' ? 'btn-primary' : 'btn-outline-primary']">
                    <i class="fas fa-user me-2"></i>Regular Buyer
                  </button>
                  <button 
                    @click="setCustomerType('B2B')" 
                    :class="['btn', 'flex-grow-1', customerType === 'B2B' ? 'btn-primary' : 'btn-outline-primary']">
                    <i class="fas fa-building me-2"></i>B2B Transaction
                  </button>
                </div>
              </div>

              <div v-if="customerType">
                <hr class="my-4">
                <div class="mb-4">
                  <h5 class="fw-semibold">Order Summary</h5>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                      Blacklion Tyre (x2)
                      <span class="fw-medium">₱{{ originalPrice.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                      Service Fee
                      <span class="fw-medium">₱{{ serviceFee.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 border-top pt-3">
                      <strong class="h5">Total</strong>
                      <strong class="h5 text-primary">₱{{ totalPrice.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</strong>
                    </li>
                     <li class="list-group-item d-flex justify-content-between align-items-center px-0 text-success border-top pt-3">
                      <strong class="h6">Required Partial Payment</strong>
                      <strong class="h6">₱{{ partialPayment.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</strong>
                    </li>
                  </ul>
                </div>

                <hr class="my-4">

                <h5 class="fw-semibold mb-3">Choose Payment Method</h5>
                <div class="d-grid gap-3">
                  
                  <template v-if="customerType === 'Regular'">
                    <label class="payment-option-label">
                      <input type="radio" class="form-check-input" name="paymentMethod" value="cod" v-model="selectedPaymentMethod">
                      <div class="d-flex align-items-center">
                        <i class="fas fa-truck fa-2x me-3 text-muted"></i>
                        <div>
                          <span class="fw-bold d-block">Cash on Delivery (COD)</span>
                          <small class="text-muted">Pay the partial payment online now, and the rest on delivery.</small>
                        </div>
                      </div>
                    </label>

                    <label class="payment-option-label">
                      <input type="radio" class="form-check-input" name="paymentMethod" value="gcash" v-model="selectedPaymentMethod">
                      <div class="d-flex align-items-center">
                        <img src="/src/assets/gcash-logow.png" alt="GCash Logo" class="payment-logo me-3">
                        <div>
                          <span class="fw-bold d-block">Pay with GCash</span>
                          <small class="text-muted">Pay the partial payment via GCash transfer.</small>
                        </div>
                      </div>
                    </label>
                  </template>

                  <template v-if="customerType === 'B2B'">
                    <label class="payment-option-label">
                      <input type="radio" class="form-check-input" name="paymentMethod" value="bank_check" v-model="selectedPaymentMethod">
                      <div class="d-flex align-items-center">
                        <i class="fas fa-money-check-alt fa-2x me-3 text-muted"></i>
                        <div>
                          <span class="fw-bold d-block">Bank Check</span>
                          <small class="text-muted">Pay the partial payment via bank check.</small>
                        </div>
                      </div>
                    </label>
                  </template>
                </div>

                <div v-if="selectedPaymentMethod === 'gcash' || selectedPaymentMethod === 'cod'" class="mt-4 p-3 bg-light rounded-3">
                  <h6 class="fw-bold">GCash Partial Payment</h6>
                  <p class="small text-muted">
                    To confirm your order, please send the partial payment of <strong>₱{{ partialPayment.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</strong> to the following GCash number: 
                    <strong>0912-345-6789 (RYT-Tyre Inc.)</strong>
                  </p>
                  <div class="mb-3">
                    <label for="gcashNumber" class="form-label fw-semibold">Your GCash Number</label>
                    <input type="tel" class="form-control" id="gcashNumber" v-model="gcashNumber" placeholder="e.g., 09XX-XXX-XXXX">
                  </div>
                  <div>
                    <label for="paymentProof" class="form-label fw-semibold">Upload Proof of Payment</label>
                    <input class="form-control" type="file" id="paymentProof" @change="handleFileUpload">
                  </div>
                </div>

                <div v-if="selectedPaymentMethod === 'bank_check'" class="mt-4 p-3 bg-light rounded-3">
                  <h6 class="fw-bold">Bank Check Instructions</h6>
                  <p class="small text-muted">
                    Please prepare a check for the partial payment of <strong>₱{{ partialPayment.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</strong> payable to "RYT-Tyre Inc.".
                  </p>
                  <p class="small text-muted">Further instructions will be sent to your email after placing the order.</p>
                </div>
                
                <div class="d-grid mt-4">
                  <button class="btn btn-primary btn-lg fw-semibold" @click="handleSubmit" :disabled="!selectedPaymentMethod">
                    <i class="fas fa-check-circle me-2"></i> Place Order
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { supabase } from '../server/supabase'; // adjust path if needed
import { useRouter } from 'vue-router';

const router = useRouter();

const customerType = ref(null); // 'Regular' or 'B2B'
const selectedPaymentMethod = ref(null);
const gcashNumber = ref('');
const paymentProofFile = ref(null);

// Sample pricing
const originalPrice = ref(4500);
const serviceFee = ref(500);

// Computed properties for dynamic values
const totalPrice = computed(() => originalPrice.value + serviceFee.value);
const partialPayment = computed(() => originalPrice.value / 4); // 25%

const setCustomerType = (type) => {
  customerType.value = type;
  selectedPaymentMethod.value = null; // Reset payment method on type change
};

const handleFileUpload = (event) => {
  paymentProofFile.value = event.target.files[0];
};

const handleSubmit = async () => {
  if (!selectedPaymentMethod.value) {
    alert('Please select a payment method.');
    return;
  }

  // --- Product Information Defaults (Using 'Blacklion' which exists in your DB) ---
  const QUERY_PRODUCT_NAME = 'Blacklion'; 
  const DEFAULT_PRODUCT_QUANTITY = 2;
  
  let dynamicProductId = null;
  let dynamicProductName = QUERY_PRODUCT_NAME;
  let dynamicProductSize = 'N/A';
  let dynamicProductQuantity = DEFAULT_PRODUCT_QUANTITY;
  let currentStock = 0; // Initialize stock to 0

  try {
    // 1. Get the logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    if (!user) {
      alert('You must be logged in to place an order.');
      return;
    }

    // 2. Fetch the required product information
    const { data: productData, error: productError } = await supabase
        .from('products')
        .select('id, brand, size, quantity') // <-- Include quantity
        .ilike('brand', `%${QUERY_PRODUCT_NAME}%`) 
        .limit(1)
        .single();
    
    // We only throw error if it's a critical DB error, not 'no rows found'
    if (productError && productError.code !== 'PGRST116') {
        throw productError;
    }

    if (productData) {
        dynamicProductId = productData.id;
        dynamicProductName = productData.brand; 
        dynamicProductSize = productData.size;
        currentStock = productData.quantity; // Assign fetched stock
    } else {
        // Product not found: set fields to NULL/defaults
        dynamicProductId = null; 
        dynamicProductName = 'Generic Tyre'; 
        dynamicProductSize = 'N/A';
        console.warn(`Product '${QUERY_PRODUCT_NAME}' not found. Order proceeding with placeholder data.`);
    }

    // 3. Get the default address
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .select('full_address, name, phone')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single();

    if (addressError && addressError.code !== 'PGRST116') {
        throw addressError;
    }

    if (!addressData) {
        alert('⚠️ Please set a default address before placing an order.');
        return;
    }
    
    // 4. CHECK INVENTORY: Allow the order to proceed even if stock is low or product is missing.
    // Only warn the admin/user about potential issues.
    if (!dynamicProductId) {
        alert('⚠️ Warning: Product data is missing. Placing order, but inventory update will be skipped.');
    } else if (currentStock < dynamicProductQuantity) {
        alert(`⚠️ Warning: Only ${currentStock} item(s) in stock. Placing order, but this may create negative inventory.`);
    }

    // 5. Prepare and Insert order into 'orders' table
    const orderData = {
      user_id: user.id, 
      product_id: dynamicProductId, 
      product_name: dynamicProductName, 
      quantity: dynamicProductQuantity, 
      size: dynamicProductSize, 
      total_price: totalPrice.value, 
      username: addressData.name, 
      shipping_address: addressData.full_address, 
      contact: addressData.phone, 
      status: 'Order Processed', 
    };

    const { error: insertError } = await supabase
      .from('orders')
      .insert([orderData]);

    if (insertError) throw insertError;

    // --- NEW LOGIC: INVENTORY AND CART CLEARANCE ---
    
    // 6. Decrement Product Stock & Clear Cart (Only if product was found)
    if (dynamicProductId) {
        const newStock = currentStock - dynamicProductQuantity;
        
        // Update Products Table
        const { error: stockUpdateError } = await supabase
          .from('products')
          .update({ quantity: newStock })
          .eq('id', dynamicProductId);
          
        if (stockUpdateError) throw stockUpdateError;
    }
    
    // Clear User's Cart in 'on_cart' table (Always try to clear the cart)
    const { error: cartClearError } = await supabase
      .from('on_cart')
      .delete()
      .eq('user_id', user.id);
      
    if (cartClearError) {
        console.warn('Order placed, but failed to clear cart:', cartClearError.message);
    }
    
    // --- TRANSACTION END ---

    // 7. Success — alert and redirect
    alert('✅ Order placed successfully! Redirecting to order tracking...');
    router.push('/order-tracking');

  } catch (err) {
    console.error('Order error:', err.message);
    alert('⚠️ Failed to place order: ' + err.message);
  }
};
</script>


<style scoped>
.payment-page-background {
  background-color: #f4f7f9;
  font-family: 'Segoe UI', sans-serif;
}
.card {
  transition: all 0.3s ease;
}
.payment-option-label {
  display: block;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.payment-option-label:hover {
  border-color: #0d6efd;
  background-color: #f8f9fa;
}
.payment-option-label:has(input:checked) {
  border-color: #0d6efd;
  background-color: #e7f1ff;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
}
.payment-logo {
  width: 40px;
  height: auto;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
.btn:disabled {
  background: #ced4da;
  cursor: not-allowed;
}
</style>