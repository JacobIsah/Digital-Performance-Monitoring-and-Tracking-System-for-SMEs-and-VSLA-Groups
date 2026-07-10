export default {
  moduleKey: 'goat_enterprise',
  title: 'Goat Enterprise Monitoring',
  fields: [
    { name: 'beneficiary', label: 'Beneficiary', type: 'beneficiary_picker', required: true },
    { name: 'report_date', label: 'Report Date', type: 'date', required: true },
    { name: 'goats_received', label: 'Goats Received', type: 'number' },
    { name: 'goats_surviving', label: 'Goats Surviving', type: 'number' },
    { name: 'births_kids', label: 'Births (Kids)', type: 'number' },
    { name: 'mortalities', label: 'Mortalities', type: 'number' },
    { name: 'vaccination_status', label: 'Vaccination Status', type: 'text' },
    { name: 'housing_status', label: 'Housing Status', type: 'text' },
    { name: 'feeding_status', label: 'Feeding Status', type: 'text' },
    { name: 'sales_count', label: 'Sales Count', type: 'number' },
    { name: 'income', label: 'Income (₦)', type: 'number' },
  ],
};
