/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import { onClick as buttonEffect } from "../utils/buttonClickedCircle";
import useCartActions from "../utils/cart-actions";
import axios from "axios";
import { auto, right } from "@popperjs/core";

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
        />
      </div>
      <RecommendedBooks />
      <h1 className="title-home w-100 text-center my-5">What is Bookshelf?</h1>
      <div className="container-md my-5">
        <p className="fs-4">
          Bookshelf is a clone of{" "}
          <a
            href="https://bookoutlet.com/"
            target="_blank"
            style={{ textDecoration: "none", color: "var(--primary-color)" }}
          >
            BookOutlet
          </a>
          !
        </p>
        <p className="fs-4">
          <strong>Bookshelf is planned to have the following features:</strong>
        </p>

        <br />
        <ul className="features-list">
          <FeatureItemTitle
            icon="bi bi-shield-lock-fill"
            name="Authentication"
            status="completed"
          />

          <FeatureItemTitle
            icon="bi bi-search"
            name="Searching & Sorting"
            status="completed"
          />
          <FeatureItemTitle
            icon="bi bi-heart-fill"
            name="Wishlist"
            status="wip"
          />
          <FeatureItemTitle
            icon="bi bi-cart-fill"
            name="Shopping Cart"
            status="wip"
          />
          <FeatureItemTitle icon="bi bi-ticket-fill" name="Coupons" />
        </ul>
      </div>
    </div>
  );
}

function BookCardMain({ img, price, _id }) {
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
        style={{ height: 300, width: auto, overflow: "hidden" }}
      >
        <img
          src={img}
          alt="Book Cover"
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

  function scrollLeft() {
    const scrollableDiv = recommenddedBooksRef.current;
    const newScrollLeft = Math.max(scrollableDiv.scrollLeft - 907, 0);

    scrollableDiv.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    const scrollableDiv = recommenddedBooksRef.current;
    const maxScrollLeft = scrollableDiv.scrollWidth - scrollableDiv.clientWidth;
    const newScrollLeft = Math.min(
      scrollableDiv.scrollLeft + 907,
      maxScrollLeft
    );

    scrollableDiv.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  }

  return (
    <>
      <h2 className="title-home w-100 text-center my-5">Recommended Books</h2>
      <div className="recommended-books container-fluid">
        <div className="back-button">
          <i className="bi bi-arrow-left-circle" onClick={scrollLeft}></i>
        </div>
        <div
          className="recommended-container d-flex flex-nowrap mx-4 gap-3"
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
        <div className="next-button" onClick={scrollRight}>
          <i className="bi bi-arrow-right-circle"></i>
        </div>
      </div>
    </>
  );
}

function FeatureItemTitle({ icon, name, status }) {
  return (
    <li className="feature-item">
      <i className={icon}></i>
      <span className="feature-name d-flex gap-3">
        <span>{name}</span>
        {status === "completed" ? (
          <i className="bi bi-check-square"></i>
        ) : status === "wip" ? (
          <i className="bi bi-cone-striped" style={{ color: "orange" }}></i>
        ) : (
          <i className="bi bi-square"></i>
        )}
      </span>
    </li>
  );
}

export default Test;
