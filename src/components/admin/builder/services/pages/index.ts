export * from './types';
export * from './PageService';
export * from './utils/diffUtils';

import { PageService } from './PageService';

// Export singleton instance
export const pageService = new PageService();

// Export default
export default pageService;