import { Input } from "@/components/ui/input";
import { useCallback, forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  containerClassName?: string;
  labelClassName?: string;
  label?: string;
  required?: boolean;
  maxMenuHeight?: number;
  errorMessage?: string;
}

export const InputField = forwardRef<HTMLInputElement, Props>(({
  value,
  onChange,
  containerClassName,
  labelClassName,
  label,
  required,
  maxMenuHeight = 37,
  errorMessage,
  ...rest
}, ref) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.currentTarget.value);
  }, [onChange]);

  const inputClassName = cn(
    "bg-[#fff] rounded-md ring-0 shadow-2xs active:border-2 outline-none focus:border-2 focus:outline-none focus:border-primary focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none border-[#ccc] hover:border-[#999999]",
    errorMessage && "border-red-500"
  );

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      {label && (
        <label className={cn("text-sm font-medium text-gray-700", labelClassName)}>
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <Input
        ref={ref}
        id={rest.id || rest.name}
        value={value || ""}
        onChange={handleChange}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        style={{ height: `${maxMenuHeight}px` }}
        className={inputClassName}
        {...rest}
      />
      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
});

InputField.displayName = "InputField";
