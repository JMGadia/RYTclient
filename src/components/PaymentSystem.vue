<template>
  <div class="payment-page-background">
    <div class="container py-5">
      </div>

    <button @click="goToAddressBook" class="fab" title="Change Address">
      <i class="fas fa-arrow-left"></i>
    </button>
  </div>
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
                    <li v-for="item in cart" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center px-0">
                      {{ item.brand }} (x{{ item.quantity }})
                      <span class="fw-medium">₱{{ (item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                    </li>

                    <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                      Service Fee
                      <span class="fw-medium">₱{{ serviceFee.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                    </li>

                    <li class="list-group-item d-flex justify-content-between align-items-center px-0 border-top pt-3">
                      <strong class="h5">Total</strong>
                      <strong class="h5 text-primary">₱{{ grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</strong>
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
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../server/supabase';
import { useRouter } from 'vue-router';
// 1. Import the cart functionality
import { useCart } from '../composables/useCart';

const router = useRouter();

// 2. Get live cart data and functions from the composable
const { cart, cartTotal, clearCart, fetchCart } = useCart();

const customerType = ref(null);
const selectedPaymentMethod = ref(null);
const gcashNumber = ref('');
const paymentProofFile = ref(null);
const isProcessing = ref(false);
const serviceFee = ref(500); // This can remain as a static fee

// 3. Make computed properties dynamic and safe
const grandTotal = computed(() => {
  // Use cartTotal if it's a number, otherwise default to 0
  const total = typeof cartTotal.value === 'number' ? cartTotal.value : 0;
  return total + serviceFee.value;
});

const partialPayment = computed(() => {
  const total = typeof cartTotal.value === 'number' ? cartTotal.value : 0;
  return total / 4; // 25% of subtotal
});

const setCustomerType = (type) => {
  customerType.value = type;
  selectedPaymentMethod.value = null;
};

const handleFileUpload = (event) => {
  paymentProofFile.value = event.target.files[0];
};

const goToAddressBook = () => {
  router.push({ name: 'BookOrderAddress' });
};

// 4. Completely rewrite handleSubmit for multi-item orders
const handleSubmit = async () => {
  if (!selectedPaymentMethod.value || cart.value.length === 0) {
    alert('Please select a payment method or add items to your cart.');
    return;
  }
  isProcessing.value = true;

  try {
    // Get user and default address
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to place an order.');

    const { data: addressData } = await supabase
      .from('addresses')
      .select('full_address, name, phone')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single();
    if (!addressData) throw new Error('Please set a default address before ordering.');

    // Create the main order entry in the 'orders' table
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        username: addressData.name,
        shipping_address: addressData.full_address,
        contact: addressData.phone,
        total_price: grandTotal.value,
        status: 'Order Processed',
      })
      .select()
      .single();
    if (orderError) throw orderError;

    // Prepare all items from the cart for the 'order_items' table
    const orderItems = cart.value.map(item => ({
      order_id: newOrder.order_id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    // Insert all items into the 'order_items' table
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // Decrement stock for each product
    for (const item of cart.value) {
      const { error: stockUpdateError } = await supabase.rpc('decrement_stock', {
        product_id_to_update: item.id,
        quantity_to_decrement: item.quantity,
      });
      if (stockUpdateError) console.warn(`Could not update stock for product ${item.id}:`, stockUpdateError.message);
    }
    
    // Clear the user's cart
    await clearCart(); 
    
    // Success
    alert('✅ Order placed successfully! Redirecting to order tracking...');
    router.push('/order-tracking');

  } catch (err) {
    console.error('Order error:', err.message);
    alert('⚠️ Failed to place order: ' + err.message);
  } finally {
    isProcessing.value = false;
  }
};

// 5. Fetch cart data as soon as the component loads
onMounted(() => {
  fetchCart();
});
</script>

<style scoped>

/* ADDED STYLES FOR FAB */
.fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #6c757d; /* A neutral color for 'back' */
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