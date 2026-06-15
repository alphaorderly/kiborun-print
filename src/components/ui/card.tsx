import type * as React from 'react';

import { cn } from '@utils/cn/cn';

const Card = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'bg-card text-card-foreground rounded-lg border shadow-sm',
            className
        )}
        {...props}
    />
);

const CardHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
    />
);

const CardTitle = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
        className={cn(
            'text-2xl leading-none font-semibold tracking-tight',
            className
        )}
        {...props}
    />
);

const CardContent = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('p-6 pt-0', className)} {...props} />
);

const CardFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);

export { Card, CardContent, CardFooter, CardHeader, CardTitle };
