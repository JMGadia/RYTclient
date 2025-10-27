<template>
  <div class="import-product-container">
    <h1>Add New Product to Catalog</h1>

    <div class="image-upload-box" :class="{ 'error-border': validationErrors.image }">
      <label for="productImage">Import Image</label>
      <input type="file" id="productImage" @change="handleImageUpload" accept="image/*" />
      <div v-if="imageUrl" class="image-preview">
        <img :src="imageUrl" alt="Product Image Preview" />
      </div>
      <p v-if="validationErrors.image" class="error-message">
        {{ validationErrors.image }}
      </p>
    </div>

    <div class="product-details-grid">
      <div class="detail-box" :class="{ 'error-border': validationErrors.brand }">
        <label for="brand">Brand</label>
        <input type="text" id="brand" v-model="product.brand" placeholder="e.g., Michelin" />
        <p v-if="validationErrors.brand" class="error-message">
          {{ validationErrors.brand }}
        </p>
      </div>

      <div class="detail-box" :class="{ 'error-border': validationErrors.size }">
        <label for="size">Size</label>
        <input
            type="text"
            id="size"
            v-model="product.size"
            placeholder="e.g., 205/55R16"
        />
        <p v-if="validationErrors.size" class="error-message">
          {{ validationErrors.size }}
        </p>
      </div>

      <div class="detail-box" :class="{ 'error-border': validationErrors.product_type }">
        <label for="productType">Product Type</label>
        <select id="productType" v-model="product.product_type">
          <option disabled value="">Select a type</option>
          <option v-for="type in productTypeOptions" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <p v-if="validationErrors.product_type" class="error-message">
          {{ validationErrors.product_type }}
        </p>
      </div>

      <div class="detail-box" :class="{ 'error-border': validationErrors.car_brand }">
        <label for="carBrand">Car Brand</label>
        <select id="carBrand" v-model="product.car_brand">
          <option value="">Select a brand (Optional for Non-Tires)</option>
          <option v-for="car in carBrandOptions" :key="car" :value="car">
            {{ car }}
          </option>
        </select>
        <p v-if="validationErrors.car_brand" class="error-message">
          {{ validationErrors.car_brand }}
        </p>
      </div>

      <div class="detail-box" :class="{ 'error-border': validationErrors.price }">
        <label for="price">Price (₱)</label>
        <input type="number" id="price" v-model.number="product.price" placeholder="e.g., 4500.50" min="0" />
        <p v-if="validationErrors.price" class="error-message">
          {{ validationErrors.price }}
        </p>
      </div>

      </div>

    <div class="import-button-box">
      <button @click="submitProduct" :disabled="isSubmitting">
        {{ isSubmitting ? 'Adding...' : 'Add Product' }}
      </button>
    </div>
  </div>
</template>

<script setup>
// --- IMPORTS & SETUP ---
import { ref } from 'vue'; // Core Vue function for reactive state
import { useRouter } from 'vue-router'; // Vue Router for navigation
// API service functions for image upload and product creation
import { uploadProductImage, createProduct } from '../services/apiService';

// Initialize the router
const router = useRouter();

// --- PRODUCT DATA STATE ---

// Reactive object to hold the data for the new product being created
const product = ref({
  brand: '',
  size: '',
  product_type: '',
  car_brand: '', // Initialize to an empty string to match the default select option
  price: null,
  // MODIFIED: Status is hardcoded to 'Out of Stock' for imported products
  status: 'Out of Stock',
  image_url: null // Stores the final cloud path/URL of the uploaded image
});

// --- UI AND UTILITY STATE ---

// State variables related to image handling and form submission
const selectedFile = ref(null); // Holds the actual File object selected by the user
const imageUrl = ref(''); // Local URL to display the selected image preview
const isSubmitting = ref(false); // Boolean to prevent multiple form submissions
// NEW: State for validation errors
const validationErrors = ref({});


