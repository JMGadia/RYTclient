// src/services/apiService.js
import { supabase } from '../server/supabase'; // Import the initialized Supabase client

// --- THIS IS YOUR EXISTING CODE ---
/**
 * Fetches all products from the database.
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error.message);
  }
  return { data, error };
}

/**
 * Constructs the public URL for a product image.
 */
export function getProductImageURL(imagePath) {
    if (!imagePath) return null;
    const { data } = supabase
        .storage
        .from('product_assets')
        .getPublicUrl(imagePath);
    return data.publicUrl;
}

// --- ADD THESE NEW FUNCTIONS BENEATH THE EXISTING CODE ---

/**
 * Uploads a product image to the 'product_assets' storage bucket.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - The path of the uploaded file.
 */
export async function uploadProductImage(file) {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('product_assets')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error.message);
    throw error;
  }

  return filePath;
}

/**
 * Inserts a new product record into the 'products' table.
 * @param {object} productData - The product data from the form.
 */
export async function createProduct(productData) {
  const { error } = await supabase
    .from('products')
    .insert([productData]);

  if (error) {
    console.error('Error creating product:', error.message);
    throw error;
  }
}