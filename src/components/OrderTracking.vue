<template>
  <div class="order-tracking-page">
    <div class="container py-5">
      <h2 class="fw-bold mb-5 section-title text-center">Order Tracking</h2>

      <div class="card shadow-sm mb-4 order-card">
        <div class="card-header bg-white d-flex flex-wrap justify-content-between align-items-center py-3">
          <div>
            <h6 class="fw-bold mb-1">Order #RYT-10521</h6>
            <p class="text-muted small mb-0">Placed on October 4, 2025</p>
          </div>
          <div>
            <span class="fw-bold me-3">Total: ₱7,800.00</span>
            <a href="#" class="btn btn-sm btn-outline-primary rounded-pill">View Invoice</a>
          </div>
        </div>
        <div class="card-body p-4">
          <h6 class="fw-bold mb-4">Status: <span class="text-success">Delivered</span></h6>
          
          <div class="status-tracker">
            <div class="step completed">
              <div class="icon"><i class="fas fa-check"></i></div>
              <div class="label">Order Placed</div>
            </div>
            <div class="connector completed"></div>
            <div class="step completed">
              <div class="icon"><i class="fas fa-check"></i></div>
              <div class="label">Processing</div>
            </div>
            <div class="connector completed"></div>
            <div class="step completed">
              <div class="icon"><i class="fas fa-check"></i></div>
              <div class="label">Shipped</div>
            </div>
            <div class="connector completed"></div>
            <div class="step completed">
              <div class="icon"><i class="fas fa-check"></i></div>
              <div class="label">Delivered</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm mb-4 order-card">
        <div class="card-header bg-white d-flex flex-wrap justify-content-between align-items-center py-3">
          <div>
            <h6 class="fw-bold mb-1">Order #RYT-10533</h6>
            <p class="text-muted small mb-0">Placed on October 5, 2025</p>
          </div>
          <div>
            <span class="fw-bold me-3">Total: ₱3,500.00</span>
            <a href="#" class="btn btn-sm btn-outline-primary rounded-pill">View Invoice</a>
          </div>
        </div>
        <div class="card-body p-4">
          <h6 class="fw-bold mb-4">Status: <span class="text-primary">Shipped</span></h6>
          <div class="status-tracker">
            <div class="step completed"><div class="icon"><i class="fas fa-check"></i></div><div class="label">Order Placed</div></div>
            <div class="connector completed"></div>
            <div class="step completed"><div class="icon"><i class="fas fa-check"></i></div><div class="label">Processing</div></div>
            <div class="connector completed"></div>
            <div class="step active"><div class="icon"><i class="fas fa-shipping-fast"></i></div><div class="label">Shipped</div></div>
            <div class="connector"></div>
            <div class="step"><div class="icon"><i class="fas fa-box-open"></i></div><div class="label">Delivered</div></div>
          </div>
        </div>
      </div>

    </div>
    </div>
</template>

<script setup>
// Logic will be added later
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=Roboto:wght@400&display=swap');

.order-tracking-page {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f9fa;
}
.section-title { font-family: 'Poppins', sans-serif; }
.order-card { border: none; }
.card-header h6 { font-family: 'Poppins', sans-serif; }

/* Status Tracker Styles */
.status-tracker {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.step {
  text-align: center;
  width: 100px; /* Width for each step label */
}
.step .icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #adb5bd;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 3px solid #e9ecef;
}
.step .label {
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6c757d;
}
.step.active .icon {
  background-color: #e7f1ff;
  color: #0d6efd;
  border-color: #0d6efd;
}
.step.active .label { color: #0d6efd; }
.step.completed .icon {
  background-color: #198754;
  color: #fff;
  border-color: #198754;
}
.step.completed .label { color: #198754; }

.connector {
  flex-grow: 1;
  height: 4px;
  background-color: #e9ecef;
  margin-top: 18px;
}
.connector.completed { background-color: #198754; }
</style>