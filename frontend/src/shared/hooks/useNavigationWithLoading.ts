import { useNavigate } from "react-router-dom";
import { useLoading } from "../../contexts/LoadingContext";

export const useNavigationWithLoading = () => {
  const navigate = useNavigate();
  const { setIsLoading, setLoadingMessage } = useLoading();

  const navigateWithLoading = (
    to: string,
    loadingMessage: string = "Carregando..."
  ) => {
    setIsLoading(true);
    setLoadingMessage(loadingMessage);

    setTimeout(() => {
      navigate(to);
      setIsLoading(false);
    }, 300);
  };

  return { navigateWithLoading };
};
