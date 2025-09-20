"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

type InfoCardProps = {
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  className?: string;
};

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const styles = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

export function InfoCard({
  type = "info",
  title,
  message,
  className,
}: InfoCardProps) {
  return (
    <div className="flex items-center justify-center mt-8 w-full">
      <Card
        className={cn(
          "flex items-start gap-3 p-4 border rounded-lg max-w-sm w-full shadow-md",
          styles[type],
          className,
        )}
      >
        <div className="mt-0.5">{icons[type]}</div>
        <div>
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-xs opacity-90">{message}</p>
        </div>
      </Card>
    </div>
  );
}