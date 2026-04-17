import { cn } from "@/lib/utils";

interface CardWrapperProps {
  title: string;
  children: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  className?: string;
}

export function CardWrapper({
  title,
  children,
  headerClassName,
  contentClassName,
  className,
}: CardWrapperProps) {
  return (
    <div className={cn("bg-white rounded-lg border overflow-hidden", className)}>
      <div className={cn("px-4 py-3 border-b border-gray-200 bg-slate-100", headerClassName)}>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className={cn("p-4", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
