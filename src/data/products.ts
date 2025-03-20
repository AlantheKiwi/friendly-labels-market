
// Export all product data and utilities from a single file
// for backward compatibility and easier imports

export { products, productList } from './products/index';
export { paymentMethods } from './paymentData';
export { getProductBySlug, getProductById } from './productUtils';
