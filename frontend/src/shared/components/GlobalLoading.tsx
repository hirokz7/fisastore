import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useLoading } from "../../contexts/LoadingContext";

export const GlobalLoading: React.FC = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return <LoadingSpinner message={loadingMessage} fullScreen />;
};
