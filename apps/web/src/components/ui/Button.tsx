import type { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  outline: "border-2 border-gray-300 text-gray-700 hover:border-gray-400",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
