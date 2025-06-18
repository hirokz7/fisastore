import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Alert,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../store/cartStore";
import { useLoading } from "../../../contexts/LoadingContext";
import { PageTransition } from "../../../shared/components/PageTransition";
import axios from "axios";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [customerName, setCustomerName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.total);
  const clearCart = useCartStore((state) => state.clearCart);

  const { setIsLoading, setLoadingMessage } = useLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim() || !deliveryDate.trim() || items.length === 0) {
      setError(
        "Preencha todos os campos obrigatórios e adicione pelo menos um item."
      );
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setLoadingMessage("Processando seu pedido...");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders`,
        {
          customer_name: customerName,
          delivery_date: deliveryDate,
          items: items.map((item: any) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }
      );

      const orderData = {
        orderId: response.data.id || `ORD-${Date.now()}`,
        customerName: customerName,
        deliveryDate: deliveryDate,
        items: items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total(),
      };

      clearCart();

      navigate("/order-success", { state: orderData });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao finalizar pedido. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageTransition direction="up" timeout={600}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              background: `linear-gradient(135deg, ${theme.palette.warning.main}10, ${theme.palette.primary.main}10)`,
            }}
          >
            <Typography variant="h5" gutterBottom color="warning.main">
              Carrinho Vazio
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Adicione produtos ao seu carrinho antes de finalizar o pedido.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ fontWeight: 600 }}
            >
              Continuar Comprando
            </Button>
          </Paper>
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition direction="up" timeout={600}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}05, ${theme.palette.secondary.main}05)`,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "white",
              }}
            >
              Finalizar Pedido
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Complete suas informações para finalizar a compra
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Informações do Cliente
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nome do Cliente"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Data de Entrega"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Itens do Pedido
              </Typography>
              <List>
                {items.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      mb: 2,
                      backgroundColor: "white",
                    }}
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={`R$ ${Number(item.price)
                        .toFixed(2)
                        .replace(".", ",")}`}
                      sx={{ flex: 1 }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mr: 2,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(0, item.quantity - 1)
                          )
                        }
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography
                        variant="body1"
                        sx={{
                          minWidth: 40,
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, mr: 2, minWidth: 80 }}
                    >
                      R${" "}
                      {(Number(item.price) * item.quantity)
                        .toFixed(2)
                        .replace(".", ",")}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => removeItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                p: 3,
                mb: 4,
                backgroundColor: theme.palette.primary.main,
                color: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Total do Pedido:
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  R$ {total().toFixed(2).replace(".", ",")}
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                {isSubmitting ? "Processando..." : "Finalizar Pedido"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </PageTransition>
  );
};

export default CheckoutPage;
