'use client';

import { useEffect, useMemo, useState } from 'react';
import { products as defaultProducts, getSupportedFeatures, getUnsupportedFeatures } from '@/data/products';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { formatFeature } from '@/lib/labels';
import { FeatureKey, Product } from '@/types';

const ADMIN_STORAGE_KEY = 'taxwise-admin-overrides';

function loadOverrides(): Record<string, Partial<Product>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Partial<Product>>) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, Partial<Product>>) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(overrides));
}

function validateProduct(product: Product): string[] {
  const issues: string[] = [];
  if (!product.id.trim()) issues.push('Missing product ID');
  if (!product.name.trim()) issues.push('Missing product name');
  if (product.price < 0) issues.push('Price cannot be negative');
  if (!product.description.trim()) issues.push('Missing description');
  if (product.bestFor.length === 0) issues.push('Missing best-for items');
  return issues;
}

export function AdminProductConfig() {
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, Partial<Product>>>({});

  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  const displayProducts = useMemo(
    () =>
      defaultProducts.map((product) => ({
        ...product,
        ...overrides[product.id],
      })),
    [overrides],
  );

  function exportJson() {
    const blob = new Blob([JSON.stringify(displayProducts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'products-config.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    setOverrides((current) => {
      const next = { ...current, [id]: { ...current[id], ...patch } };
      saveOverrides(next);
      return next;
    });
  }

  function resetOverrides() {
    setOverrides({});
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }

  return (
    <div className="space-y-6">
      <AnimateIn>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="page-heading">Admin / Product Config</h1>
            <p className="page-description">
              Configuration view for structured product data. Local edits are saved in this browser only.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => setEditMode((value) => !value)}>
              {editMode ? 'View mode' : 'Edit locally'}
            </button>
            <button type="button" className="btn-secondary" onClick={exportJson}>
              Export JSON
            </button>
            {Object.keys(overrides).length > 0 && (
              <button type="button" className="btn-secondary" onClick={resetOverrides}>
                Reset edits
              </button>
            )}
          </div>
        </div>
      </AnimateIn>

      <div className="space-y-4">
        {displayProducts.map((product, index) => {
          const supported = getSupportedFeatures(product).map((key) =>
            formatFeature(key as FeatureKey),
          );
          const unsupported = getUnsupportedFeatures(product).map((key) =>
            formatFeature(key as FeatureKey),
          );
          const issues = validateProduct(product);

          return (
            <AnimateIn key={product.id} delay={100 + index * 70}>
              <section className="card space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">{product.id}</p>
                    {editMode ? (
                      <input
                        className="input mt-2 text-xl font-bold"
                        value={product.name}
                        onChange={(event) => updateProduct(product.id, { name: event.target.value })}
                      />
                    ) : (
                      <h2 className="text-2xl font-bold text-label">{product.name}</h2>
                    )}
                  </div>
                  {editMode ? (
                    <input
                      className="input w-32 text-lg font-bold"
                      type="number"
                      min={0}
                      value={product.price}
                      onChange={(event) =>
                        updateProduct(product.id, { price: Number(event.target.value) })
                      }
                    />
                  ) : (
                    <p className="text-lg font-bold text-label">CAD ${product.price}</p>
                  )}
                </div>

                {editMode ? (
                  <textarea
                    className="input min-h-24"
                    value={product.description}
                    onChange={(event) => updateProduct(product.id, { description: event.target.value })}
                  />
                ) : (
                  <p className="text-body">{product.description}</p>
                )}

                {issues.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                    <p className="font-semibold">Validation issues</p>
                    <ul className="mt-1 list-disc pl-5">
                      {issues.map((issue) => (
                        <li key={issue}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h3 className="font-semibold text-label">Best for</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body">
                      {product.bestFor.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-label">Supported features</h3>
                    <p className="mt-2 text-sm text-body">{supported.join(', ') || 'None'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-label">Unsupported features</h3>
                    <p className="mt-2 text-sm text-body">{unsupported.join(', ') || 'None'}</p>
                  </div>
                </div>
              </section>
            </AnimateIn>
          );
        })}
      </div>
    </div>
  );
}
