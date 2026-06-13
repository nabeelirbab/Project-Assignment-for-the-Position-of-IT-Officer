import { AnimateIn } from '@/components/ui/AnimateIn';

type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <AnimateIn>
      <div>
        <h1 className="page-heading">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
    </AnimateIn>
  );
}
