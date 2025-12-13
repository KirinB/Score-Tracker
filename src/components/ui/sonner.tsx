import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      richColors
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600" />,
        info: <InfoIcon className="size-4 text-sky-600" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600" />,
        error: <OctagonXIcon className="size-4 text-red-600" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          success:
            "text-emerald-900 border border-emerald-300 dark:text-emerald-100 dark:border-emerald-800",
          error:
            "text-red-900 border border-red-300 dark:bg-red-950 dark:text-red-100 dark:border-red-800",
          warning:
            "text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-100 dark:border-amber-800",
          info: "bg-sky-50 text-sky-900 border border-sky-300 dark:bg-sky-950 dark:text-sky-100 dark:border-sky-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
