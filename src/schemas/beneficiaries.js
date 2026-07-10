export default {
  moduleKey: 'beneficiaries',
  title: 'Beneficiary Registration',
  fields: [
    { name: 'beneficiary_code', label: 'Beneficiary Code', type: 'text', required: true },
    { name: 'group', label: 'VSLA Group', type: 'group_picker' },
    { name: 'full_name', label: 'Full Name', type: 'text', required: true },
    { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female'] },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'phone_number', label: 'Phone Number', type: 'text' },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'lga', label: 'LGA', type: 'text', required: true },
    { name: 'community', label: 'Community', type: 'text' },
    { name: 'gps', label: 'GPS Location', type: 'gps' },
    { name: 'enterprise_type', label: 'Enterprise Type', type: 'select',
      options: ['liquid_soap', 'goat', 'vegetable', 'red_oil', 'cocoa'] },
    { name: 'date_supported', label: 'Date Supported', type: 'date' },
  ],
};
