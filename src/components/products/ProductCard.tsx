import Link from 'next/link';
import { Product } from '@/types';
import { formatFeature } from '@/lib/labels';
import { FeatureKey } from '@/types';

function topFeatures(product: Product): FeatureKey[] {
  return Object.entries(product.supports)
    .filter(([, supported]) => supported)
    .slice(0, 4)
    .map(([key]) => key as FeatureKey);
}

export function ProductCard({ product }: { product: Product }) {
  const features = topFeatures(product);

  return (
    <article className="card relative flex h-full flex-col gap-4 overflow-hidden transition-transform duration-300">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-emerald-100 to-amber-100 opacity-70 dark:from-teal-900/50 dark:to-amber-900/30" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="tax-chip inline-block capitalize">{product.category}</p>
          <h3 className="text-xl font-bold text-label">{product.name}</h3>
        </div>
        <p className="rounded-2xl bg-emerald-50 px-3 py-2 text-lg font-extrabold text-emerald-800 ring-1 ring-emerald-100 dark:bg-teal-950/60 dark:text-teal-200 dark:ring-teal-900">
          {product.currency} ${product.price}
        </p>
      </div>

      <p className="text-sm text-muted">{product.description}</p>

      <div>
        <p className="text-sm font-semibold text-label">Best for</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body">
          {product.bestFor.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <span key={feature} className="badge">
            {formatFeature(feature)}
          </span>
        ))}
      </div>

      <Link href="/recommend" className="btn-secondary mt-auto w-full text-center">
        Find if this fits me
      </Link>
    </article>
  );
}
