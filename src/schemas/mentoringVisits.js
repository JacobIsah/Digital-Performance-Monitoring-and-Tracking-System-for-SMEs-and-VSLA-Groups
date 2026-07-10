export default {
  moduleKey: 'mentoring_visits',
  title: 'Mentoring & Technical Support',
  fields: [
    { name: 'beneficiary', label: 'Beneficiary (optional if targeting a group)', type: 'beneficiary_picker' },
    { name: 'group', label: 'Group (optional if targeting a beneficiary)', type: 'group_picker' },
    { name: 'visit_date', label: 'Visit Date', type: 'date', required: true },
    { name: 'gps', label: 'GPS Location', type: 'gps' },
    { name: 'observations', label: 'Observations', type: 'textarea' },
    { name: 'recommendations', label: 'Recommendations', type: 'textarea' },
    { name: 'challenges', label: 'Challenges', type: 'textarea' },
    { name: 'follow_up_actions', label: 'Follow-up Actions', type: 'textarea' },
  ],
};
