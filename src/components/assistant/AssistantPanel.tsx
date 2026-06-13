'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { AssistantResponse } from '@/types';

const exampleQuestions = [
  'I have salary income and donations. Which product should I use?',
  'I am a freelancer with home-office expenses. Can I use Free?',
  'I own an incorporated company with no revenue. What should I choose?',
  'I have investment income and rental income. Which product fits me?',
  'What is the difference between Premier and Self-Employed?',
  'I want someone else to file for me. What should I select?',
  'Can you guarantee I will get a refund?',
];

export function AssistantPanel() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAssistant = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!result.ok) {
        throw new Error('Assistant request failed.');
      }

      setResponse((await result.json()) as AssistantResponse);
    } catch {
      setError('Unable to reach the assistant API. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [question]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && question.trim()) {
        void askAssistant();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [askAssistant, question]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AnimateIn>
        <div>
          <h1 className="page-heading">AI Product Assistant</h1>
          <p className="page-description">
            Ask product-selection questions. The assistant uses product data and recommendation rules,
            includes safety disclaimers, and avoids tax or legal advice.
          </p>
        </div>
      </AnimateIn>

      <AnimateIn delay={100}>
        <section className="card space-y-4">
          <label htmlFor="assistant-question" className="sr-only">
            Ask a product-selection question
          </label>
          <textarea
            id="assistant-question"
            className="input min-h-32"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a product-selection question..."
            aria-describedby="assistant-help"
          />
          <p id="assistant-help" className="text-xs text-muted">
            Tip: press Ctrl+Enter to submit.
          </p>
          <button type="button" className="btn-primary" disabled={loading || !question.trim()} onClick={askAssistant}>
            {loading ? 'Thinking...' : 'Ask assistant'}
          </button>

          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((example) => (
              <button
                key={example}
                type="button"
                className="btn-secondary text-xs transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setQuestion(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </section>
      </AnimateIn>

      {error && (
        <div className="animate-step-enter rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {response && (
        <AnimateIn>
          <section className="card space-y-4" aria-live="polite">
            <h2 className="text-xl font-bold text-label">Answer</h2>
            <p className="text-body">{response.answer}</p>

            {response.recommendedProduct && (
              <p>
                <span className="font-semibold text-label">Recommended product:</span>{' '}
                {response.recommendedProduct}
              </p>
            )}

            <p>
              <span className="font-semibold text-label">Confidence:</span> {response.confidence}
            </p>

            <ul className="list-disc space-y-1 pl-5 text-body">
              {response.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>

            <p className="text-sm text-muted">{response.disclaimer}</p>
          </section>
        </AnimateIn>
      )}
    </div>
  );
}
