'use client';

import { useEffect, useMemo, useState } from 'react';
import { recommendProduct } from '@/lib/recommendation';
import {
  DEDUCTION_OPTIONS,
  FEATURE_LABELS,
  INCOME_OPTIONS,
} from '@/lib/labels';
import {
  getResultStep,
  getWizardStepCount,
  validateWizardStep,
} from '@/lib/validation';
import { downloadRecommendation, printRecommendation } from '@/lib/export-recommendation';
import {
  clearWizardState,
  loadWizardState,
  saveWizardState,
} from '@/lib/wizard-storage';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { FeatureKey, QuestionnaireAnswers, RecommendationResult } from '@/types';

const initialAnswers: QuestionnaireAnswers = {
  filingType: '',
  incomeSources: [],
  deductions: [],
  noSpecialDeductions: false,
  helpPreference: '',
  companyRevenue: '',
};

const filingOptions = [
  { value: 'personal', label: 'Personal return' },
  { value: 'self-employed', label: 'Freelancer / self-employed' },
  { value: 'incorporated', label: 'Incorporated company' },
] as const;

const helpOptions = [
  { value: 'self', label: 'I want to file myself' },
  { value: 'expert-help', label: 'I want expert help while filing' },
  { value: 'expert-file', label: 'I want an expert to file for me' },
] as const;

