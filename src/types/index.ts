export type FeatureKey =
  | 'salaryIncome'
  | 'studentIncome'
  | 'medicalExpenses'
  | 'donations'
  | 'employmentExpenses'
  | 'investmentIncome'
  | 'capitalGains'
  | 'foreignIncome'
  | 'rentalIncome'
  | 'freelanceIncome'
  | 'gigWorkIncome'
  | 'businessRevenue'
  | 'businessExpenses'
  | 'homeOfficeExpenses'
  | 'vehicleExpenses'
  | 'expertHelp'
  | 'fullService'
  | 'corporateFiling'
  | 'nilCorporateReturn';

export type Product = {
  id: string;
  name: string;
  price: number;
  currency: 'CAD';
  description: string;
  bestFor: string[];
  category: 'personal' | 'expert' | 'corporate';
  supports: Record<FeatureKey, boolean>;
};

export type FilingType = 'personal' | 'self-employed' | 'incorporated';
export type HelpPreference = 'self' | 'expert-help' | 'expert-file';
export type CompanyRevenue = 'yes' | 'no' | '';

export type QuestionnaireAnswers = {
  filingType: FilingType | '';
  incomeSources: FeatureKey[];
  deductions: FeatureKey[];
  noSpecialDeductions: boolean;
  helpPreference: HelpPreference | '';
  companyRevenue: CompanyRevenue;
};

export type RecommendationResult = {
  recommendedProductId: string;
  recommendedProductName: string;
  price: number;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
  matchedInputs: string[];
  optionalUpgrade?: {
    productId: string;
    productName: string;
    reason: string;
  };
  warnings?: string[];
  disclaimer: string;
};

export type AssistantResponse = {
  answer: string;
  recommendedProduct: string | null;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
  disclaimer: string;
};
