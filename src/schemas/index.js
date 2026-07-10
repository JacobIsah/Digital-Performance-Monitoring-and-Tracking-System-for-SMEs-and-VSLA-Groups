import beneficiaries from './beneficiaries';
import vslaPerformance from './vslaPerformance';
import liquidSoapSme from './liquidSoapSme';
import goatEnterprise from './goatEnterprise';
import vegetableEnterprise from './vegetableEnterprise';
import redOilEnterprise from './redOilEnterprise';
import cocoaFarmer from './cocoaFarmer';
import mentoringVisits from './mentoringVisits';
import householdAssessment from './householdAssessment';

export const MODULE_SCHEMAS = [
  beneficiaries,
  vslaPerformance,
  liquidSoapSme,
  goatEnterprise,
  vegetableEnterprise,
  redOilEnterprise,
  cocoaFarmer,
  mentoringVisits,
  householdAssessment,
];

export const SCHEMA_BY_KEY = Object.fromEntries(MODULE_SCHEMAS.map((s) => [s.moduleKey, s]));
