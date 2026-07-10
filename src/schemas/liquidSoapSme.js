export default {
  moduleKey: 'liquid_soap_sme',
  title: 'Liquid Soap SME Monitoring',
  fields: [
    { name: 'beneficiary', label: 'Beneficiary', type: 'beneficiary_picker', required: true },
    { name: 'report_date', label: 'Report Date', type: 'date', required: true },
    { name: 'production_volume_litres', label: 'Production Volume (litres)', type: 'number' },
    { name: 'raw_materials_available', label: 'Raw Materials Available', type: 'checkbox' },
    { name: 'monthly_sales', label: 'Monthly Sales (₦)', type: 'number' },
    { name: 'monthly_profit', label: 'Monthly Profit (₦)', type: 'number' },
    { name: 'customers_served', label: 'Customers Served', type: 'number' },
    { name: 'inventory_value', label: 'Inventory Value (₦)', type: 'number' },
    { name: 'business_expansion', label: 'Business Expansion', type: 'checkbox' },
    { name: 'employees_created', label: 'Employees Created', type: 'number' },
  ],
};
