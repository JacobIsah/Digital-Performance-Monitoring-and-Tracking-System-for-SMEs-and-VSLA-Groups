export default {
  moduleKey: 'household_assessment',
  title: 'Household Livelihood Assessment',
  fields: [
    { name: 'beneficiary', label: 'Beneficiary', type: 'beneficiary_picker', required: true },
    { name: 'assessment_date', label: 'Assessment Date', type: 'date', required: true },
    { name: 'household_income', label: 'Household Income (₦)', type: 'number' },
    { name: 'assets_acquired', label: 'Assets Acquired', type: 'textarea' },
    { name: 'food_security_status', label: 'Food Security Status', type: 'select',
      options: ['secure', 'moderately_insecure', 'severely_insecure'] },
    { name: 'children_in_school', label: 'Children in School', type: 'number' },
    { name: 'financial_inclusion_status', label: 'Financial Inclusion', type: 'select',
      options: ['banked', 'mobile_money', 'unbanked'] },
    { name: 'housing_improvement', label: 'Housing Improvement', type: 'checkbox' },
    { name: 'business_diversification', label: 'Business Diversification', type: 'checkbox' },
  ],
};
