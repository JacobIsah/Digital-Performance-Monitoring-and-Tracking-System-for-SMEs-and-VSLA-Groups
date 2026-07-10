export default {
  moduleKey: 'vegetable_enterprise',
  title: 'Vegetable Enterprise Monitoring',
  fields: [
    { name: 'beneficiary', label: 'Beneficiary', type: 'beneficiary_picker', required: true },
    { name: 'report_date', label: 'Report Date', type: 'date', required: true },
    { name: 'vegetable_type', label: 'Vegetable Type', type: 'text' },
    { name: 'area_cultivated_hectares', label: 'Area Cultivated (hectares)', type: 'number' },
    { name: 'seed_utilization_kg', label: 'Seed Utilization (kg)', type: 'number' },
    { name: 'yield_kg', label: 'Yield (kg)', type: 'number' },
    { name: 'sales', label: 'Sales (₦)', type: 'number' },
    { name: 'profit', label: 'Profit (₦)', type: 'number' },
    { name: 'irrigation_method', label: 'Irrigation Method', type: 'text' },
    { name: 'pest_incidence_level', label: 'Pest Incidence', type: 'select',
      options: ['none', 'low', 'moderate', 'severe'] },
  ],
};
