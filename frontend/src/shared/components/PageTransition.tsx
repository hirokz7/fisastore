import React from "react";
import { Fade, Slide } from "@mui/material";

interface PageTransitionProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  timeout?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  direction = "up",
  timeout = 500,
}) => {
  return (
    <Slide direction={direction} in={true} timeout={timeout}>
      <div>
        <Fade in={true} timeout={timeout + 200}>
          <div>{children}</div>
        </Fade>
      </div>
    </Slide>
  );
};
