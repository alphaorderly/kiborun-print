import * as LabelPrimitive from '@radix-ui/react-label';
import type * as React from 'react';

import { cn } from '@utils/cn/cn';

const Label = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) => (
    <LabelPrimitive.Root
        className={cn(
            'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            className
        )}
        {...props}
    />
);

export { Label };
