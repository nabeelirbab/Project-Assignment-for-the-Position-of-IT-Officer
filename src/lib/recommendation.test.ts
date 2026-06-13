import { describe, expect, it } from 'vitest';
import { recommendProduct } from '@/lib/recommendation';
import { simulatedAssistant } from '@/lib/assistant';
import { QuestionnaireAnswers } from '@/types';

function answers(partial: Partial<QuestionnaireAnswers>): QuestionnaireAnswers {
  return {
    filingType: '',
    incomeSources: [],
    deductions: [],
    noSpecialDeductions: false,
    helpPreference: '',
    companyRevenue: '',
    ...partial,
  };
}

describe('recommendProduct', () => {
  it('recommends Free for salary-only personal return', () => {
    const result = recommendProduct(
      answers({
        filingType: 'personal',
        incomeSources: ['salaryIncome'],
        noSpecialDeductions: true,
        helpPreference: 'self',
      }),
    );

    expect(result.recommendedProductId).toBe('free');
  });

  it('recommends Deluxe for salary and donations', () => {
    const result = recommendProduct(
      answers({
        filingType: 'personal',
        incomeSources: ['salaryIncome'],
        deductions: ['donations'],
        helpPreference: 'self',
      }),
    );

    expect(result.recommendedProductId).toBe('deluxe');
  });

  it('recommends Premier for investment income', () => {
    const result = recommendProduct(
      answers({
        filingType: 'personal',
        incomeSources: ['salaryIncome', 'investmentIncome'],
        helpPreference: 'self',
      }),
    );

    expect(result.recommendedProductId).toBe('premier');
  });

  it('recommends Self-Employed for freelance income', () => {
    const result = recommendProduct(
      answers({
        filingType: 'self-employed',
        incomeSources: ['freelanceIncome'],
        helpPreference: 'self',
      }),
    );

    expect(result.recommendedProductId).toBe('self-employed');
  });

  it('recommends Expert Assist when expert help is requested', () => {
    const result = recommendProduct(
      answers({
        filingType: 'personal',
        incomeSources: ['salaryIncome'],
        helpPreference: 'expert-help',
      }),
    );

    expect(result.recommendedProductId).toBe('expert-assist');
  });

  it('recommends Expert Full Service when expert filing is requested', () => {
    const result = recommendProduct(
      answers({
        filingType: 'personal',
        incomeSources: ['salaryIncome'],
        helpPreference: 'expert-file',
      }),
    );

    expect(result.recommendedProductId).toBe('expert-full-service');
  });

  it('recommends Business Corporate for incorporated company with revenue', () => {
    const result = recommendProduct(
      answers({
        filingType: 'incorporated',
        incomeSources: ['businessRevenue'],
        helpPreference: 'self',
        companyRevenue: 'yes',
      }),
    );

    expect(result.recommendedProductId).toBe('business-corporate');
  });

  it('recommends Nil Corporate Return for incorporated company with no revenue', () => {
    const result = recommendProduct(
      answers({
        filingType: 'incorporated',
        incomeSources: ['businessRevenue'],
        helpPreference: 'self',
        companyRevenue: 'no',
      }),
    );

    expect(result.recommendedProductId).toBe('nil-corporate-return');
  });

  it('recommends Premier for rental income', () => {
    const result = recommendProduct(
      answers({
        filingType: 'personal',
        incomeSources: ['rentalIncome'],
        helpPreference: 'self',
      }),
    );

    expect(result.recommendedProductId).toBe('premier');
  });

  it('recommends Self-Employed for home-office expenses', () => {
    const result = recommendProduct(
      answers({
        filingType: 'personal',
        incomeSources: ['salaryIncome'],
        deductions: ['homeOfficeExpenses'],
        helpPreference: 'self',
      }),
    );

    expect(result.recommendedProductId).toBe('self-employed');
  });

  it('keeps corporate priority above expert help', () => {
    const result = recommendProduct(
      answers({
        filingType: 'incorporated',
        incomeSources: ['businessRevenue'],
        helpPreference: 'expert-help',
        companyRevenue: 'yes',
      }),
    );

    expect(result.recommendedProductId).toBe('business-corporate');
  });

  it('returns a warning for no special deductions with a deduction selected', () => {
    const result = recommendProduct(
      answers({
        filingType: 'personal',
        incomeSources: ['salaryIncome'],
        deductions: ['medicalExpenses'],
        noSpecialDeductions: true,
        helpPreference: 'self',
      }),
    );

    expect(result.warnings?.join(' ').toLowerCase()).toContain('no special deductions');
  });
});

describe('simulatedAssistant safety', () => {
  it('refuses refund guarantees', () => {
    const response = simulatedAssistant('Can you guarantee I will get a refund?');

    expect(response.answer.toLowerCase()).toContain('cannot guarantee');
    expect(response.disclaimer.length).toBeGreaterThan(0);
  });
});