function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function ResultPanel({
  result,
  onRestart,
}: {
  result: RecommendationResult;
  onRestart: () => void;
}) {
  const incomplete = !result.recommendedProductId;

  return (
    <section className="card animate-step-enter space-y-4">
      <h2 className="text-2xl font-bold text-label">
        {incomplete ? 'Complete required answers' : `Recommended product: ${result.recommendedProductName}`}
      </h2>

      {!incomplete && (
        <>
          <p className="text-3xl font-bold text-label">CAD ${result.price}</p>
          <p className="text-sm uppercase tracking-wide text-muted">
            Confidence: {result.confidence}
          </p>

          <div>
            <h3 className="font-semibold text-label">Reason</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-body">
              {result.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-label">Matched answers</h3>
            <p className="mt-2 text-body">{result.matchedInputs.join(', ')}</p>
          </div>

          {result.optionalUpgrade && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-body dark:border-teal-900 dark:bg-teal-950/40">
              <p className="font-semibold text-label">Optional upgrade</p>
              <p className="mt-1">
                {result.optionalUpgrade.productName}: {result.optionalUpgrade.reason}
              </p>
            </div>
          )}

          {result.warnings?.map((warning) => (
            <div key={warning} className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              {warning}
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-secondary" onClick={() => downloadRecommendation(result)}>
              Download result
            </button>
            <button type="button" className="btn-secondary" onClick={() => printRecommendation(result)}>
              Print / Save as PDF
            </button>
          </div>
        </>
      )}

      {incomplete && (
        <ul className="list-disc space-y-1 pl-5 text-red-600">
          {result.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}

      <p className="text-sm text-muted">{result.disclaimer}</p>
      <button type="button" className="btn-secondary" onClick={onRestart}>
        Restart
      </button>
    </section>
  );
}

export function RecommendationWizard() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);
  const [errors, setErrors] = useState<string[]>([]);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const saved = loadWizardState();
    if (saved) {
      setStep(saved.step);
      setAnswers(saved.answers);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    saveWizardState({ step, answers });
  }, [answers, restored, step]);

  const totalSteps = getWizardStepCount(answers);
  const resultStep = getResultStep(answers);
  const result = useMemo(() => recommendProduct(answers), [answers]);

  function updateIncome(key: FeatureKey) {
    setAnswers((current) => ({
      ...current,
      incomeSources: toggleValue(current.incomeSources, key),
    }));
  }

  function updateDeduction(key: FeatureKey) {
    setAnswers((current) => ({
      ...current,
      noSpecialDeductions: false,
      deductions: toggleValue(current.deductions, key),
    }));
  }

  function selectNoDeductions() {
    setAnswers((current) => ({
      ...current,
      noSpecialDeductions: true,
      deductions: [],
    }));
  }

  function goNext() {
    const stepErrors = validateWizardStep(step, answers);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors([]);
    setStep((current) => Math.min(current + 1, resultStep));
  }

  function goBack() {
    setErrors([]);
    setStep((current) => Math.max(current - 1, 1));
  }

  function restart() {
    setAnswers(initialAnswers);
    setStep(1);
    setErrors([]);
    clearWizardState();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AnimateIn>
        <div>
          <h1 className="page-heading">Recommendation Wizard</h1>
          <p className="page-description">
            Answer a few questions to get a product recommendation based on structured rules.
          </p>
          {restored && step > 1 && (
            <p className="mt-2 text-sm text-muted">Your progress is saved automatically in this browser.</p>
          )}
        </div>
      </AnimateIn>

      <AnimateIn delay={80}>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-muted">
            <span>
              Step {Math.min(step, totalSteps - 1)} of {totalSteps - 1}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% complete</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-emerald-100 dark:bg-slate-700">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </AnimateIn>

      {errors.length > 0 && (
        <div className="animate-step-enter rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <ul className="list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {step === 1 && (
        <section key="step-1" className="card animate-step-enter space-y-3">
          <h2 className="text-xl font-bold">What are you filing for?</h2>
          {filingOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-3">
              <input
                type="radio"
                name="filingType"
                checked={answers.filingType === option.value}
                onChange={() =>
                  setAnswers((current) => ({
                    ...current,
                    filingType: option.value,
                    companyRevenue: option.value === 'incorporated' ? current.companyRevenue : '',
                  }))
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </section>
      )}

      {step === 2 && (
        <section key="step-2" className="card animate-step-enter space-y-3">
          <h2 className="text-xl font-bold">Which income sources apply to you?</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {INCOME_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={answers.incomeSources.includes(option)}
                  onChange={() => updateIncome(option)}
                />
                <span>{FEATURE_LABELS[option]}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section key="step-3" className="card animate-step-enter space-y-3">
          <h2 className="text-xl font-bold">Which deductions or expenses apply to you?</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {DEDUCTION_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={answers.deductions.includes(option)}
                  onChange={() => updateDeduction(option)}
                />
                <span>{FEATURE_LABELS[option]}</span>
              </label>
            ))}
            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={answers.noSpecialDeductions && answers.deductions.length === 0}
                onChange={selectNoDeductions}
              />
              <span>No special deductions</span>
            </label>
          </div>
        </section>
      )}

      {step === 4 && (
        <section key="step-4" className="card animate-step-enter space-y-3">
          <h2 className="text-xl font-bold">How much help do you want?</h2>
          {helpOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-3">
              <input
                type="radio"
                name="helpPreference"
                checked={answers.helpPreference === option.value}
                onChange={() =>
                  setAnswers((current) => ({ ...current, helpPreference: option.value }))
                }
              />
              <span>{option.label}</span>
            </label>
          ))}
        </section>
      )}

      {step === 5 && answers.filingType === 'incorporated' && (
        <section key="step-5" className="card animate-step-enter space-y-3">
          <h2 className="text-xl font-bold">Did the company have revenue?</h2>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="companyRevenue"
              checked={answers.companyRevenue === 'yes'}
              onChange={() => setAnswers((current) => ({ ...current, companyRevenue: 'yes' }))}
            />
            <span>Yes, company had revenue</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="companyRevenue"
              checked={answers.companyRevenue === 'no'}
              onChange={() => setAnswers((current) => ({ ...current, companyRevenue: 'no' }))}
            />
            <span>No, company had no revenue</span>
          </label>
        </section>
      )}

      {step === resultStep && (
        <div key="result" className="animate-step-enter">
          <ResultPanel result={result} onRestart={restart} />
        </div>
      )}

      {step < resultStep && (
        <div className="animate-fade-in-up flex justify-between">
          <button type="button" className="btn-secondary" disabled={step === 1} onClick={goBack}>
            Back
          </button>
          <button type="button" className="btn-primary" onClick={goNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
