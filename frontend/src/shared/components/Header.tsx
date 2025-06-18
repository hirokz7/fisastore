import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useCartStore } from "../../store/cartStore";

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce(
    (sum: number, item) => sum + item.quantity,
    0
  );

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Fisa Store
          </Typography>
          <Tooltip title="Carrinho">
            <IconButton color="inherit" onClick={onCartClick} sx={{ ml: 2 }}>
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Ir para o Checkout">
            <IconButton
              color="inherit"
              component={Link}
              to="/checkout"
              sx={{ ml: 1 }}
            >
              <ShoppingBagIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
