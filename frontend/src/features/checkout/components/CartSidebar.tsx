import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Box,
  Slide,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { useCartStore } from "../../../store/cartStore";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
  hideBackdrop?: boolean;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  open,
  onClose,
  onCheckout,
  hideBackdrop = false,
}) => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const total = useCartStore((state) => state.total);

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          right: 0,
          top: 0,
          width: { xs: "100%", sm: 400 },
          maxWidth: 400,
          height: "100vh",
          backgroundColor: "white",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexShrink: 0,
          }}
        >
          <Typography variant="h6">Carrinho de Compras</Typography>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ flex: 1, overflow: "auto" }}>
          {items.map((item: any) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => removeItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                mb: 1,
                backgroundColor: "white",
              }}
            >
              <ListItemText
                primary={item.name}
                secondary={`R$ ${Number(item.price).toFixed(2)}`}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1, minWidth: 20, textAlign: "center" }}>
                  {item.quantity}
                </Typography>
                <IconButton
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.qty_stock}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "grey.100",
            borderRadius: 1,
            flexShrink: 0,
          }}
        >
          <Typography variant="h6">
            Total: R$ {Number(total()).toFixed(2)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, flexShrink: 0 }}
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Fechar Compra
        </Button>
      </Box>
    </Slide>
  );
};

export default CartSidebar;
