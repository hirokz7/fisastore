import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Pagination,
  Box,
  Typography,
  Skeleton,
  Alert,
  Paper,
  useTheme,
} from "@mui/material";
import { apiService } from "../../../shared/services";
import { Product } from "../../../shared/types";
import ProductCard from "../components/ProductCard";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { PageTransition } from "../../../shared/components/PageTransition";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage]);

  const loadProducts = async (page: number) => {
    setIsLoadingProducts(true);
    setError(null);

    try {
      const response = await apiService.getProducts(page);
      setProducts(response.data);
      setTotalPages(response.last_page);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setError("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ProductSkeleton = () => (
    <Grid item xs={12} sm={6} md={4} lg={2.4}>
      <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={40} />
      </Paper>
    </Grid>
  );

  const renderProductSkeletons = () => {
    return Array.from({ length: 12 }).map((_, index) => (
      <ProductSkeleton key={index} />
    ));
  };

  return (
    <PageTransition direction="up" timeout={600}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box
          sx={{
            mb: 4,
            textAlign: "center",
            py: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Nossos Produtos
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Descubra nossa seleção exclusiva de produtos
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Products Grid */}
        <Grid container spacing={3}>
          {isLoadingProducts
            ? renderProductSkeletons()
            : products.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={2.4}>
                  <ProductCard product={product} />
                </Grid>
              ))}
        </Grid>

        {/* Loading State */}
        {isLoadingProducts && products.length === 0 && (
          <Box sx={{ mt: 4 }}>
            <LoadingSpinner message="Carregando produtos..." />
          </Box>
        )}

        {/* Empty State */}
        {!isLoadingProducts && products.length === 0 && !error && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Nenhum produto encontrado
            </Typography>
            <Typography variant="body2">
              Tente ajustar os filtros ou volte mais tarde.
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
              mb: 2,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                px: 3,
                py: 2,
                borderRadius: 2,
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                disabled={isLoadingProducts}
              />
            </Paper>
          </Box>
        )}
      </Container>
    </PageTransition>
  );
};

export default HomePage;
