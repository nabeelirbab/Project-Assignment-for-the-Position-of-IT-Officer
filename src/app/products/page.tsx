import { ProductCatalog } from '@/components/products/ProductCatalog';
import { PageHeader } from '@/components/ui/PageHeader';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="All product information is loaded from structured data in src/data/products.ts."
      />
      <ProductCatalog />
    </div>
  );
}
