import { Product } from '@/types';

const none = {
  salaryIncome: false,
  studentIncome: false,
  medicalExpenses: false,
  donations: false,
  employmentExpenses: false,
  investmentIncome: false,
  capitalGains: false,
  foreignIncome: false,
  rentalIncome: false,
  freelanceIncome: false,
  gigWorkIncome: false,
  businessRevenue: false,
  businessExpenses: false,
  homeOfficeExpenses: false,
  vehicleExpenses: false,
  expertHelp: false,
  fullService: false,
  corporateFiling: false,
  nilCorporateReturn: false,
};

export const products: Product[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'CAD',
    description: 'Simple personal tax software for basic returns.',
    category: 'personal',
    bestFor: ['Salary income', 'Student income', 'Basic personal return', 'Simple tax slips'],
    supports: {
      ...none,
      salaryIncome: true,
      studentIncome: true,
    },
  },
  {
    id: 'deluxe',
    name: 'Deluxe',
    price: 30,
    currency: 'CAD',
    description: 'For common deductions and employment-related expenses.',
    category: 'personal',
    bestFor: ['Medical expenses', 'Donations', 'Employment expenses', 'Family-related deductions'],
    supports: {
      ...none,
      salaryIncome: true,
      studentIncome: true,
      medicalExpenses: true,
      donations: true,
      employmentExpenses: true,
    },
  },
  {
    id: 'premier',
    name: 'Premier',
    price: 50,
    currency: 'CAD',
    description: 'For investments, rental income, capital gains, or foreign income.',
    category: 'personal',
    bestFor: ['Investment income', 'Capital gains', 'Foreign income', 'Rental income'],
    supports: {
      ...none,
      salaryIncome: true,
      studentIncome: true,
      medicalExpenses: true,
      donations: true,
      employmentExpenses: true,
      investmentIncome: true,
      capitalGains: true,
      foreignIncome: true,
      rentalIncome: true,
    },
  },
  {
    id: 'self-employed',
    name: 'Self-Employed',
    price: 70,
    currency: 'CAD',
    description: 'For freelancers, contractors, gig workers, and sole proprietors.',
    category: 'personal',
    bestFor: [
      'Freelance income',
      'Gig-work income',
      'Business expenses',
      'Home-office expenses',
      'Vehicle expenses',
    ],
    supports: {
      ...none,
      salaryIncome: true,
      studentIncome: true,
      medicalExpenses: true,
      donations: true,
      investmentIncome: true,
      rentalIncome: true,
      freelanceIncome: true,
      gigWorkIncome: true,
      businessRevenue: true,
      businessExpenses: true,
      homeOfficeExpenses: true,
      vehicleExpenses: true,
    },
  },
  {
    id: 'expert-assist',
    name: 'Expert Assist',
    price: 120,
    currency: 'CAD',
    description: 'File yourself with help from a tax expert.',
    category: 'expert',
    bestFor: ['Expert chat', 'Expert video call', 'Expert review before filing'],
    supports: {
      ...none,
      salaryIncome: true,
      studentIncome: true,
      medicalExpenses: true,
      donations: true,
      employmentExpenses: true,
      investmentIncome: true,
      capitalGains: true,
      foreignIncome: true,
      rentalIncome: true,
      freelanceIncome: true,
      gigWorkIncome: true,
      businessRevenue: true,
      businessExpenses: true,
      homeOfficeExpenses: true,
      vehicleExpenses: true,
      expertHelp: true,
    },
  },
  {
    id: 'expert-full-service',
    name: 'Expert Full Service',
    price: 250,
    currency: 'CAD',
    description: 'An expert prepares and files your return for you.',
    category: 'expert',
    bestFor: ['Document upload', 'Expert prepares return', 'Expert files return', 'Progress tracking'],
    supports: {
      ...none,
      salaryIncome: true,
      studentIncome: true,
      medicalExpenses: true,
      donations: true,
      employmentExpenses: true,
      investmentIncome: true,
      capitalGains: true,
      foreignIncome: true,
      rentalIncome: true,
      freelanceIncome: true,
      gigWorkIncome: true,
      businessRevenue: true,
      businessExpenses: true,
      homeOfficeExpenses: true,
      vehicleExpenses: true,
      expertHelp: true,
      fullService: true,
    },
  },
  {
    id: 'business-corporate',
    name: 'Business Corporate',
    price: 400,
    currency: 'CAD',
    description: 'Corporate tax return for incorporated companies with revenue.',
    category: 'corporate',
    bestFor: ['Corporate tax return', 'Business revenue', 'Business expenses', 'Corporate filing review'],
    supports: {
      ...none,
      businessRevenue: true,
      businessExpenses: true,
      corporateFiling: true,
    },
  },
  {
    id: 'nil-corporate-return',
    name: 'Nil Corporate Return',
    price: 175,
    currency: 'CAD',
    description: 'Nil return filing for incorporated companies with no revenue.',
    category: 'corporate',
    bestFor: ['Incorporated company filing', 'No-revenue company', 'Nil return'],
    supports: {
      ...none,
      corporateFiling: true,
      nilCorporateReturn: true,
    },
  },
];

export function getProduct(id: string): Product {
  const product = products.find((item) => item.id === id);
  if (!product) {
    throw new Error(`Unknown product id: ${id}`);
  }
  return product;
}

export function getSupportedFeatures(product: Product): string[] {
  return Object.entries(product.supports)
    .filter(([, supported]) => supported)
    .map(([key]) => key);
}

export function getUnsupportedFeatures(product: Product): string[] {
  return Object.entries(product.supports)
    .filter(([, supported]) => !supported)
    .map(([key]) => key);
}
