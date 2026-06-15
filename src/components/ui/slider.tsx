import * as SliderPrimitive from '@radix-ui/react-slider';
import type * as React from 'react';

import { cn } from '@utils/cn/cn';

const Slider = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>) => (
    <SliderPrimitive.Root
        className={cn(
            'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50',
            className
        )}
        {...props}
    >
        <SliderPrimitive.Track className="bg-secondary relative h-1.5 w-full grow overflow-hidden rounded-full">
            <SliderPrimitive.Range className="bg-primary absolute h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block size-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
);

export { Slider };
