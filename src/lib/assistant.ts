import { products } from '@/data/products';
import { recommendProduct } from '@/lib/recommendation';
import { DISCLAIMER } from '@/lib/validation';
import { AssistantResponse, FeatureKey, QuestionnaireAnswers } from '@/types';

const UNSAFE_PATTERNS =
  /guarantee|refund|qualify|accepted|legal advice|professional tax advice|must use|definitely qualify|tax authority/i;

const COMPARISON_PATTERNS = /difference between|compare|vs\.?|versus/i;

function safeResponse(message: string): AssistantResponse {
  return {
    answer: message,
    recommendedProduct: null,
    confidence: 'high',
    reasons: ['Unsafe or unsupported tax-outcome request detected.'],
    disclaimer: DISCLAIMER,
  };
}

function structuredResponse(
  answer: string,
  recommendedProduct: string | null,
  confidence: AssistantResponse['confidence'],
  reasons: string[],
): AssistantResponse {
  return {
    answer,
    recommendedProduct,
    confidence,
    reasons,
    disclaimer: DISCLAIMER,
  };
}

function parseQuestion(question: string): QuestionnaireAnswers {
  const q = question.toLowerCase();
  const answers: QuestionnaireAnswers = {
    filingType: 'personal',
    incomeSources: [],
    deductions: [],
    noSpecialDeductions: false,
    helpPreference: 'self',
    companyRevenue: '',
  };

  if (/incorporated|corporate company|own a company|company with no revenue|nil return/.test(q)) {
    answers.filingType = 'incorporated';
  } else if (/freelancer|self-employed|contractor|gig worker|sole proprietor/.test(q)) {
    answers.filingType = 'self-employed';
  }

  if (/no revenue|nil return|no-revenue/.test(q)) {
    answers.companyRevenue = 'no';
  } else if (answers.filingType === 'incorporated') {
    answers.companyRevenue = 'yes';
  }

  const incomeMap: Array<[RegExp, FeatureKey]> = [
    [/salary/, 'salaryIncome'],
    [/student/, 'studentIncome'],
    [/investment/, 'investmentIncome'],
    [/capital gain/, 'capitalGains'],
    [/rental/, 'rentalIncome'],
    [/foreign/, 'foreignIncome'],
    [/freelance/, 'freelanceIncome'],
    [/gig[- ]work|gig work/, 'gigWorkIncome'],
    [/business revenue|company revenue|revenue/, 'businessRevenue'],
  ];

  for (const [pattern, key] of incomeMap) {
    if (pattern.test(q)) {
      answers.incomeSources.push(key);
    }
  }

  const deductionMap: Array<[RegExp, FeatureKey]> = [
    [/medical/, 'medicalExpenses'],
    [/donation/, 'donations'],
    [/employment expense/, 'employmentExpenses'],
    [/home[- ]office|home office/, 'homeOfficeExpenses'],
    [/vehicle/, 'vehicleExpenses'],
    [/business expense/, 'businessExpenses'],
  ];

  for (const [pattern, key] of deductionMap) {
    if (pattern.test(q)) {
      answers.deductions.push(key);
    }
  }

  if (/someone else|expert to file|file for me|full service/.test(q)) {
    answers.helpPreference = 'expert-file';
  } else if (/expert help|expert assist|video call|expert chat|review before filing/.test(q)) {
    answers.helpPreference = 'expert-help';
  }

  if (answers.incomeSources.length === 0 && answers.filingType !== 'incorporated') {
    answers.incomeSources.push('salaryIncome');
  }

  return answers;
}

function answerComparison(question: string): AssistantResponse | null {
  if (!COMPARISON_PATTERNS.test(question)) {
    return null;
  }

  const q = question.toLowerCase();
  if (/premier/.test(q) && /self-employed|self employed/.test(q)) {
    return structuredResponse(
      'Based on the provided product rules, Premier is designed for investment income, capital gains, rental income, and foreign income. Self-Employed is designed for freelance income, gig-work income, and business-related expenses such as home-office and vehicle expenses. Premier does not support self-employment income, while Self-Employed does not support incorporated business filing.',
      null,
      'high',
      [
        'Premier supports investment, rental, capital gains, and foreign income.',
        'Self-Employed supports freelance, gig-work, and business expenses.',
      ],
    );
  }

  return structuredResponse(
    'Based on the provided product rules, compare products using the comparison page or ask about two specific product names such as Premier and Self-Employed.',
    null,
    'medium',
    ['Comparison question detected.'],
  );
}

function answerFreeEligibility(question: string): AssistantResponse | null {
  if (!/can i use free|use free|free product/.test(question.toLowerCase())) {
    return null;
  }

  const answers = parseQuestion(question);
  const freeProduct = products.find((product) => product.id === 'free')!;

  const unsupportedNeeds = [
    ...answers.incomeSources.filter((source) => !freeProduct.supports[source]),
    ...answers.deductions.filter((deduction) => !freeProduct.supports[deduction]),
  ];

  if (
    answers.filingType !== 'personal' ||
    answers.helpPreference !== 'self' ||
    unsupportedNeeds.length > 0
  ) {
    const recommendation = recommendProduct(answers);
    return structuredResponse(
      `Based on the provided product rules, Free does not appear suitable for this situation because it only supports salary income, student income, and basic personal returns. ${recommendation.recommendedProductName} appears more suitable instead.`,
      recommendation.recommendedProductName,
      'high',
      [
        'Free does not support special deductions, investments, rental income, freelance income, or expert help.',
        ...recommendation.reasons,
      ],
    );
  }

  return structuredResponse(
    'Based on the provided product rules, Free appears suitable because your situation matches salary or student income with no special deductions.',
    'Free',
    'high',
    ['Free supports salary income and student income for simple personal returns.'],
  );
}

export function simulatedAssistant(question: string): AssistantResponse {
  const trimmed = question.trim();
  if (!trimmed) {
    return structuredResponse(
      'Please ask a product-selection question based on your filing type, income sources, deductions, or help preference.',
      null,
      'low',
      ['Empty question received.'],
    );
  }

  if (UNSAFE_PATTERNS.test(trimmed)) {
    return safeResponse(
      'I cannot guarantee refunds, deductions, acceptance, or tax outcomes. I can only provide general product guidance based on the provided product rules.',
    );
  }

  if (/invent|add a feature|unsupported feature|new product/.test(trimmed.toLowerCase())) {
    return safeResponse(
      'I can only answer using the provided product data and rules. I cannot invent unsupported features or products.',
    );
  }

  const comparison = answerComparison(trimmed);
  if (comparison) {
    return comparison;
  }

  const freeAnswer = answerFreeEligibility(trimmed);
  if (freeAnswer) {
    return freeAnswer;
  }

  const answers = parseQuestion(trimmed);
  const recommendation = recommendProduct(answers);

  return structuredResponse(
    `Based on the provided product rules, ${recommendation.recommendedProductName} appears suitable. ${recommendation.reasons.join(' ')}`,
    recommendation.recommendedProductName,
    recommendation.confidence,
    recommendation.reasons,
  );
}
