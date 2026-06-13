import { QuestionnaireAnswers } from '@/types';

const STORAGE_KEY = 'taxwise-wizard-state';

export type WizardStorageState = {
  step: number;
  answers: QuestionnaireAnswers;
};

export function loadWizardState(): WizardStorageState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WizardStorageState;
  } catch {
    return null;
  }
}

export function saveWizardState(state: WizardStorageState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearWizardState() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
