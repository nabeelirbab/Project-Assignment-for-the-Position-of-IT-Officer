import { getProduct } from '@/data/products';
import {
  detectContradictions,
  DISCLAIMER,
  effectiveDeductions,
  validateAnswers,
} from '@/lib/validation';
import { FEATURE_LABELS } from '@/lib/labels';
import {
  FeatureKey,
  QuestionnaireAnswers,
  RecommendationResult,
} from '@/types';

const SELF_EMPLOYED_TRIGGERS: FeatureKey[] = [
  'freelanceIncome',
  'gigWorkIncome',
  'businessRevenue',
  'businessExpenses',
  'homeOfficeExpenses',
  'vehicleExpenses',
];

const PREMIER_TRIGGERS: FeatureKey[] = [
  'investmentIncome',
  'capitalGains',
  'rentalIncome',
  'foreignIncome',
];

const DELUXE_TRIGGERS: FeatureKey[] = [
  'medicalExpenses',
  'donations',
  'employmentExpenses',
];

function buildResult(
  productId: string,
  reasons: string[],
  matchedInputs: string[],
  warnings: string[] = [],
  optionalUpgrade?: RecommendationResult['optionalUpgrade'],
): RecommendationResult {
  const product = getProduct(productId);

  return {
    recommendedProductId: product.id,
    recommendedProductName: product.name,
    price: product.price,
    confidence: matchedInputs.length >= 2 ? 'high' : matchedInputs.length === 1 ? 'medium' : 'low',
    reasons,
    matchedInputs,
    optionalUpgrade,
    warnings: warnings.length ? warnings : undefined,
    disclaimer: DISCLAIMER,
  };
}

function hasIncome(answers: QuestionnaireAnswers, keys: FeatureKey[]): boolean {
  return keys.some((key) => answers.incomeSources.includes(key));
}

function hasDeduction(answers: QuestionnaireAnswers, keys: FeatureKey[]): boolean {
  const deductions = effectiveDeductions(answers);
  return keys.some((key) => deductions.includes(key));
}

function matchedLabels(keys: FeatureKey[]): string[] {
  return keys.map((key) => FEATURE_LABELS[key]);
}

export function recommendProduct(answers: QuestionnaireAnswers): RecommendationResult {
  const warnings = detectContradictions(answers);
  const validationErrors = validateAnswers(answers);

  if (validationErrors.length > 0) {
    return {
      recommendedProductId: '',
      recommendedProductName: 'Incomplete answers',
      price: 0,
      confidence: 'low',
      reasons: validationErrors,
      matchedInputs: [],
      warnings,
      disclaimer: DISCLAIMER,
    };
  }

  if (answers.filingType === 'incorporated') {
    if (answers.companyRevenue === 'no') {
      return buildResult(
        'nil-corporate-return',
        [
          'You selected an incorporated company with no revenue.',
          'Nil Corporate Return supports nil corporate filing for no-revenue companies.',
        ],
        ['filingType:incorporated', 'companyRevenue:no'],
        warnings,
      );
    }

    return buildResult(
      'business-corporate',
      [
        'You selected an incorporated company with revenue.',
        'Business Corporate supports corporate tax return filing and business revenue.',
      ],
      ['filingType:incorporated', 'companyRevenue:yes'],
      warnings,
    );
  }

  if (answers.helpPreference === 'expert-file') {
    return buildResult(
      'expert-full-service',
      [
        'You selected that you want an expert to file for you.',
        'Expert Full Service supports document upload, expert preparation, and expert filing.',
      ],
      ['helpPreference:expert-file'],
      warnings,
    );
  }

  if (answers.helpPreference === 'expert-help') {
    return buildResult(
      'expert-assist',
      [
        'You selected expert help while filing.',
        'Expert Assist supports expert chat, video call, and review before filing.',
      ],
      ['helpPreference:expert-help'],
      warnings,
    );
  }

  const selfMatched = [
    ...(answers.filingType === 'self-employed' ? ['filingType:self-employed'] : []),
    ...SELF_EMPLOYED_TRIGGERS.filter(
      (key) =>
        answers.incomeSources.includes(key) || effectiveDeductions(answers).includes(key),
    ).map((key) => FEATURE_LABELS[key].toLowerCase()),
  ];

  if (answers.filingType === 'self-employed' || selfMatched.length > 0) {
    return buildResult(
      'self-employed',
      [
        'You selected self-employment, freelance/gig income, or business-related expenses.',
        'Self-Employed supports freelance income and business-related expenses.',
      ],
      selfMatched,
      warnings,
    );
  }

  const premierMatched = PREMIER_TRIGGERS.filter((key) => answers.incomeSources.includes(key));
  if (premierMatched.length > 0) {
    return buildResult(
      'premier',
      [
        'You selected investment, capital gains, rental, or foreign income.',
        'Premier supports these advanced personal tax situations.',
      ],
      matchedLabels(premierMatched),
      warnings,
    );
  }

  const deluxeMatched = DELUXE_TRIGGERS.filter((key) =>
    effectiveDeductions(answers).includes(key),
  );
  if (deluxeMatched.length > 0) {
    return buildResult(
      'deluxe',
      [
        'You selected common deductions or expenses.',
        'Deluxe supports medical expenses, donations, and employment expenses.',
      ],
      matchedLabels(deluxeMatched),
      warnings,
      {
        productId: 'expert-assist',
        productName: 'Expert Assist',
        reason: 'Upgrade if you want expert help while filing.',
      },
    );
  }

  const simpleIncome =
    hasIncome(answers, ['salaryIncome', 'studentIncome']) &&
    !hasIncome(answers, PREMIER_TRIGGERS) &&
    !hasIncome(answers, ['freelanceIncome', 'gigWorkIncome', 'businessRevenue']) &&
    !hasDeduction(answers, DELUXE_TRIGGERS) &&
    !hasDeduction(answers, ['homeOfficeExpenses', 'vehicleExpenses', 'businessExpenses']);

  if (simpleIncome && answers.filingType === 'personal') {
    return buildResult(
      'free',
      [
        'You selected a simple personal situation with salary or student income.',
        'Free supports basic personal returns without special deductions.',
      ],
      ['salary or student income', 'no special deductions'],
      warnings,
    );
  }

  return buildResult(
    'deluxe',
    [
      'Your answers did not match a more specific product rule.',
      'Deluxe appears suitable as a general personal tax option.',
    ],
    ['fallback recommendation'],
    [...warnings, 'This fallback recommendation has lower confidence because the answers were broad.'],
  );
}
