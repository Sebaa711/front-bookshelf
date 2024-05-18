import React from "react";
import "@fontsource/roboto";
import "@fontsource/oswald";
import ReactDOM from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Layout from "./layout";
import { AuthProvider } from "./contexts/auth.context";
import "./main.css";
import Browse from "./routes/browse";
import { loader as browseLoader } from "./routes/browse";
import { CartProvider } from "./contexts/cart.context";
import Product from "./routes/product";
import { loader as productLoader } from "./routes/product";
import Test from "./routes/test";
import NewLogin from "./routes/newLogin";
import NewRegister from "./routes/newRegister";
import UnderConstruction from "./routes/under-construction";

const router = createHashRouter([
  {
    path: "/log-in",
    element: <NewLogin />,
  },
  {
    path: "/sign-up",
    element: <NewRegister />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Test />,
      },
      {
        path: "/browse",
        element: <Browse />,
        loader: browseLoader,
      },
      {
        path: "/test",
        element: <Test />,
      },

      {
        path: "/products/:id",
        element: <Product />,
        loader: productLoader,
      },
      {
        path: "/wishlist",
        element: <UnderConstruction />,
      },
      {
        path: "/cart",
        element: <UnderConstruction />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router}></RouterProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
