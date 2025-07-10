// src/utils/constants/index.js

// Re-export trực tiếp cho convenience
export * from './ProductConstants';
export * from './BrandConstants';

// Grouped exports cho organization
import * as ProductConstants from './ProductConstants';
import * as BrandConstants from './BrandConstants';

export const CONSTANTS = {
    PRODUCT: ProductConstants,
    BRAND: BrandConstants,
};
