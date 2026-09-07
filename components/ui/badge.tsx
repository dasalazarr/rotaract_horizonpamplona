import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#D42365] focus:ring-offset-2 whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-[#D42365] text-white',
        secondary: 'bg-ink/5 text-ink hover:bg-ink/10',
        outline: 'border border-line text-muted hover:text-ink',
        glass: 'liquid-glass text-ink/90',
        magentaTint: 'bg-accent-wash text-accent-deep border border-accent/30',
        muted: 'bg-paper-soft text-muted border border-line',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
