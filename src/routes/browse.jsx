/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import {
  NavLink,
  useLoaderData,
  useLocation,
  useNavigate,
  useRevalidator,
} from "react-router-dom";
import { categories, bindings } from "../utils/searchFilters";
import { getToken } from "../utils/storageUtils";

import useCartActions from "../utils/cart-actions";
import { onClick as buttonEffect } from "../utils/buttonClickedCircle";
export async function loader() {
  const url = new URL(window.location.href);

  const fragment = url.hash.substring(1);

  const tempUrl = new URL("https://dummy.com" + fragment);

  const params = new URLSearchParams(tempUrl.search);
  const token = getToken();
  if (token) params.set("token", token);
  let data = null;
  try {
    data = await axios.get(
      import.meta.env.VITE_SERVER_URI + "/browse?" + params.toString()
    );
  } catch (e) {
    data = "error";
  }
  return data;
}

export function BookCard({ img, name, author, binding, price, _id }) {
  const navigate = useNavigate();
  const [isInCart, setIsInCart] = useState(false);
  const [isInWish, setIsInWish] = useState(false);

  const { inShoppingCart: shoppingCart, inWishList: wishList } =
    useLoaderData().data;

  const { addToCart, removeFromCart, addToWishlist, removeFromWishlist } =
    useCartActions();

  useEffect(() => {
    if (shoppingCart.includes(_id)) {
      setIsInCart(true);
    }
    if (wishList.includes(_id)) {
      setIsInWish(true);
    }
  }, [_id, shoppingCart, wishList]);

  return (
    <div className="card-book">
      <div className="img-container" style={{ height: 313 }}>
        <img
          src={img}
          alt={`${name}'s book cover`}
          loading="lazy"
          onClick={() => navigate(`/products/${_id}`)}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="card-book-details">
        <h2 className="mb-3">
          <strong>{name}</strong>
        </h2>
        <span>
          by <strong>{author}</strong>
        </span>
        <span style={{ opacity: 0.8 }}>{binding}</span>
        <span style={{ fontSize: "1.3rem", fontWeight: 800 }}>${price}</span>
        <div className="card-book-buttons mt-2 justify-content-start">
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

          <i
            className={`d-flex bi align-items-center justify-content-start ms-3 wishlistButton ${
              isInWish ? `wish-added bi-heart-fill` : "bi-heart"
            }`}
            onClick={
              isInWish
                ? async () => {
                    await removeFromWishlist(_id, img);
                    setIsInWish(false);
                  }
                : async () => {
                    await addToWishlist(_id, img);
                    setIsInWish(true);
                  }
            }
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
          ></i>
        </div>
      </div>
    </div>
  );
}

export function NotFoundSearch({ text }) {
  useEffect(() => {
    document.title = "No Results";
  }, []);

  return (
    <NavLink
      className="go-back mt-3 d-flex align-items-center justify-content-center gap-3"
      to="/browse"
    >
      <span>{text || "Go Back"}</span>
      <i className="bi bi-arrow-left-circle-fill"></i>
    </NavLink>
  );
}

