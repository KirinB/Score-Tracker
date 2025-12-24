import * as React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  const { isMinimal } = useSelector((state: RootState) => state.theme);

  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col rounded-xl transition-all duration-500",
        // Style Minimal (Shadcn gốc)
        isMinimal
          ? "bg-card text-card-foreground border py-6 shadow-sm shadow-slate-200 dark:shadow-none"
          : "bg-gradient-to-b from-[#1a3d32] to-[#0d211a] border-2 border-[#2a4d40] text-white py-0 overflow-hidden shadow-2xl",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { isMinimal } = useSelector((state: RootState) => state.theme);

  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6",
        !isMinimal && "bg-black/20 border-b border-white/5 py-4 mb-2",
        isMinimal &&
          "has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:py-4",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-bold text-lg", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 py-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
