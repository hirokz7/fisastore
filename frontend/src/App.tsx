import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRoutes } from "./routes";
import { Layout } from "./shared/components/Layout";
import { theme } from "./shared/config/theme";
import { LoadingProvider } from "./contexts/LoadingContext";
import { GlobalLoading } from "./shared/components/GlobalLoading";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProvider>
        <GlobalLoading />
        <Layout>
          <AppRoutes />
        </Layout>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
