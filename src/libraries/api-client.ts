import apiClientSimple from './api-client-simple.ts';
import apiClientAdvanced from './api-client-advanced.ts';

const mode: 'simple' | 'advanced' = 'simple';

const apiClient = mode === 'advanced' ? apiClientSimple : apiClientAdvanced; // Default export for simplicity

export { apiClient }; // Export both for flexibility