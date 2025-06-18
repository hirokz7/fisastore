import React, { useState } from "react";
import { Product } from "../../../shared/types";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  Chip,
  Fade,
  useTheme,
  Skeleton,
} from "@mui/material";
import { ShoppingCart, CheckCircle } from "@mui/icons-material";
import { useCartStore } from "../../../store/cartStore";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const isInCart = items.some((item: any) => item.id === product.id);
  const theme = useTheme();

  const handleAddToCart = () => {
    addItem(product);
  };

  const getStockStatus = () => {
    if (product.qty_stock === 0)
      return { label: "Sem estoque", color: "error" as const };
    if (product.qty_stock <= 5)
      return { label: "Últimas unidades", color: "warning" as const };
    return { label: "Em estoque", color: "success" as const };
  };

  const stockStatus = getStockStatus();

  return (
    <Fade in={true} timeout={500}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[8],
          },
          position: "relative",
          overflow: "hidden",
        }}
        elevation={2}
      >
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Chip
            label={stockStatus.label}
            color={stockStatus.color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ position: "relative", height: 200 }}>
          {!imageLoaded && !imageError && (
            <Skeleton variant="rectangular" height={200} animation="wave" />
          )}
          <CardMedia
            component="img"
            height="200"
            image={
              product.image_url ||
              "https://via.placeholder.com/300x200?text=Produto"
            }
            alt={product.name}
            sx={{
              display: imageLoaded && !imageError ? "block" : "none",
              objectFit: "cover",
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {imageError && (
            <Box
              sx={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.palette.grey[100],
                color: theme.palette.text.secondary,
              }}
            >
              <Typography variant="body2">Imagem não disponível</Typography>
            </Box>
          )}
        </Box>

        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              fontSize: "12px",
              lineHeight: 1.2,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </Typography>

          {product.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.4,
              }}
            >
              {product.description}
            </Typography>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              component="span"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              R$ {Number(product.price).toFixed(2).replace(".", ",")}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontStyle: "italic" }}
          >
            {product.qty_stock > 0
              ? `${product.qty_stock} unidade${
                  product.qty_stock > 1 ? "s" : ""
                } disponível${product.qty_stock > 1 ? "s" : ""}`
              : "Produto indisponível"}
          </Typography>

          <Button
            variant={isInCart ? "outlined" : "contained"}
            color={isInCart ? "success" : "primary"}
            onClick={handleAddToCart}
            disabled={product.qty_stock === 0 || isInCart}
            startIcon={isInCart ? <CheckCircle /> : <ShoppingCart />}
            sx={{
              mt: "auto",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "none",
              lineHeight: 1.2,
              py: 1.5,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
            fullWidth
          >
            {isInCart
              ? "Adicionado ao carrinho"
              : product.qty_stock === 0
              ? "Indisponível"
              : "Adicionar ao carrinho"}
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default ProductCard;
