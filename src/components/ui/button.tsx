import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 active:scale-95 outline-none",
  {
    variants: {
      variant: {
        // --- STYLE GỐC (Sẽ dùng khi minimal = true) ---
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-emerald-600 text-white hover:bg-emerald-700",

        // --- STYLE BIDA (Sẽ ghi đè bằng class riêng khi minimal = false) ---
        bida_default:
          "bg-gradient-to-b from-[#f2c94c] to-[#e2b02a] text-[#3d2a15] shadow-[0_4px_0_0_#9c7b1a] hover:from-[#ffd666] active:shadow-none active:translate-y-[2px]",
        bida_success:
          "bg-gradient-to-b from-[#4ade80] to-[#16a34a] text-white shadow-[0_4px_0_0_#14532d] hover:from-[#86efac] active:shadow-none active:translate-y-[2px]",
        bida_destructive:
          "bg-gradient-to-b from-[#ef4444] to-[#991b1b] text-white shadow-[0_4px_0_0_#450a0a] hover:from-[#f87171] active:shadow-none active:translate-y-[2px]",
        bida_outline:
          "bg-[#2a4d40] border-2 border-[#3d6b5b] text-[#a8c5bb] hover:bg-[#3d6b5b] hover:text-white transition-colors shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2", // Giảm chuẩn shadcn
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // Size riêng cho mode bida
        bida_default: "h-12 px-6 rounded-xl",
        bida_icon: "size-10 rounded-xl shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  // Lấy trạng thái từ Redux
  const isMinimal = useSelector((state: RootState) => state.theme.isMinimal);

  // Logic chọn variant/size dựa trên mode
  const finalVariant =
    !isMinimal &&
    ["default", "success", "destructive", "outline"].includes(variant as string)
      ? `bida_${variant}`
      : variant;

  const finalSize =
    !isMinimal && ["default", "icon"].includes(size as string)
      ? `bida_${size}`
      : size;

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({
          variant: finalVariant as any,
          size: finalSize as any,
          className,
        })
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
