/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { getToken } from "../utils/storageUtils";
import Accordion from "../utils/accordion";
import useCartActions from "../utils/cart-actions";
import { onClick as buttonEffect } from "../utils/buttonClickedCircle";

export async function loader({ params }) {
  const token = getToken();
  const result = await axios.get(
    `${import.meta.env.VITE_SERVER_URI}/book/${params.id}${
      token ? `?token=${token}` : ""
    }`
  );
  return result;
}

export default function Product({ imgSize = 250 }) {
  const { result: book } = useLoaderData().data;

  return (
    <div className="main my-5 container-fluid">
      <div className="product-main row">
        <div className="img-container d-flex justify-content-center align-items-start col-12 col-md-4 col-xl-3">
          <img
            src={book.img}
            alt={`${book.name}'s cover`}
            className="img-fluid"
            style={{ maxWidth: imgSize }}
          />
        </div>
        <ProductCard />
        <div className="info-container ps-4 mt-5">
          <h1 style={{ fontFamily: "Oswald" }}>About</h1>
          <div
            className="info-text mt-5 fs-5"
            dangerouslySetInnerHTML={{ __html: book.about }}
          ></div>
        </div>
        <div className="extra-info-container ps-4 mt-5">
          <AccordionComponent title="More Info">
            <p className="fs-4 fs">
              - ISBN: <span style={{ fontWeight: 800 }}>{book.info.isbn}</span>
            </p>
            <p className="fs-4">
              - Category:{" "}
              <span style={{ fontWeight: 800 }}>{book.category}</span>
            </p>
            <p className="fs-4">
              - Subjects:{" "}
              <span style={{ fontWeight: 800 }}>
                {book.subjects.join(", ")}
              </span>
            </p>
            <p className="fs-4">
              - Publisher:{" "}
              <span style={{ fontWeight: 800 }}>{book.info.publisher}</span>
            </p>
            <p className="fs-4">
              - Published Date:{" "}
              <span style={{ fontWeight: 800 }}>
                {book.info.published_date}
              </span>
            </p>
            <p className="fs-4">
              - Page Count:{" "}
              <span style={{ fontWeight: 800 }}>{book.info.page_count}</span>
            </p>
            <p className="fs-4">
              - Size: <span style={{ fontWeight: 800 }}>{book.info.size}</span>
            </p>
            <p className="fs-4">
              - Language:{" "}
              <span style={{ fontWeight: 800 }}>{book.info.language}</span>
            </p>
          </AccordionComponent>
        </div>
      </div>
    </div>
  );
}

function ProductCard() {
  const [isInCart, setIsInCart] = useState(false);
  const [isInWish, setIsInWish] = useState(false);

  const {
    result: book,
    isInWish: wishInDb,
    isInCart: cartInDb,
  } = useLoaderData().data;

  const { addToCart, removeFromCart, addToWishlist, removeFromWishlist } =
    useCartActions();

  useEffect(() => {
    document.title = book.name;
    if (cartInDb) setIsInCart(true);
    if (wishInDb) setIsInWish(true);
  }, [book.name, cartInDb, wishInDb]);

  return (
    <>
      <div className="details-container mt-5 d-flex flex-column gap-2 col-12 col-md-8 mt-md-0 ps-md-2 col-xl-9">
        <h1 className="mb-3" style={{ fontFamily: "Oswald" }}>
          {book.name}
        </h1>
        <span className="fs-4">
          by <strong>{book.author}</strong>
        </span>
        <strong className="fs-4">{book.binding}</strong>
        <strong className="fs-3 mt-md">${book.price}</strong>

        <div className="card-book-buttons mt-2 d-flex justify-content-start gap-3 mt-md-auto">
          <div
            className="buttonWrapper buttonWrapper-product position-relative"
            onClick={buttonEffect}
          >
            {isInCart ? (
              <button
                className="remove-from-cart"
                onClick={async () => {
                  await removeFromCart(book._id, book.img);
                  setIsInCart(false);
                }}
              >
                Remove from cart
              </button>
            ) : (
              <button
                className="add-to-cart"
                onClick={async () => {
                  await addToCart(book._id, book.img, book.name);
                  setIsInCart(true);
                }}
              >
                Add To Cart
              </button>
            )}
          </div>
          <i
            className={`d-flex bi align-items-center justify-content-center wishlistButton ${
              isInWish ? `wish-added bi-heart-fill` : "bi-heart"
            }`}
            onClick={
              isInWish
                ? async (e) => {
                    e.stopPropagation();
                    await removeFromWishlist(book._id, book.img);
                    setIsInWish(false);
                  }
                : async (e) => {
                    e.stopPropagation();
                    await addToWishlist(book._id, book.img);
                    setIsInWish(true);
                  }
            }
            style={{ fontSize: "2.5rem", cursor: "pointer" }}
          ></i>
        </div>
      </div>
    </>
  );
}

function AccordionComponent({ title, children }) {
  const detailsRef = useRef();
  useEffect(() => {
    new Accordion(detailsRef.current);
  }, []);

  return (
    <details ref={detailsRef}>
      <summary>
        <span className="faq-title">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="expand-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M9 6l6 6l-6 6"></path>
        </svg>
      </summary>
      <div className="faq-content mt-3">{children}</div>
    </details>
  );
}
