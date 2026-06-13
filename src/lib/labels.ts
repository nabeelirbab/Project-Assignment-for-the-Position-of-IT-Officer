import { FeatureKey } from '@/types';

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  salaryIncome: 'Salary income',
  studentIncome: 'Student income',
  medicalExpenses: 'Medical expenses',
  donations: 'Donations',
  employmentExpenses: 'Employment expenses',
  investmentIncome: 'Investment income',
  capitalGains: 'Capital gains',
  foreignIncome: 'Foreign income',
  rentalIncome: 'Rental income',
  freelanceIncome: 'Freelance income',
  gigWorkIncome: 'Gig-work income',
  businessRevenue: 'Business revenue',
  businessExpenses: 'Business expenses',
  homeOfficeExpenses: 'Home-office expenses',
  vehicleExpenses: 'Vehicle expenses',
  expertHelp: 'Expert help',
  fullService: 'Full service filing',
  corporateFiling: 'Corporate filing',
  nilCorporateReturn: 'Nil corporate return',
};

export const INCOME_OPTIONS: FeatureKey[] = [
  'salaryIncome',
  'studentIncome',
  'investmentIncome',
  'capitalGains',
  'rentalIncome',
  'freelanceIncome',
  'gigWorkIncome',
  'businessRevenue',
  'foreignIncome',
];

export const DEDUCTION_OPTIONS: FeatureKey[] = [
  'medicalExpenses',
  'donations',
  'employmentExpenses',
  'homeOfficeExpenses',
  'vehicleExpenses',
  'businessExpenses',
];

export const COMPARISON_FEATURES: FeatureKey[] = [
  'salaryIncome',
  'donations',
  'medicalExpenses',
  'investmentIncome',
  'rentalIncome',
  'freelanceIncome',
  'businessExpenses',
  'expertHelp',
  'fullService',
  'corporateFiling',
  'nilCorporateReturn',
];

export function formatFeature(key: FeatureKey): string {
  return FEATURE_LABELS[key];
}
