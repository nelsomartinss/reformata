import { cn } from '@/lib/utils';

export function Panel({
  className,
  ...props
}: React.ComponentProps<'section'>) {
  return (
    <section
      className={cn(
        'rounded-md border border-border bg-card text-card-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-t-md border-b border-border bg-subtle px-4 py-2.5',
        className,
      )}
      {...props}
    />
  );
}

export function PanelTitle({
  className,
  children,
  ...props
}: React.ComponentProps<'h2'>) {
  return (
    <h2 className={cn('text-sm font-semibold', className)} {...props}>
      {children}
    </h2>
  );
}

export function PanelBody({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('p-4 sm:p-6', className)} {...props} />;
}
