import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
<<<<<<< HEAD
=======
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> 2ec82972cd9b765425a32a039fc6f4bd831e37cd
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

<<<<<<< HEAD
// Layout component that wraps all routes
function Layout({ children }: { children: React.ReactNode }) {
  return (
=======
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
>>>>>>> 2ec82972cd9b765425a32a039fc6f4bd831e37cd
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
<<<<<<< HEAD
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
=======
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
>>>>>>> 2ec82972cd9b765425a32a039fc6f4bd831e37cd

export default App;
