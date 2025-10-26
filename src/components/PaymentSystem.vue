<template>
  <div class="payment-page-background">
    <div class="container py-5"></div>

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

                <!-- GCash / COD Payment Section -->
                <div v-if="selectedPaymentMethod === 'gcash' || selectedPaymentMethod === 'cod'" class="mt-4 p-3 bg-light rounded-3">
                  <h6 class="fw-bold">GCash Partial Payment</h6>
                  <p class="small text-muted">
                    To confirm your order, please send the partial payment of
                    <strong>₱{{ partialPayment.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</strong>
                    to the following GCash number:
                    <strong>0912-345-6789 (RYT-Tyre Inc.)</strong>
                  </p>

                  <!-- Responsive + Zoomable QR -->
                  <div class="qr-wrapper text-center my-3">
                    <img
                      src="/src/assets/QR-GCash.jpg"
                      alt="GCash QR Code"
                      class="qr-image"
                      @click="isQrModalOpen = true"
                    />
                    <p class="small text-muted mt-2">Tap to enlarge QR code</p>
                  </div>

                  <!-- QR Modal -->
                  <div v-if="isQrModalOpen" class="qr-modal" @click.self="isQrModalOpen = false">
                    <div class="qr-modal-content">
                      <img src="/src/assets/QR-GCash.jpg" alt="GCash QR Zoomed" class="qr-modal-image" />
                      <button class="close-btn" @click="isQrModalOpen = false">&times;</button>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="gcashNumber" class="form-label fw-semibold">Your GCash Number</label>
                    <input type="tel" class="form-control" id="gcashNumber" v-model="gcashNumber" placeholder="e.g., 09XX-XXX-XXXX">
                  </div>
                  <div>
                    <label for="paymentProof" class="form-label fw-semibold">Upload Proof of Payment</label>
                    <input class="form-control" type="file" id="paymentProof" @change="handleFileUpload">
                  </div>
                </div>

                <!-- Bank Check Section -->
                <div v-if="selectedPaymentMethod === 'bank_check'" class="mt-4 p-3 bg-light rounded-3">
                  <h6 class="fw-bold">Bank Check Instructions</h6>
                  <p class="small text-muted">
                    Please prepare a check for the partial payment of
                    <strong>₱{{ partialPayment.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</strong> payable to "RYT-Tyre Inc.".
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
import { useCart } from '../composables/useCart';

const router = useRouter();
const { cart, cartTotal, clearCart, fetchCart } = useCart();

const customerType = ref(null);
const selectedPaymentMethod = ref(null);
const gcashNumber = ref('');
const paymentProofFile = ref(null);
const isProcessing = ref(false);
const serviceFee = ref(0);
const isQrModalOpen = ref(false);

const grandTotal = computed(() => {
  const total = typeof cartTotal.value === 'number' ? cartTotal.value : 0;
  return total + serviceFee.value;
});

const partialPayment = computed(() => {
  const total = typeof cartTotal.value === 'number' ? cartTotal.value : 0;
  return total / 4;
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

const handleSubmit = async () => {
  if (!selectedPaymentMethod.value || cart.value.length === 0) {
    alert('Please select a payment method or add items to your cart.');
    return;
  }

  if ((selectedPaymentMethod.value === 'gcash' || selectedPaymentMethod.value === 'cod') && !paymentProofFile.value) {
    alert('Please upload your proof of payment.');
    return;
  }

  isProcessing.value = true;
  let paymentProofUrl = null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to place an order.');

    const { data: addressData } = await supabase
      .from('addresses')
      .select('full_address, name, phone')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single();

    if (!addressData) throw new Error('Please set a default address before ordering.');

    if (paymentProofFile.value) {
      const fileExt = paymentProofFile.value.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('partialpay_proof')
        .upload(filePath, paymentProofFile.value, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from('partialpay_proof')
        .getPublicUrl(filePath);

      paymentProofUrl = publicUrl;
    }

    const orderData = {
      user_id: user.id,
      username: addressData.name,
      shipping_address: addressData.full_address,
      contact: addressData.phone,
      total_price: grandTotal.value,
      status: 'Order Processed',
      payment_proof_url: paymentProofUrl,
    };

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select('order_id')
      .single();

    if (orderError) throw orderError;

    const orderItems = cart.value.map((item) => ({
      order_id: newOrder.order_id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    for (const item of cart.value) {
      const { error: stockUpdateError } = await supabase.rpc('decrement_stock', {
        product_id_to_update: item.id,
        quantity_to_decrement: item.quantity,
      });
      if (stockUpdateError)
        console.warn(`Could not update stock for product ${item.id}:`, stockUpdateError.message);
    }

    await clearCart();
    alert('✅ Order placed successfully! Redirecting to order tracking...');
    router.push('/order-tracking');
  } catch (err) {
    console.error('Order error:', err.message);
    alert('⚠️ Failed to place order: ' + err.message);
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  fetchCart();
});
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

/* Floating Back Button */
.fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #6c757d;
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

/* QR Styling */
.qr-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qr-image {
  width: 220px;
  max-width: 100%;
  height: auto;
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 6px;
  background-color: #fff;
  cursor: zoom-in;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  image-rendering: crisp-edges;
}
.qr-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

/* Modal for enlarged QR */
.qr-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}
.qr-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}
.qr-modal-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  image-rendering: crisp-edges;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.2);
}
.close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #fff;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }
  .qr-image {
    width: 180px;
  }
  .btn-lg {
    font-size: 1rem;
    padding: 0.8rem;
  }
}
@media (max-width: 480px) {
  h2.card-title {
    font-size: 1.4rem;
  }
  .qr-image {
    width: 150px;
  }
  .payment-option-label {
    padding: 0.8rem;
  }
}
</style>
