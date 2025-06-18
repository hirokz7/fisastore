import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Box,
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
    <Drawer
      anchor="right"
      open={open}
      onClose={hideBackdrop ? undefined : onClose}
      ModalProps={hideBackdrop ? { hideBackdrop: true } : {}}
      sx={{ width: 400 }}
    >
      <Box sx={{ width: 400, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Carrinho de Compras</Typography>
          <IconButton onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {items.map((item: any) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => removeItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={item.name}
                secondary={`R$ ${Number(item.price).toFixed(2)}`}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                <IconButton
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.qty_stock}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100" }}>
          <Typography variant="h6">
            Total: R$ {Number(total()).toFixed(2)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Fechar Compra
        </Button>
      </Box>
    </Drawer>
  );
};

export default CartSidebar;
