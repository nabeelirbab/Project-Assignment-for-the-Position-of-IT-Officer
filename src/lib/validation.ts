import { QuestionnaireAnswers } from '@/types';
import { DEDUCTION_OPTIONS } from '@/lib/labels';

export const DISCLAIMER =
  'This recommendation provides general product guidance only and is not tax, legal, or financial advice. Please consult a qualified tax professional for tax advice.';

export function getWizardStepCount(answers: QuestionnaireAnswers): number {
  return answers.filingType === 'incorporated' ? 6 : 5;
}

export function getResultStep(answers: QuestionnaireAnswers): number {
  return getWizardStepCount(answers);
}

export function validateAnswers(answers: QuestionnaireAnswers): string[] {
  const errors: string[] = [];

  if (!answers.filingType) {
    errors.push('Filing type is required.');
  }

  if (answers.incomeSources.length === 0) {
    errors.push('At least one income source is required.');
  }

  if (!answers.helpPreference) {
    errors.push('Help preference is required.');
  }

  if (answers.filingType === 'incorporated' && !answers.companyRevenue) {
    errors.push('Company revenue answer is required for incorporated companies.');
  }

  return errors;
}

export function validateWizardStep(step: number, answers: QuestionnaireAnswers): string[] {
  switch (step) {
    case 1:
      return answers.filingType ? [] : ['Please select a filing type.'];
    case 2:
      return answers.incomeSources.length > 0 ? [] : ['Select at least one income source.'];
    case 3:
      return [];
    case 4:
      return answers.helpPreference ? [] : ['Please select a help preference.'];
    case 5:
      if (answers.filingType === 'incorporated') {
        return answers.companyRevenue ? [] : ['Please answer whether the company had revenue.'];
      }
      return validateAnswers(answers);
    case 6:
      return validateAnswers(answers);
    default:
      return [];
  }
}

export function detectContradictions(answers: QuestionnaireAnswers): string[] {
  const warnings: string[] = [];

  if (answers.noSpecialDeductions && answers.deductions.length > 0) {
    warnings.push(
      'You selected "No special deductions" together with specific deductions. The recommendation uses the selected deductions.',
    );
  }

  if (answers.filingType === 'incorporated') {
    const personalOnlyIncome = answers.incomeSources.filter(
      (source) => source !== 'businessRevenue',
    );
    if (personalOnlyIncome.length > 0) {
      warnings.push(
        'Incorporated company filing overrides personal tax products even if personal income sources were selected.',
      );
    }
  }

  if (
    answers.filingType === 'personal' &&
    (answers.incomeSources.includes('freelanceIncome') ||
      answers.incomeSources.includes('gigWorkIncome'))
  ) {
    warnings.push(
      'Freelance or gig-work income usually fits the Self-Employed product better than a basic personal return.',
    );
  }

  return warnings;
}

export function effectiveDeductions(answers: QuestionnaireAnswers) {
  if (answers.noSpecialDeductions && answers.deductions.length === 0) {
    return [];
  }

  return answers.deductions.filter((deduction) => DEDUCTION_OPTIONS.includes(deduction));
}
