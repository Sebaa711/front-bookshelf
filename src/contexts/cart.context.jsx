/* eslint-disable react/prop-types */
import { createContext, useRef, useState } from "react";

export const CartContext = createContext();

export const CartProvider = (props) => {
  const [wishListSize, setwishListSize] = useState(null);
  const [shoppingCartSize, setShoppingCartSize] = useState(null);

  const [popUpInfo, setPopUpInfo] = useState();
  const popUpRef = useRef(null);

  return (
    <CartContext.Provider
      value={{
        wishListSize,
        setwishListSize,
        shoppingCartSize,
        setShoppingCartSize,
        popUpRef,
        popUpInfo,
        setPopUpInfo,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};
