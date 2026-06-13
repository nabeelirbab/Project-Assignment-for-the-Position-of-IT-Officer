import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { products } from '@/data/products';

const faqs = [
  {
    question: 'Is this tax advice?',
    answer:
      'No. This app provides general product guidance only and is not tax, legal, or financial advice.',
  },
  {
    question: 'How does the recommendation work?',
    answer:
      'The wizard collects your filing type, income sources, deductions, and help preference, then applies priority-based product rules.',
  },
  {
    question: 'Do I need a real AI API key?',
    answer:
      'No. The assistant is simulated and grounded in the same product data and recommendation rules used by the wizard.',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="tax-grid animate-scale-in relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-800 to-sky-900 px-8 py-12 text-white shadow-2xl shadow-emerald-950/20 md:px-12 md:py-16">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative">
          <p className="animate-fade-in-up text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            AI-assisted tax product guidance
          </p>
          <h1 className="animate-fade-in-up animate-delay-100 mt-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Find the right tax software product for your return.
          </h1>
          <p className="animate-fade-in-up animate-delay-200 mt-4 max-w-2xl text-lg text-emerald-50/90">
            Compare plans, answer a guided questionnaire, or ask the assistant. Every result is backed by product rules, pricing, and safe tax-guidance disclaimers.
          </p>
          <div className="animate-fade-in-up animate-delay-300 mt-6 flex flex-wrap gap-2">
            <span className="tax-chip border-white/30 bg-white/15 text-white">CAD pricing</span>
            <span className="tax-chip border-white/30 bg-white/15 text-white">Rule-based recommendations</span>
            <span className="tax-chip border-white/30 bg-white/15 text-white">Safe AI assistant</span>
          </div>
          <div className="animate-fade-in-up animate-delay-400 mt-8 flex flex-wrap gap-3">
            <Link href="/recommend" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-emerald-950 shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-50">
              Find my product
            </Link>
            <Link href="/compare" className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">
              Compare products
            </Link>
          </div>
        </div>
      </section>

      <AnimateIn>
        <section className="space-y-6">
          <div>
            <h2 className="section-title">Popular products</h2>
            <p className="mt-2 text-muted">Preview a few products before starting the wizard.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {products.slice(0, 3).map((product, index) => (
              <AnimateIn key={product.id} delay={index * 80}>
                <ProductCard product={product} />
              </AnimateIn>
            ))}
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={60}>
        <section className="space-y-6">
          <h2 className="section-title">How it works</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="card">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Step 1</p>
              <h3 className="mt-2 text-lg font-bold text-label">Answer</h3>
              <p className="mt-2 text-muted">
                Share your filing type, income sources, deductions, and help preference.
              </p>
            </article>
            <article className="card">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Step 2</p>
              <h3 className="mt-2 text-lg font-bold text-label">Match</h3>
              <p className="mt-2 text-muted">
                The recommendation engine applies priority rules and returns reasons.
              </p>
            </article>
            <article className="card">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Step 3</p>
              <h3 className="mt-2 text-lg font-bold text-label">Decide</h3>
              <p className="mt-2 text-muted">
                Review the recommended product, optional upgrade, warnings, and disclaimer.
              </p>
            </article>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={80}>
        <section className="space-y-6">
          <h2 className="section-title">FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {faqs.map((faq, index) => (
              <AnimateIn key={faq.question} delay={index * 70}>
                <article className="card h-full">
                  <h3 className="font-semibold text-label">{faq.question}</h3>
                  <p className="mt-2 text-sm text-muted">{faq.answer}</p>
                </article>
              </AnimateIn>
            ))}
          </div>
        </section>
      </AnimateIn>
    </div>
  );
}
