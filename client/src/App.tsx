import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserContextProvider from "./components/UserContextProvider";
import SeatContextProvider from "./components/SeatContextProvider";

const Landing = lazy(() => import("./pages/Landing"));
const Register = lazy(() => import("./pages/Register"));
const Status = lazy(() => import("./pages/Status"));
const NotFound = lazy(() => import("./pages/404"));

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <SeatContextProvider>
          <BrowserRouter>
            <Suspense>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/register" element={<Register />} />
                <Route path="/status" element={<Status />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SeatContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
}