// --- DROPDOWN OPTIONS DATA ---
// ... (tireSizeOptions remains unchanged) ...
const tireSizeOptions = ref([
  {
    label: 'Passenger Car & Crossover',
    groups: [
      {
        label: '13-Inch Rims',
        sizes: [
          '155/80R13', '165/65R13', '175/70R13'
        ]
      },
      {
        label: '14-Inch Rims',
        sizes: [
          '165/65R14', '175/65R14', '185/60R14', '185/65R14', '185/70R14'
        ]
      },
      {
        label: '15-Inch Rims',
        sizes: [
          '175/65R15', '185/55R15', '185/60R15', '185/65R15', '195/55R15',
          '195/60R15', '195/65R15'
        ]
      },
      {
        label: '16-Inch Rims',
        sizes: [
          '195/55R16', '205/55R16', '205/60R16', '215/60R16', '215/65R16'
        ]
      },
      {
        label: '17-Inch Rims',
        sizes: [
          '205/45R17', '205/50R17', '215/45R17', '215/50R17', '215/55R17',
          '225/45R17', '225/50R17'
        ]
      },
      {
        label: '18-Inch Rims',
        sizes: [
          '225/40R18', '225/45R18', '235/40R18', '235/45R18'
        ]
      },
    ]
  },
  {
    label: 'SUV & Light Truck',
    groups: [
      {
        label: '15-Inch Rims',
        sizes: [ '205/70R15', '215/70R15', '225/70R15', '235/75R15', '31X10.50R15'
        ]
      },
      {
        label: '16-Inch Rims',
        sizes: [
          '235/70R16', '245/70R16', '265/70R16', '265/75R16'
        ]
      },
      {
        label: '17-Inch Rims',
        sizes: [
          '225/65R17', '245/65R17', '265/65R17', '265/70R17'
        ]
      },
      {
        label: '18-Inch Rims',
        sizes: [
          '265/60R18', '265/65R18', '285/60R18'
        ]
      },
      {
        label: '20-Inch Rims',
        sizes: [
          '265/50R20', '275/55R20'
        ]
      },
    ]
  }
]);
// ... (carBrandOptions remains unchanged) ...
const carBrandOptions = ref([
  'Toyota', 'Mitsubishi', 'Ford', 'Nissan', 'Suzuki',
  'Honda', 'Isuzu', 'Hyundai', 'Kia'
]);
// ... (productTypeOptions remains unchanged) ...
const productTypeOptions = ref(['Tires', 'Non-Tires']);


// --- VALIDATION LOGIC ---

/**
 * Checks all required fields and the image upload status.
 * Updates the validationErrors ref.
 * @returns {boolean} - True if validation passes, false otherwise.
 */
const validateForm = () => {
  validationErrors.value = {}; // Reset errors
  let isValid = true;

  // 1. Check for image
  if (!selectedFile.value) {
    validationErrors.value.image = 'Product image is required.';
    isValid = false;
  }

  // 2. Check general required fields
  const generalRequiredFields = ['brand', 'size', 'product_type'];

  generalRequiredFields.forEach(field => {
    // Check if the field is empty (string is empty or only whitespace)
    if (!product.value[field] || (typeof product.value[field] === 'string' && product.value[field].trim() === '')) {
      validationErrors.value[field] = `${field.replace('_', ' ')} is required.`;
      isValid = false;
    }
  });

  // MODIFICATION 2: Conditional check for 'car_brand'
  // 'car_brand' is required ONLY IF 'product_type' is 'Tires'.
  const isTyreProduct = product.value.product_type === 'Tires';

  if (isTyreProduct) {
    if (!product.value.car_brand || product.value.car_brand.trim() === '') {
      validationErrors.value.car_brand = 'Car Brand is required for Tires.';
      isValid = false;
    }
  }
  // For 'Non-Tires', car_brand is NOT required. We ensure it's saved as null/empty if not selected.
  // The 'product.car_brand' model will be an empty string if no option is selected, which is fine for Non-Tires.

  // 3. Check Price field (null or positive number)
  if (product.value.price === null || product.value.price === '') {
    validationErrors.value.price = 'Price is Required, Make sure its Number.';
    isValid = false;
  } else if (isNaN(product.value.price) || product.value.price <= 0) {
    // The v-model.number ensures product.value.price is a number (or null/empty string if input is invalid),
    // but the isNaN check is a strong final guard.
    validationErrors.value.price = 'Price must be a positive number.';
    isValid = false;
  }

  return isValid;
};


