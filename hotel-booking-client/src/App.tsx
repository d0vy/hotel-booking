import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./components/AuthProvider";
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Outlet />
          <Footer />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
