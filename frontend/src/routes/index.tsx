import React from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "../features/products";
import { CheckoutPage } from "../features/checkout";
import { OrderSuccessPage } from "../features/order-success";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
    </Routes>
  );
};
