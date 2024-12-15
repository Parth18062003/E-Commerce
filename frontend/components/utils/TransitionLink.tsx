/* "use client";

import Link, { LinkProps } from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  className,
  ...props
}) => {
  const router = useRouter();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    const body = document.querySelector("body");

    body?.classList.add("page-transition");

    await sleep(300);
    router.push(href);
    await sleep(300);

    body?.classList.remove("page-transition");
  };

  return (
    <Link {...props} href={href} onClick={handleTransition} className={className} >
      {children}
    </Link>
  );
}; */
"use client";

import Link, { LinkProps } from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export const TransitionLink: React.FC<TransitionLinkProps> = ({
  children,
  href,
  className,
  ...props
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Handle the transition before navigating
  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Trigger transition if not already in progress
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Add transition class to body
    document.body.classList.add("page-transition");

    // Wait for transition to finish (300ms)
    setTimeout(async () => {
      // Perform navigation after the transition
      router.push(href);
      // Reset transition state
      setIsTransitioning(false);
      // Remove transition class after navigation
      document.body.classList.remove("page-transition");
    }, 300);
  };

  return (
    <Link {...props} href={href} onClick={handleTransition} className={className}>
      {children}
    </Link>
  );
};

