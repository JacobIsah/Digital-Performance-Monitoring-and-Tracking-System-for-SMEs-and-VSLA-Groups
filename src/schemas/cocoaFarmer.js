export default {
  moduleKey: 'cocoa_farmer',
  title: 'Cocoa Farmer Monitoring',
  fields: [
    { name: 'beneficiary', label: 'Beneficiary', type: 'beneficiary_picker', required: true },
    { name: 'report_date', label: 'Report Date', type: 'date', required: true },
    { name: 'farm_size_hectares', label: 'Farm Size (hectares)', type: 'number' },
    { name: 'gap_adoption', label: 'GAP Adoption', type: 'checkbox' },
    { name: 'pruning_status', label: 'Pruning Status', type: 'text' },
    { name: 'shade_management_status', label: 'Shade Management Status', type: 'text' },
    { name: 'fertilizer_application', label: 'Fertilizer Application', type: 'text' },
    { name: 'pest_control_method', label: 'Pest Control Method', type: 'text' },
    { name: 'yield_kg', label: 'Yield (kg)', type: 'number' },
    { name: 'cocoa_sales', label: 'Cocoa Sales (₦)', type: 'number' },
  ],
};
