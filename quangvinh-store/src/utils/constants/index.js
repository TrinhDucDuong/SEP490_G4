// src/utils/constants/index.js

// Re-export trực tiếp cho convenience
export * from './ProductConstants';
export * from './BrandConstants';
export * from './CategoryConstants';

// Grouped exports cho organization
import * as ProductConstants from './ProductConstants';
import * as BrandConstants from './BrandConstants';
import * as CategoryConstants from './CategoryConstants';

export const CONSTANTS = {
    PRODUCT: ProductConstants,
    BRAND: BrandConstants,
    CATEGORY: CategoryConstants,
};
