'use client';

import { cn } from '@/lib/utils';
import React from 'react';

function Skeleton({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-500', className)}
      {...props}
    />
  );
}

export { Skeleton };
