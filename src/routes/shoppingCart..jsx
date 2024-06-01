/* eslint-disable react/prop-types */
import axios from "axios";
import { getToken } from "../utils/storageUtils";
import { useLoaderData, useNavigate } from "react-router-dom";
import useCartActions from "../utils/cart-actions";
import { useContext, useEffect, useState } from "react";
import { NotFoundSearch } from "./browse";
import { CartContext } from "../contexts/cart.context";

export async function loader() {
  const params = new URLSearchParams();
  const token = getToken();
  if (token) params.set("token", token);
  else return null;
  let results = await axios.get(
    `${
      import.meta.env.VITE_SERVER_URI
    }/browse/shoppingCart?${params.toString()}`
  );
  return results;
}

async function getTotal() {
  const params = new URLSearchParams();
  const token = getToken();
  if (token) params.set("token", token);
  else return null;
  let results = await axios.get(
    `${
      import.meta.env.VITE_SERVER_URI
    }/browse/shoppingCartTotal?${params.toString()}`
  );
  return results;
}

function ShoppingCart() {
  const { shoppingCartSize } = useContext(CartContext);
  useEffect(() => {
    document.title = "Cart";
  }, []);

  if (!shoppingCartSize || shoppingCartSize.length === 0) {
    return (
      <div className="middle-screen flex-column">
        {" "}
        <h1 style={{ fontFamily: "Oswald", fontStyle: "italic" }}>
          You cart is empty
        </h1>
        <NotFoundSearch text="Go Back" />
      </div>
    );
  }

  return (
    <div className="cart-container my-5">
      <CartItems />
    </div>
  );
}

function CartItems() {
  const {
    data: { shoppingCart, total },
  } = useLoaderData();

  const [items, setItems] = useState(shoppingCart);
  const [currentTotal, setCurrentTotal] = useState(total);

  function removeFromItems(isbn) {
    setItems((items) => items.filter((book) => book.info.isbn !== isbn));
  }

  const { removeFromCart } = useCartActions();

  return (
    <>
      <h1 style={{ fontFamily: "Oswald" }} className="mb-3 ms-3">
        Shopping Cart
      </h1>
      <div className="main-container">
        <div className="cart-books-container">
          {items.map((book) => (
            <CartItem
              {...book}
              key={book.info.isbn}
              onClick={async () => {
                await removeFromCart(book._id, book.img);
                removeFromItems(book.info.isbn);
                (async () => {
                  const total = await getTotal();
                  console.log(total);
                  setCurrentTotal(total.data.total);
                })();
              }}
            />
          ))}
        </div>
        {/* <Checkout currentTotal={currentTotal} /> */}
      </div>
    </>
  );
}

function CartItem({ author, price, img, binding, name, _id, onClick }) {
  const navigate = useNavigate();
  return (
    <div className="cart-item d-flex overflow-hidden py-3">
      <div className="img-container">
        <img
          src={img}
          alt={`${name}'s cover`}
          className="ms-3"
          style={{ width: 100, height: "100%", cursor: "pointer" }}
          onClick={() => navigate(`/products/${_id}`)}
        />
      </div>

      <div className="details-container-shop ms-3 d-flex flex-column gap-1 col-12 col-md-9 mt-md-0 ps-md-2">
        <p className="m-0 fs-5">
          by <strong>{author}</strong>
        </p>
        <p className="m-0 fs-5">
          <em>{binding}</em>
        </p>
        <strong className="fs-3 mt-auto">${price}</strong>
        <strong
          style={{ color: "var(--primary-color)", cursor: "pointer" }}
          onClick={onClick}
        >
          Remove from cart
        </strong>
      </div>
    </div>
  );
}

function Checkout({ currentTotal }) {
  return (
    <div className="checkout-container">
      <h1>Total Price: ${currentTotal}</h1>
    </div>
  );
}

export default ShoppingCart;
