'use client';

import { useMemo, useState } from 'react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { formatFeature } from '@/lib/labels';
import { FeatureKey } from '@/types';

type SortOption = 'price-asc' | 'price-desc' | 'name';
type CategoryFilter = 'all' | 'personal' | 'expert' | 'corporate';

export function ProductCatalog() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('price-asc');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => category === 'all' || product.category === category)
      .filter((product) => {
        if (!query) return true;

        const haystack = [
          product.name,
          product.description,
          ...product.bestFor,
          ...Object.entries(product.supports)
            .filter(([, supported]) => supported)
            .map(([key]) => formatFeature(key as FeatureKey)),
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      })
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'price-desc') return b.price - a.price;
        return a.price - b.price;
      });
  }, [category, search, sort]);

  return (
    <div className="space-y-6">
      <AnimateIn delay={80}>
        <div className="card grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm">
            <span className="font-medium">Search by feature or product</span>
            <input
              className="input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search donations, rental, expert..."
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Filter by product type</span>
            <select
              className="input"
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryFilter)}
            >
              <option value="all">All products</option>
              <option value="personal">Personal</option>
              <option value="expert">Expert</option>
              <option value="corporate">Corporate</option>
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium">Sort by price</span>
            <select
              className="input"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
            >
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </AnimateIn>

      <AnimateIn delay={120}>
        <p className="text-sm text-muted">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </AnimateIn>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product, index) => (
          <AnimateIn key={product.id} delay={160 + index * 60}>
            <ProductCard product={product} />
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
