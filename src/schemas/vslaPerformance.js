export default {
  moduleKey: 'vsla_performance',
  title: 'VSLA Performance',
  fields: [
    { name: 'group', label: 'VSLA Group', type: 'group_picker', required: true },
    { name: 'meeting_date', label: 'Meeting Date', type: 'date', required: true },
    { name: 'membership_total', label: 'Total Membership', type: 'number' },
    { name: 'attendance_count', label: 'Attendance Count', type: 'number' },
    { name: 'savings_amount', label: 'Savings Amount (₦)', type: 'number' },
    { name: 'loans_disbursed', label: 'Loans Disbursed (₦)', type: 'number' },
    { name: 'loans_recovered', label: 'Loans Recovered (₦)', type: 'number' },
    { name: 'share_purchase', label: 'Share Purchase (₦)', type: 'number' },
    { name: 'social_fund', label: 'Social Fund (₦)', type: 'number' },
    { name: 'share_out_value', label: 'Share-Out Value (₦)', type: 'number' },
    { name: 'governance_score', label: 'Governance Score (0-100)', type: 'number' },
    { name: 'record_keeping_score', label: 'Record Keeping Score (0-100)', type: 'number' },
    { name: 'leadership_score', label: 'Leadership Score (0-100)', type: 'number' },
  ],
};
