"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useVerification } from "@/hooks/useVerification";

export function VerificationForm() {
  const [email, setEmail] = useState("");
  const { verifyEmail, status, loading, error } = useVerification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyEmail(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4 text-zinc-800">Verify Student Status</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Enter your university email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || status.isVerified}
            className="w-full text-zinc-600"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status.isVerified ? (
          <Alert>
            <AlertDescription className="text-zinc-600">
              Verified student at {status.university?.name}
            </AlertDescription>
          </Alert>
        ) : (
          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            Verify Email
          </Button>
        )}
      </form>
    </motion.div>
  );
}