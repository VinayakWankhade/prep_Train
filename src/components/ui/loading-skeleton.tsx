import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  lines?: number;
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function LoadingSkeleton({
  className,
  variant = 'rectangular',
  lines = 1,
  width,
  height,
  animation = 'pulse',
  ...props
}: LoadingSkeletonProps) {
  const baseClasses = cn(
    "bg-muted rounded",
    {
      'animate-pulse': animation === 'pulse',
      'animate-wave': animation === 'wave',
    }
  );

  if (variant === 'text') {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              "h-4",
              i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
            )}
            style={{ width: typeof width === 'number' ? `${width}px` : width }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={cn(baseClasses, "rounded-full", className)}
        style={{
          width: typeof width === 'number' ? `${width}px` : width || '40px',
          height: typeof height === 'number' ? `${height}px` : height || '40px',
        }}
        {...props}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn("border border-border rounded-lg p-4 space-y-4", className)} {...props}>
        <div className="flex items-center space-x-4">
          <div className={cn(baseClasses, "w-12 h-12 rounded-full")} />
          <div className="space-y-2 flex-1">
            <div className={cn(baseClasses, "h-4 w-3/4")} />
            <div className={cn(baseClasses, "h-3 w-1/2")} />
          </div>
        </div>
        <div className="space-y-2">
          <div className={cn(baseClasses, "h-4 w-full")} />
          <div className={cn(baseClasses, "h-4 w-full")} />
          <div className={cn(baseClasses, "h-4 w-2/3")} />
        </div>
        <div className="flex space-x-2">
          <div className={cn(baseClasses, "h-8 w-20 rounded-md")} />
          <div className={cn(baseClasses, "h-8 w-20 rounded-md")} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width || '100%',
        height: typeof height === 'number' ? `${height}px` : height || '20px',
      }}
      {...props}
    />
  );
}

// Specific skeleton components for common use cases
export function CardSkeleton({ className, ...props }: { className?: string }) {
  return <LoadingSkeleton variant="card" className={className} {...props} />;
}

export function TextSkeleton({ lines = 3, className, ...props }: { lines?: number; className?: string }) {
  return <LoadingSkeleton variant="text" lines={lines} className={className} {...props} />;
}

export function AvatarSkeleton({ size = 40, className, ...props }: { size?: number; className?: string }) {
  return (
    <LoadingSkeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
}

export function ButtonSkeleton({ className, ...props }: { className?: string }) {
  return (
    <LoadingSkeleton
      variant="rectangular"
      height={40}
      width={100}
      className={cn("rounded-md", className)}
      {...props}
    />
  );
}
