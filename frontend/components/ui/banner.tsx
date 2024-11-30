"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  X,
  ChevronUp,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  link?: {
    text: string;
    url: string;
  };
  expiresAt?: Date;
}

interface AlertBannerProps {
  alerts: Alert[];
}

const alertTypeIcons: Record<AlertType, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: AlertCircle
};

const alertTypeStyles: Record<AlertType, string> = {
  info: "bg-indigo-500/10 text-blue-700 dark:text-blue-300",
  warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  success: "bg-green-500/10 text-green-700 dark:text-green-300",
  error: "bg-red-500/10 text-red-700 dark:text-red-300"
};

export function AlertBanner({ alerts: initialAlerts }: AlertBannerProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (alerts.length > 1) {
        setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [alerts]);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    if (currentAlertIndex >= alerts.length - 1) {
      setCurrentAlertIndex(0);
    }
  };

  if (alerts.length === 0) return null;

  const currentAlert = alerts[currentAlertIndex];
  const Icon = alertTypeIcons[currentAlert.type];

  return (
    <div className="relative z-10">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }} // Adjusts the speed of the transition
            className={`relative ${alertTypeStyles[currentAlert.type]} transition-colors`}
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center justify-center w-full">
                    <p className="font-medium text-center text-lg">{currentAlert.title}</p>
                    <p className="text-sm opacity-90 text-center text-md">{currentAlert.message}</p>
                    {currentAlert.link && (
                      <Link
                        href={currentAlert.link.url}
                        className="flex items-center gap-1 text-sm font-medium hover:underline mt-2"
                      >
                        {currentAlert.link.text}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-2 right-0">
                  {alerts.length > 1 && (
                    <span className="text-sm opacity-75">
                      {currentAlertIndex + 1}/{alerts.length}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => dismissAlert(currentAlert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 -bottom-6 h-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}