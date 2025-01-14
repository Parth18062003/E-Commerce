"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Share2, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StudentOffer } from "@/components/student-offers/types";

interface OfferCardProps {
  offer: StudentOffer;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
  isVerified?: boolean;
}

export function OfferCard({ offer, onFavorite, isVerified }: OfferCardProps) {
  const [copied, setCopied] = useState(false);

  const copyPromoCode = async () => {
    if (offer.promoCode) {
      await navigator.clipboard.writeText(offer.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOffer = async () => {
    try {
      await navigator.share({
        title: `${offer.companyName} Student Offer`,
        text: offer.description,
        url: window.location.href,
      });
    } catch (err) {
      // Handle sharing error
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <Image
          src={offer.logo}
          alt={offer.companyName}
          width={512}
          height={512}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-4 left-4">
          {offer.category}
        </Badge>
        {offer.expiryDate && (
          <Badge
            variant="secondary"
            className="absolute top-4 right-4"
          >
            Expires {new Date(offer.expiryDate).toLocaleDateString()}
          </Badge>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-zinc-500">{offer.companyName}</h3>
        <p className="text-2xl font-bold text-zinc-600 mb-2">
          {offer.discountType === "percentage" ? (
            `${offer.discountValue}% OFF`
          ) : (
            `$${offer.discountValue} OFF`
          )}
        </p>
        <p className="text-muted-foreground mb-4">{offer.description}</p>

        <div className="flex items-center gap-2 text-zinc-700">
          {!isVerified && (<Badge variant="secondary">Verify to redeem</Badge>)}
          {isVerified && offer.promoCode && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={copyPromoCode}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {offer.promoCode}
            </Button>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={shareOffer}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share offer</TooltipContent>
          </Tooltip>

          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <a
              href={offer.termsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}