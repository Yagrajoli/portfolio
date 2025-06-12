"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
}: ResumeCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, 
    margin: "0px 0px -50px 0px", 
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  // Variants for the card animation (fade, slide up, blur)
  const cardVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  // Variants for the chevron animation
  const chevronVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: { opacity: 1, x: isExpanded ? 4 : 0, rotate: isExpanded ? 90 : 0 },
  };

  return (
    <Link href={href || "#"} onClick={handleClick} className="block cursor-pointer">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={cardVariants}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Card className="flex">
          <div className="flex-none">
            <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
              <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
              <AvatarFallback>{altText[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow ml-4 items-center flex-col group">
            <CardHeader>
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                  {title}
                  {badges && (
                    <span className="inline-flex gap-x-1">
                      {badges.map((badge, index) => (
                        <Badge
                          variant="secondary"
                          className="align-middle text-xs"
                          key={index}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </span>
                  )}
                  <motion.div
                    variants={chevronVariants}
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="inline-flex"
                  >
                    <ChevronRightIcon className={cn("size-4")} />
                  </motion.div>
                </h3>
                <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                  {period}
                </div>
              </div>
              {subtitle && <div className="font-sans text-xs">{subtitle}</div>}
            </CardHeader>
            {description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  height: isExpanded ? "auto" : 0,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-2 text-xs sm:text-sm overflow-hidden"
              >
                {description}
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};