// components/AnimatedIconSwitcher.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface AnimatedIconSwitcherProps {
  show: boolean;
  libraryLoadingIcon: { isLoading: boolean; loadingSpinner: React.ReactNode };
  enterIcon: React.ReactNode;
  exitIcon: React.ReactNode;
  duration?: number;
}

export const AnimatedIconSwitcher: React.FC<AnimatedIconSwitcherProps> = ({
  show,
  libraryLoadingIcon,
  enterIcon,
  exitIcon,
  duration = 0.15,
}) => {
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={show ? "enter" : "exit"}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="flex items-center justify-center"
      >
        {libraryLoadingIcon.isLoading
          ? libraryLoadingIcon.loadingSpinner
          : show
          ? enterIcon
          : exitIcon}
        {/* Render the appropriate icon based on the 'show' prop */}
        {/* {libraryLoadingIcon.isLoading ? libraryLoadingIcon.loadingSpinner : */}
        {/* {show ? enterIcon : exitIcon} */}
      </motion.div>
    </AnimatePresence>
  );
};
