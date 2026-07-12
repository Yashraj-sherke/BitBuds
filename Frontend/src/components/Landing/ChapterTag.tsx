import React from 'react';
import { cn } from '../../lib/utils';

interface ChapterTagProps {
  children: React.ReactNode;
  tone?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
  className?: string;
}

const tones: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/15 text-accent-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning',
};

export const ChapterTag: React.FC<ChapterTagProps> = ({ children, tone = 'primary', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 font-accent text-xs font-extrabold uppercase tracking-[0.14em]',
        tones[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
};