function Browse() {
  const results = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const revalidator = useRevalidator();
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    if (!firstTime) {
      revalidator.revalidate();
      setFirstTime(true);
    }
  }, [firstTime, location, revalidator]);

  function getCurrentPage() {
    const url = new URL(window.location.href);
    const fragment = url.hash.substring(1);
    const tempUrl = new URL("https://dummy.com" + fragment);
    const params = new URLSearchParams(tempUrl.search);
    return params.get("page") || 1;
  }

  function optionRedirect(paramName, value, multiple = false) {
    let newUrl = new URL(window.location.href);
    const fragment = newUrl.hash.substring(1);
    newUrl = new URL("https://dummy.com" + fragment);
    if (multiple) {
      const url = new URL(window.location.href);
      const fragment = url.hash.substring(1);
      const tempUrl = new URL("https://dummy.com" + fragment);
      const param = new URLSearchParams(tempUrl.search);

      if (Array.isArray(param) && param.includes(value)) return;
      newUrl.searchParams.append(paramName, value);
    } else newUrl.searchParams.set(paramName, value);

    if (paramName !== "page") newUrl.searchParams.delete("page");
    navigate("/browse?" + newUrl.searchParams.toString());
  }
  if (results === "error") {
    return (
      <div className="middle-screen flex-column">
        {" "}
        <h1
          style={{ fontFamily: "Oswald", fontStyle: "italic" }}
          className="text-center"
        >
          There was an error with the server, please retry again in a few
          seconds...
        </h1>
        <NotFoundSearch text="Retry" />
      </div>
    );
  }
  if (!results || results.data.books.length === 0)
    return (
      <div className="middle-screen flex-column">
        {" "}
        <h1 style={{ fontFamily: "Oswald", fontStyle: "italic" }}>
          Oops, no results in your search...
        </h1>
        <NotFoundSearch />
      </div>
    );

  return (
    <div className="main my-5">
      <div className="search-results container-md d-flex flex-column ">
        {" "}
        <h2 className="mb-1 w-100 text-center" style={{ fontFamily: "Oswald" }}>
          Explore The Catalog
        </h2>
        <h5
          className="w-100 text-center"
          style={{ opacity: 0.8, fontFamily: "Oswald", fontStyle: "italic" }}
        >
          Page{" "}
          {Math.ceil(results.data.pagination.total / 24) > 0
            ? getCurrentPage()
            : 0}{" "}
          of {Math.ceil(results.data.pagination.total / 24)} {"  -  "}
          {results.data.pagination.total} results
        </h5>
        <div className="search-options w-100 d-flex justify-content-center gap-3 my-3">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Category
            </button>
            <ul
              className="dropdown-menu dropdown-menu-dark"
              style={{ maxHeight: 200, overflowY: "scroll" }}
            >
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className={`dropdown-item`}
                    onClick={() => optionRedirect("category", category, true)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Binding
            </button>
            <ul
              className="dropdown-menu dropdown-menu-dark"
              style={{ maxHeight: 200, overflowY: "scroll" }}
            >
              {bindings.map((binding) => (
                <li key={binding}>
                  <button
                    className={`dropdown-item`}
                    onClick={() => optionRedirect("binding", binding, true)}
                  >
                    {binding}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <QueryList />
        <RenderResults results={results} />
      </div>
    </div>
  );
}

function RenderResults({ results }) {
  useEffect(() => {
    document.title = "Browse For Books";
  }, []);
  const navigate = useNavigate();
  function getCurrentPage() {
    const url = new URL(window.location.href);
    const fragment = url.hash.substring(1);
    const tempUrl = new URL("https://dummy.com" + fragment);
    const params = new URLSearchParams(tempUrl.search);
    return params.get("page") || 1;
  }

  function optionRedirect(paramName, value, multiple = false) {
    let newUrl = new URL(window.location.href);
    if (multiple) {
      const param = newUrl.searchParams.getAll(paramName);
      if (Array.isArray(param) && param.includes(value)) return;
      newUrl.searchParams.append(paramName, value);
    } else newUrl.searchParams.set(paramName, value);

    if (paramName !== "page") newUrl.searchParams.delete("page");
    navigate("/browse?" + newUrl.searchParams.toString());
  }

  return (
    <>
      <div className="books-container align-self-center w-100 m-3">
        {results.data.books.map((book) => (
          <BookCard {...book} key={book._id} />
        ))}
      </div>

      {results.data.pagination.total > 0 && (
        <Pagination
          currentPage={getCurrentPage()}
          maxPages={Math.ceil(results.data.pagination.total / 24)}
          handler={optionRedirect}
        />
      )}
    </>
  );
}

function Pagination({ currentPage, maxPages, handler }) {
  currentPage = parseInt(currentPage);
  if (isNaN(currentPage)) return null;

  let pagination = [];
  if (maxPages === 6 || maxPages === 5)
    pagination = Array(maxPages)
      .fill(1)
      .map((e, i) => e + i);
  else if (currentPage >= 1 && currentPage <= 4) {
    pagination = [1];
    for (let i = 2; i <= maxPages && i <= 4; i++) pagination.push(i);
    if (pagination[pagination.length - 1] !== maxPages) {
      pagination[pagination.length - 1] === 4 && maxPages === 5
        ? pagination.push(5)
        : (pagination = [...pagination, 5, "...", maxPages]);
    }
  } else if (currentPage >= 5) {
    pagination = [1, "..."];
    if (maxPages - currentPage > 2) {
      pagination = [
        ...pagination,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        maxPages,
      ];
    } else {
      pagination = [
        ...pagination,
        ...Array(4)
          .fill(maxPages)
          .map((page, i) => page - i)
          .reverse(),
      ];
    }
  }

  return (
    <ul className="pagination my-5 justify-content-center gap-3">
      {pagination.map((pagValue, index) => {
        return (
          <li className={`page-item`} key={pagValue.toString() + index}>
            <button
              className={`page-link${
                pagValue === currentPage
                  ? " current disabled"
                  : pagValue === "..."
                  ? " disabled bg-dark text-white bg-transparent"
                  : ""
              }`}
              onClick={() => {
                if (pagValue !== "..." && pagValue)
                  handler("page", pagValue, false);
              }}
            >
              {pagValue}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function QueryList() {
  const navigate = useNavigate();

  const url = new URL(window.location.href);
  const fragment = url.hash.substring(1);
  const tempUrl = new URL("https://dummy.com" + fragment);
  const params = new URLSearchParams(tempUrl.search);

  const paramsObj = Array.from(
    params.keys().filter((key) => key !== "page")
  ).reduce((acc, val) => {
    const newAcc = acc;
    if (newAcc[val]) {
      newAcc[val] = params.getAll(val);
    } else newAcc[val] = params.get(val);

    return newAcc;
  }, {});

  let result = [];
  Object.entries(paramsObj).forEach((entrie) => {
    const key = entrie[0];
    const value = entrie[1];
    if (Array.isArray(value)) {
      value.forEach((e) => result.push({ key, value: e }));
    } else result.push({ key, value });
  });

  function removeFilter(index) {
    const target = result.slice();
    target.splice(index, 1);
    let newParam = new URLSearchParams("?");
    target.forEach((e) => {
      newParam.append(e.key, e.value);
    });

    navigate(`/browse?${newParam.toString()}`);
  }

  return (
    <div className="query-list d-flex gap-4" style={{ height: 42.13 }}>
      {result.map((param, index) => (
        <span
          className="query-tag d-flex align-items-center justify-content-center"
          key={param + index}
        >
          {`${param.key === "q" ? "Search: " : ""}${decodeURIComponent(
            param.value
          )}`}
          <i
            className="bi bi-x ms-auto"
            style={{ fontSize: "1.7rem" }}
            onClick={() => removeFilter(index)}
          ></i>
        </span>
      ))}
    </div>
  );
}

export default Browse;
