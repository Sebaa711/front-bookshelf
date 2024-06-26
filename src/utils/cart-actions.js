import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";
import { CartContext } from "../contexts/cart.context";
import { useContext } from "react";

const useCartActions = () => {
  const { currentToken } = useContext(AuthContext);
  const { setShoppingCartSize, setwishListSize } = useContext(CartContext);
  const navigate = useNavigate();
  const { setPopUpInfo } = useContext(CartContext);

  const addToCart = async (_id, img, showPopUp = true) => {
    try {
      setPopUpInfo(null);
      if (!currentToken) {
        navigate("/log-in");
        return;
      }

      const response = await axios.post(
        import.meta.env.VITE_SERVER_URI + "/add-to-cart",
        {
          token: currentToken,
          bookId: _id,
        }
      );

      if (response.data.done) {
        setShoppingCartSize((val) => val + 1);
        if (showPopUp) {
          setPopUpInfo({
            img,
            action: "Succesfully added to your cart!",
            icon: "bi bi-cart-plus popup-done",
          });
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (_id, img, showPopUp = true) => {
    setPopUpInfo(null);
    if (!currentToken) return navigate("/log-in");
    const response = await axios.post(
      import.meta.env.VITE_SERVER_URI + "/remove-from-cart",
      {
        token: currentToken,
        bookId: _id,
      }
    );
    if (response.data.done) {
      setShoppingCartSize((val) => val - 1);
      if (showPopUp) {
        setPopUpInfo({
          img,
          action: "Succesfully removed from your cart!",
          icon: "bi bi-cart-dash popup-done pop-up-close",
        });
      }
    }
  };

  const removeFromWishlist = async (_id, img) => {
    setPopUpInfo(null);
    if (!currentToken) return navigate("/log-in");
    const response = await axios.post(
      import.meta.env.VITE_SERVER_URI + "/remove-from-wishlist",
      {
        token: currentToken,
        bookId: _id,
      }
    );
    console.log(response.data);
    if (response.data.done) {
      setwishListSize((val) => val - 1);
      setPopUpInfo({
        img,
        action: "Succesfully removed from your wish list!",
        icon: "bi bi-heartbreak-fill popup-done popup-heartbroken",
      });
    }
  };

  const addToWishlist = async (_id, img) => {
    setPopUpInfo(null);

    if (!currentToken) return navigate("/log-in");
    const response = await axios.post(
      import.meta.env.VITE_SERVER_URI + "/add-to-wishlist",
      {
        token: currentToken,
        bookId: _id,
      }
    );
    console.log(response.data);
    if (response.data.done) {
      setwishListSize((val) => val + 1);
      setPopUpInfo({
        img,
        action: "Succesfully added to your wish list!",
        icon: "bi bi-heart-fill popup-done",
      });
    }
  };

  return {
    addToCart,
    removeFromCart,
    removeFromWishlist,
    addToWishlist,
  };
};

export default useCartActions;
