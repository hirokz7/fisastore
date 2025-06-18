import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  ShoppingBag,
  CalendarToday,
  Person,
  Home,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { PageTransition } from "../../../shared/components/PageTransition";

interface OrderSuccessData {
  orderId: string;
  customerName: string;
  deliveryDate: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const orderData = location.state as OrderSuccessData;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <PageTransition direction="up" timeout={600}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            background: `linear-gradient(135deg, ${theme.palette.success.main}10, ${theme.palette.primary.main}10)`,
            border: `2px solid ${theme.palette.success.main}30`,
          }}
        >
          <Box sx={{ mb: 3 }}>
            <CheckCircle
              sx={{
                fontSize: 80,
                color: theme.palette.success.main,
                mb: 2,
              }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.success.main,
              mb: 2,
            }}
          >
            Pedido Realizado com Sucesso!
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Seu pedido foi processado e está sendo preparado para entrega.
          </Typography>

          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 4,
              backgroundColor: "white",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Detalhes do Pedido
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Person sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="body1">
                <strong>Cliente:</strong> {orderData?.customerName || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <CalendarToday
                sx={{ mr: 1, color: theme.palette.primary.main }}
              />
              <Typography variant="body1">
                <strong>Data de Entrega:</strong>{" "}
                {orderData?.deliveryDate
                  ? formatDate(orderData.deliveryDate)
                  : "N/A"}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ShoppingBag
                  sx={{ mr: 1, color: theme.palette.primary.main }}
                />
                <Typography variant="h6">Itens do Pedido</Typography>
              </Box>
              <List
                sx={{
                  backgroundColor: theme.palette.grey[50],
                  borderRadius: 1,
                }}
              >
                {orderData?.items?.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderBottom:
                        index < orderData.items.length - 1
                          ? `1px solid ${theme.palette.divider}`
                          : "none",
                    }}
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantidade: ${item.quantity}`}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      R${" "}
                      {(item.price * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                backgroundColor: theme.palette.primary.main,
                color: "white",
                borderRadius: 1,
              }}
            >
              <Typography variant="h6">Total do Pedido:</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                R$ {orderData?.total?.toFixed(2).replace(".", ",") || "0,00"}
              </Typography>
            </Box>
          </Paper>

          <Box
            sx={{
              p: 3,
              mb: 4,
              backgroundColor: theme.palette.info.light,
              color: theme.palette.info.contrastText,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              📦 Informações de Entrega
            </Typography>
            <Typography variant="body2">
              Você receberá uma confirmação por email com os detalhes da
              entrega. Nosso time entrará em contato para confirmar o horário de
              entrega.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Número do Pedido:
            </Typography>
            <Chip
              label={orderData?.orderId || "N/A"}
              variant="outlined"
              sx={{
                fontSize: "1.1rem",
                fontWeight: 600,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={handleGoHome}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Voltar ao Início
            </Button>
          </Box>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default OrderSuccessPage;
