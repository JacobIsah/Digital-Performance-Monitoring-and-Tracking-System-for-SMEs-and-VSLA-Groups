export default {
  moduleKey: 'red_oil_enterprise',
  title: 'Red Oil Enterprise Monitoring',
  fields: [
    { name: 'beneficiary', label: 'Beneficiary', type: 'beneficiary_picker', required: true },
    { name: 'report_date', label: 'Report Date', type: 'date', required: true },
    { name: 'quantity_received_litres', label: 'Quantity Received (litres)', type: 'number' },
    { name: 'daily_sales', label: 'Daily Sales (₦)', type: 'number' },
    { name: 'monthly_sales', label: 'Monthly Sales (₦)', type: 'number' },
    { name: 'profit', label: 'Profit (₦)', type: 'number' },
    { name: 'customers_served', label: 'Customers Served', type: 'number' },
  ],
};
