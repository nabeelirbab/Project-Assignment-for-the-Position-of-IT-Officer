import { ComparisonTable } from '@/components/compare/ComparisonTable';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { PageHeader } from '@/components/ui/PageHeader';

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Comparison"
        description="Compare products by price and supported features. Scroll horizontally on mobile for the full table."
      />
      <AnimateIn delay={100}>
        <ComparisonTable />
      </AnimateIn>
    </div>
  );
}
