import React from "react";
import { Box, Container } from "@mui/material";
import Header from "./Header";
import CartSidebar from "../../features/checkout/components/CartSidebar";
import { useNavigationWithLoading } from "../hooks/useNavigationWithLoading";
import { useCartStore } from "../../store/cartStore";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { cartOpen, setCartOpen } = useCartStore();
  const { navigateWithLoading } = useNavigationWithLoading();

  const handleCheckout = () => {
    setCartOpen(false);
    navigateWithLoading("/checkout", "Preparando checkout...");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "black",
        position: "relative",
      }}
    >
      <Header onCartClick={() => setCartOpen(!cartOpen)} />
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
        hideBackdrop
      />
      <Container
        component="main"
        sx={{
          flex: 1,
          py: 4,
          backgroundColor: "white",
          position: "relative",
          zIndex: 1,
          pointerEvents: "auto",
        }}
      >
        {children}
      </Container>
    </Box>
  );
};