// --- COMPONENT FUNCTIONS ---

/**
 * Handles the selection of a new image file for the product.
 */
const handleImageUpload = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    // Creates a temporary local URL for immediate image preview
    imageUrl.value = URL.createObjectURL(selectedFile.value);
    // Clear the image error when a file is selected
    if (validationErrors.value.image) delete validationErrors.value.image;
  } else {
    imageUrl.value = '';
  }
};

/**
 * Handles the final submission of the product creation form.
 */
const submitProduct = async () => {
  if (isSubmitting.value) return; // Prevent double submission

  // 🛑 STEP 1: Run validation before proceeding
  if (!validateForm()) {
    return; // STOP execution if validation fails
  }

  isSubmitting.value = true;

  try {
    // STEP 2: Upload image (we know a file is selected due to validation)
    const imagePath = await uploadProductImage(selectedFile.value);
    // Store the returned image path/URL on the product object
      product.value.image_url = imagePath;

    // MODIFICATION 3 (Cleanup): Ensure car_brand is an empty string for Non-Tires if it's not selected
    if (product.value.product_type === 'Non-Tires' && !product.value.car_brand) {
      product.value.car_brand = ''; // Or null, depending on your backend's preference. Empty string is common for DB fields.
    }

    // STEP 3: Create the product record
    await createProduct(product.value);

    // Success feedback and redirection
    alert('Product added to catalog successfully! ✅');
      router.push('/super-admin');

  } catch (error) {
    alert(`Error: Failed to add product. Please try again. Details: ${error.message}`);
  } finally {
    isSubmitting.value = false; // Reset submission state
  }
};
</script>

<style scoped>
/* Add this rule to fix invisible dropdown text */
.detail-box select option {
color: #000;}

.import-product-container { max-width: 800px; margin: 40px auto; padding: 30px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; }
h1 { text-align: center; color: #333; margin-bottom: 30px; }

/* NEW: Styles for error display */
.error-message {
    color: #dc3545; /* Red color for error text */
    font-size: 0.9em;
    margin-top: 5px;
    font-weight: bold;
}
.error-border {
    border-color: #dc3545 !important; /* Red border for the box */
}
/* Ensure input/select fields inside an error-bordered detail-box also have a red border */
.detail-box.error-border input[type="text"],
.detail-box.error-border input[type="number"],
.detail-box.error-border select {
    border-color: #dc3545;
}
.image-upload-box.error-border {
    border: 2px dashed #dc3545 !important;
}
/* End of NEW styles for error display */


.image-upload-box { border: 2px dashed #ccc; padding: 25px; text-align: center; margin-bottom: 30px; border-radius: 8px; background-color: #fff; }
.image-upload-box label { display: block; font-weight: bold; margin-bottom: 15px; color: #555; font-size: 1.1em; }
.image-upload-box input[type="file"] { display: block; margin: 0 auto 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f0f0f0; }
.image-preview img { max-width: 200px; max-height: 200px; border-radius: 5px; margin-top: 15px; border: 1px solid #eee; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); }
.product-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 30px; }
.detail-box { background-color: #fff; border: 1px solid #eee; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03); }
.detail-box label { display: block; font-weight: bold; margin-bottom: 8px; color: #555; }
.detail-box input[type="text"], .detail-box input[type="number"], .detail-box select {
    width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 1em; box-sizing: border-box; background-color: #fff;
}
.detail-box select {
    appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 0.65em auto;
}
.detail-box input:focus, .detail-box select:focus { border-color: #007bff; box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); outline: none; }
.import-button-box { text-align: center; }
.import-button-box button { background-color: #28a745; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-size: 1.2em; cursor: pointer; transition: background-color 0.3s ease, transform 0.2s ease; }
.import-button-box button:hover { background-color: #218838; transform: translateY(-2px); }
.import-button-box button:active { background-color: #1e7e34; transform: translateY(0); }
.import-button-box button:disabled { background-color: #6c757d; cursor: not-allowed; }
</style>