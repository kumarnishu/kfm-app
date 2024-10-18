import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { QueryClientProvider, QueryClient } from "react-query";

import './index.css'
import { UserProvider } from "./contexts/userContext";
import { BrowserRouter } from "react-router-dom";
import { ChoiceProvider } from "./contexts/dialogContext";
import { LoadingProvider } from './contexts/loaderContext.tsx';
import { FeatureProvider } from './contexts/featureContext.tsx';
import { AlertProvider } from './contexts/alertContext.tsx';
import { MenuProvider } from './contexts/menuContext.tsx';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: false
    }
  }
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <LoadingProvider>
          <ChoiceProvider>
            <AlertProvider>
              <FeatureProvider>
                <MenuProvider>
                  <App />
                </MenuProvider>
              </FeatureProvider>
            </AlertProvider>
          </ChoiceProvider>
        </LoadingProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
)

