import { products } from '@/data/products';
import { COMPARISON_FEATURES, formatFeature } from '@/lib/labels';

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-emerald-100 bg-white/90 shadow-sm shadow-emerald-900/5 transition-shadow duration-300 hover:shadow-md hover:shadow-emerald-900/10 dark:border-slate-700 dark:bg-slate-900/90 dark:hover:shadow-black/20">
      <table className="min-w-[960px] w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-50 to-sky-50 text-left dark:from-slate-800 dark:to-slate-900">
            <th className="sticky left-0 z-10 bg-emerald-50 p-4 font-semibold dark:bg-slate-800">Feature</th>
            {products.map((product) => (
              <th key={product.id} className="p-4 font-semibold transition-colors hover:bg-emerald-100/60 dark:hover:bg-slate-700/60">
                <div>{product.name}</div>
                <div className="mt-1 font-normal text-muted">CAD ${product.price}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-200 transition-colors hover:bg-emerald-50/60 dark:border-slate-700 dark:hover:bg-slate-800/60">
            <td className="sticky left-0 bg-white p-4 font-medium dark:bg-slate-900">Price</td>
            {products.map((product) => (
              <td key={product.id} className="p-4">
                CAD ${product.price}
              </td>
            ))}
          </tr>
          {COMPARISON_FEATURES.map((feature) => (
            <tr
              key={feature}
              className="border-t border-slate-200 transition-colors hover:bg-emerald-50/60 dark:border-slate-700 dark:hover:bg-slate-800/60"
            >
              <td className="sticky left-0 bg-white p-4 font-medium dark:bg-slate-900">
                {formatFeature(feature)}
              </td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  {product.supports[feature] ? (
                    <span className="inline-block font-semibold text-emerald-700 transition-transform duration-200 hover:scale-110 dark:text-emerald-400">
                      Yes
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
