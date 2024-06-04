/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import { onClick as buttonEffect } from "../utils/buttonClickedCircle";
import useCartActions from "../utils/cart-actions";
import axios from "axios";

export async function loader() {
  let results = await axios.get(
    `${import.meta.env.VITE_SERVER_URI}/browse/random-books`
  );
  return results;
}

function Test() {
  useEffect(() => {
    document.title = "Bookshelf";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="main landing">
      <div className="banner-landing align-items-center row">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F12cbceb6be9648e2a8a23b8c10684f0b%2F3d58dcb7e64c4152bf11151669b5224f?format=webp&width=2000"
          className="col-12 col-md-4 img-set-1"
          alt="Banner Image Mock"
        />
        <div className="wrapper col-12 col-md-4 text-center py-5">
          <h1
            style={{
              fontFamily: "Oswald",
              fontSize: "5rem",
              fontWeight: 800,
              whiteSpace: "wrap",
            }}
          >
            {"50% OFF"}
          </h1>
          <span
            className
            style={{
              fontSize: "1.4rem",
              fontStyle: "italic",
              fontFamily: "Oswald",
            }}
          >
            Using coupon &quot;5050&quot;
          </span>
          <NavLink className="banner-button" to="/browse">
            Explore
          </NavLink>
        </div>

        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F12cbceb6be9648e2a8a23b8c10684f0b%2F0c04c1c9c7744c2398fe7158225aae53?format=webp&width=2000"
          className="col-12 col-md-4 img-set-2"
          alt="Banner Image Mock 2"
        />
      </div>
      <RecommendedBooks />
    </div>
  );
}

function BookCardMain({ img, price, _id, name }) {
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);

  const { inShoppingCart: shoppingCart } = useLoaderData().data;

  const { addToCart, removeFromCart } = useCartActions();

  useEffect(() => {
    if (shoppingCart.includes(_id)) {
      setIsInCart(true);
    }
  }, [_id, shoppingCart]);

  return (
    <div
      className="card-book-main"
      style={{ width: "calc(var(--card-width) - var(--gap))" }}
    >
      <div
        className="img-container img-container-main d-flex justify-content-center align-items-center"
        style={{ height: 250, width: "auto", overflow: "hidden" }}
      >
        <img
          src={img}
          alt={`${name}'s book cover`}
          loading="lazy"
          onClick={() => navigate(`/products/${_id}`)}
          style={{ cursor: "pointer", overflow: "hidden", marginTop: "auto" }}
        />
      </div>
      <div className="card-book-details d-flex justify-content-center align-items-center flex-column">
        <span style={{ fontSize: "1.3rem", fontWeight: 800 }}>${price}</span>
        <div className="card-book-buttons mt-2 justify-content-center">
          <div
            className="buttonWrapper buttonWrapper-card position-relative"
            onClick={(e) => buttonEffect(e)}
          >
            {isInCart ? (
              <button
                className="remove-from-cart"
                onClick={async () => {
                  await removeFromCart(_id, img);
                  setIsInCart(false);
                }}
              >
                In Cart
              </button>
            ) : (
              <button
                className="add-to-cart"
                onClick={async () => {
                  await addToCart(_id, img);
                  setIsInCart(true);
                }}
              >
                Add To Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendedBooks() {
  const data = useLoaderData();
  const recommenddedBooksRef = useRef(null);
  const [debounce, setDebounce] = useState(false);

  function scrollRecommended(right) {
    if (debounce) return;
    setDebounce((deb) => !deb);

    if (right) {
      const scrollableDiv = recommenddedBooksRef.current;
      const maxScrollLeft =
        scrollableDiv.scrollWidth - scrollableDiv.clientWidth;
      const newScrollLeft = Math.min(
        scrollableDiv.scrollLeft + 950,
        maxScrollLeft
      );

      scrollableDiv.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    } else {
      const scrollableDiv = recommenddedBooksRef.current;
      const newScrollLeft = Math.max(scrollableDiv.scrollLeft - 950, 0);

      scrollableDiv.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }

    setTimeout(() => setDebounce((deb) => !deb), 800);
  }

  return (
    <>
      <h2 className="title-home w-100 text-center my-5">Recommended Books</h2>
      <div className="recommended-books">
        <div className="back-button">
          <i
            className="bi bi-arrow-left-circle"
            onClick={() => scrollRecommended(false)}
          ></i>
        </div>
        <div
          className="recommended-container d-flex flex-nowrap gap-3"
          ref={recommenddedBooksRef}
        >
          <div className="recommended-section d-flex flex-nowrap">
            {data.data.books.slice(0, 6).map((book) => (
              <BookCardMain {...book} key={book.isbn} />
            ))}
          </div>
          <div className="recommended-section d-flex flex-nowrap">
            {data.data.books.slice(6, 12).map((book) => (
              <BookCardMain {...book} key={book.isbn} />
            ))}
          </div>
          <div className="recommended-section d-flex flex-nowrap">
            {data.data.books.slice(12, 18).map((book) => (
              <BookCardMain {...book} key={book.isbn} />
            ))}
          </div>
        </div>
        <div className="next-button" onClick={() => scrollRecommended(true)}>
          <i className="bi bi-arrow-right-circle"></i>
        </div>
      </div>
    </>
  );
}

export default Test;
