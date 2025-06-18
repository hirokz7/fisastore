import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useOrderStore } from "../../../store/orderStore";
import { orderService } from "../../../shared/services";
import { useProducts } from "../../../shared/hooks";
import { formatCurrency } from "../../../shared/utils/formatters";
import { BRAND_COLOR, BRAND_COLOR_HOVER } from "../../../shared/constants";
import { OrderItem } from "../../../shared/types";
import { OrderFormSubmitData } from "../types/form";

const schema = yup.object().shape({
  customer_name: yup.string().required("Nome do cliente é obrigatório"),
  delivery_date: yup.string().required("Data de entrega é obrigatória"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        product_id: yup.number().required("Produto é obrigatório"),
        quantity: yup
          .number()
          .required("Quantidade é obrigatória")
          .min(1, "Quantidade deve ser maior que 0"),
      })
    )
    .min(1, "Adicione pelo menos um item")
    .required("Itens são obrigatórios")
    .default([]),
});

type OrderFormSchema = yup.InferType<typeof schema>;

export const OrderForm: React.FC = () => {
  const [error, setError] = useState<string>("");
  const { products, loading, error: productsError } = useProducts();
  const { clearOrder, calculateTotal, setItems } = useOrderStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<OrderFormSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      customer_name: "",
      delivery_date: "",
      items: [{ product_id: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  useEffect(() => {
    if (!watchItems?.length) return;

    const updatedItems: OrderItem[] = watchItems.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product?.price || 0,
      };
    });
    setItems(updatedItems);
  }, [watchItems, products, setItems]);

  const validateQuantity = (productId: number, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (product && quantity > product.qty_stock) {
      return `Quantidade indisponível. Estoque atual: ${product.qty_stock}`;
    }
    return true;
  };

  const updateItemsInStore = (
    index: number,
    productId: number,
    quantity: number
  ) => {
    const updatedItems: OrderItem[] = watchItems.map((item, idx) => {
      const product = products.find((p) => p.id === item.product_id);
      return {
        product_id: item.product_id,
        quantity: idx === index ? quantity : item.quantity,
        unit_price: product?.price || 0,
      };
    });
    setItems(updatedItems);
  };

  const onSubmit: SubmitHandler<OrderFormSchema> = async (data) => {
    try {
      for (const item of data.items) {
        const validation = validateQuantity(item.product_id, item.quantity);
        if (validation !== true) {
          setError(validation as string);
          return;
        }
      }

      const orderData: OrderFormSubmitData = {
        customer_name: data.customer_name,
        delivery_date: data.delivery_date,
        items: data.items.map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          return {
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: product?.price || 0,
          };
        }),
        total_value: calculateTotal(),
        status: "pending",
      };

      await orderService.createOrder(orderData);
      clearOrder();
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar pedido");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: BRAND_COLOR }}
        >
          Fisa Store
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Novo Pedido
        </Typography>

        {(error || productsError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || productsError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 300px" }}>
                <TextField
                  fullWidth
                  label="Nome do Cliente"
                  {...register("customer_name")}
                  error={!!errors.customer_name}
                  helperText={errors.customer_name?.message}
                />
              </Box>

              <Box sx={{ flex: "1 1 300px" }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Entrega"
                  InputLabelProps={{ shrink: true }}
                  {...register("delivery_date")}
                  error={!!errors.delivery_date}
                  helperText={errors.delivery_date?.message}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Itens do Pedido
              </Typography>
              {fields.map((field, index) => (
                <Box key={field.id} sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    select
                    label="Produto"
                    {...register(`items.${index}.product_id`)}
                    error={!!errors.items?.[index]?.product_id}
                    helperText={errors.items?.[index]?.product_id?.message}
                    sx={{ flex: 2 }}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setValue(`items.${index}.product_id`, value);
                      const quantity = watch(`items.${index}.quantity`);
                      setError("");
                      const validation = validateQuantity(value, quantity);
                      if (validation !== true) {
                        setError(validation as string);
                      }
                      updateItemsInStore(index, value, quantity);
                    }}
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} - {formatCurrency(product.price)}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    type="number"
                    label="Quantidade"
                    {...register(`items.${index}.quantity`)}
                    error={!!errors.items?.[index]?.quantity}
                    helperText={errors.items?.[index]?.quantity?.message}
                    sx={{ flex: 1 }}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      const productId = watch(`items.${index}.product_id`);
                      const validation = validateQuantity(productId, value);
                      if (validation !== true) {
                        setError(validation as string);
                      } else {
                        setError("");
                      }
                      setValue(`items.${index}.quantity`, value);
                      updateItemsInStore(index, productId, value);
                    }}
                  />

                  <IconButton
                    onClick={() => remove(index)}
                    color="error"
                    sx={{ alignSelf: "center" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant="outlined"
                onClick={() => append({ product_id: 0, quantity: 1 })}
                sx={{ mt: 2 }}
              >
                Adicionar Item
              </Button>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Total: {formatCurrency(calculateTotal())}
              </Typography>
            </Box>

            <Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  bgcolor: BRAND_COLOR,
                  "&:hover": { bgcolor: BRAND_COLOR_HOVER },
                }}
              >
                Criar Pedido
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
