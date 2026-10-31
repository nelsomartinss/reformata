import { cn } from '@/lib/utils';

type NoticeProps = React.ComponentProps<'div'> & {
  tone?: 'neutral' | 'warning' | 'danger';
};

const tones = {
  neutral: 'border-border bg-subtle text-muted-foreground',
  warning: 'border-warning-border bg-warning text-warning-foreground',
  danger: 'border-danger-border bg-danger text-danger-foreground',
} as const;

export default function Notice({
  tone = 'neutral',
  className,
  ...props
}: NoticeProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border px-4 py-3 text-sm leading-6',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
