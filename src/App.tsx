import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { RecipeProvider } from "@/context/RecipeContext";
import Index from "./pages/Index";
import { Cookbook } from "./pages/Cookbook";
import { RecipeDetail } from "./pages/RecipeDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <RecipeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="bottom-right" richColors />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cook" element={<Cookbook />} />
              <Route path="/cookbook" element={<Navigate to="/cook" replace />} />
              <Route path="/cook/:recipeId" element={<RecipeDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RecipeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
