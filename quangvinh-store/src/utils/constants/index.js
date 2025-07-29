// src/utils/constants/index.js

// Re-export trực tiếp cho convenience
export * from './ProductConstants';
export * from './BrandConstants';
export * from './CategoryConstants';
export * from './SNSConstants';
export * from './StoreConstants';
export * from './DashboardConstants';
export * from './StarRateConstants.js';
export * from './PoliciesConstants.js';
export * from './OrderConstants.js';
export * from './CustomerConstants.js';
export * from './EmployeeConstants.js';

// Grouped exports cho organization
import * as ProductConstants from './ProductConstants';
import * as BrandConstants from './BrandConstants';
import * as CategoryConstants from './CategoryConstants';
import * as SNSConstants from './SNSConstants';
import * as StoreConstants from './StoreConstants';
import * as DashboardConstants from './DashboardConstants';
import * as StarRateConstants from './StarRateConstants';
import * as PoliciesConstants from './PoliciesConstants';
import * as OrderConstants from './OrderConstants';
import * as CustomerConstants from './CustomerConstants';
import * as EmployeeConstants from './EmployeeConstants';

export const CONSTANTS = {
    PRODUCT: ProductConstants,
    BRAND: BrandConstants,
    CATEGORY: CategoryConstants,
    SNS: SNSConstants,
    Store: StoreConstants,
    Dashboard: DashboardConstants,
    StarRate: StarRateConstants,
    Policies: PoliciesConstants,
    Order: OrderConstants,
    Customer: CustomerConstants,
    Employee: EmployeeConstants,
};
