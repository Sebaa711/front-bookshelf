/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigation,
  Form,
  useNavigate,
} from "react-router-dom";
import { AuthContext } from "./contexts/auth.context";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import { CartContext } from "./contexts/cart.context";
import { onClick as buttonEffect } from "./utils/buttonClickedCircle";

let debouncedButton = false;

export default function Layout() {
  const { state } = useNavigation();

  return (
    <>
      <LayoutNavbar></LayoutNavbar>
      <PopUp />
      {state === "loading" ? <Loading /> : <Outlet />}
    </>
  );
}

function PopUp() {
  const { popUpRef, popUpInfo, setPopUpInfo } = useContext(CartContext);

  if (!popUpInfo) return null;
  return (
    <div id="pop-up" ref={popUpRef} onAnimationEnd={() => setPopUpInfo(null)}>
      <div className="pop-up wrapper position-relative w-100 h-100">
        <i className={popUpInfo.icon}></i>
        <div className="popup-img">
          <img src={popUpInfo.img} width={135} />
        </div>
        <p className="w-100 text-center fw-bold" style={{ fontSize: "1.1rem" }}>
          {popUpInfo.action}
        </p>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="d-flex align-items-center justify-content-center middle-screen">
      <div
        className="spinner-border"
        role="status"
        style={{
          color: "var(--primary-color)",
          width: "6rem",
          height: "6rem",
          fontSize: "3rem",
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

function LayoutNavbar() {
  const navBar = useRef(null);
  const navBarWrapper = useRef(null);
  const searchInput = useRef(null);
  const formMethods = useForm();
  const { state } = useNavigation();
  const navigate = useNavigate();
  const { currentToken } = useContext(AuthContext);
  const [info, setInfo] = useState(null);
  const { setwishListSize, setShoppingCartSize } = useContext(CartContext);

  useEffect(() => {
    /* const navBarContainerHeight = navBar.current.offsetHeight + 8;

    var prevScrollpos = window.scrollY;
    window.onscroll = function () {
      if (navBar.current.matches(":hover")) {
        return;
      }

      var currentScrollPos = window.scrollY;
      if (prevScrollpos > currentScrollPos) {
        navBar.current.style.top = "0";
      } else if (currentScrollPos > navBarContainerHeight) {
        if (searchInput.current.classList.contains("show")) {
          searchInput.current.classList.toggle("show");
        }
        navBar.current.style.top = `-${navBarContainerHeight}px`;
        const focusedInput = navBar.current.querySelector("input:focus");
        if (focusedInput) focusedInput.blur();
      }
      prevScrollpos = currentScrollPos;
    };

    navBarWrapper.current.onmouseenter = () => (navBar.current.style.top = "0"); */

    (async () => {
      const newInfo = await axios.post(
        import.meta.env.VITE_SERVER_URI + "/get-login-info",
        {
          token: currentToken,
        }
      );
      if (newInfo.status === 200) {
        setInfo(newInfo.data);
        setShoppingCartSize(newInfo.data.shoppingCartLength);
        setwishListSize(newInfo.data.wishListLength);
      }
    })();
  }, [currentToken, setShoppingCartSize, setwishListSize]);

  function searchHandler(data) {
    if (state === "loading" || debouncedButton) return;
    debouncedButton = true;
    navigate(
      `/browse${data.value ? `?q=${encodeURIComponent(data.value)}` : ""}`
    );
    searchInput.current.querySelector("input").blur();
    searchInput.current.classList.contains("show") &&
      searchInput.current.classList.remove("show");
    setTimeout(() => {
      debouncedButton = false;
    }, 1000);
  }

  return (
    <div
      className="navbar-wrapper fixed-top"
      style={{ height: "var(--nav-height)" }}
      ref={navBarWrapper}
    >
      <nav
        className="navbar flex-nowrap px-2"
        style={{
          backgroundColor: "var(--navbar-primary)",
          transition: "top 0.3s",
        }}
        ref={navBar}
      >
        <div className="gap-1 dp-flex justify-content-center justify-content-md-start">
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img src="/bookshelf.png" width={150} />
          </NavLink>
        </div>
        <div className="actions ms-auto me-3 d-flex gap-3 align-items-center">
          <FormProvider {...formMethods}>
            <Form onSubmit={formMethods.handleSubmit(searchHandler)}>
              <div
                className="input-group flex-nowrap search-control"
                ref={searchInput}
              >
                <input
                  type="text"
                  className="form-control bg-dark text-white"
                  aria-label="Search"
                  aria-describedby="addon-wrapping"
                  {...formMethods.register("value")}
                  placeholder="Search by Title or Author..."
                />
                <button
                  className="input-group-text search-icon"
                  id="addon-wrapping"
                  type="submit"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </Form>
          </FormProvider>
        </div>

        <div className="d-flex gap-2 align-items-center">
          {currentToken === null ? (
            <>
              <NavButtonNoRedirect
                wrapperClassName="search-responsive"
                className="bi bi-search search-button"
                onClick={() => searchInput.current.classList.toggle("show")}
              />
              <AuthButtons />
            </>
          ) : (
            info !== null && (
              <>
                <NavButtonNoRedirect
                  wrapperClassName="search-responsive"
                  className="bi bi-search search-button"
                  onClick={() => searchInput.current.classList.toggle("show")}
                />
                <LoggedButtons info={info} />
              </>
            )
          )}
        </div>
      </nav>
      {/* <DiscountBanner /> */}
    </div>
  );
}

function NavButtonBadge({ value }) {
  return (
    <span
      className="position-absolute start-100 translate-middle badge rounded-pill size-count"
      style={{
        fontSize: "0.7rem",
        backgroundColor: "var(--primary-color)",
        top: 2,
      }}
    >
      {value > 0 && value < 99 ? value : "99+"}
    </span>
  );
}

function NavButton({
  onClick,
  className,
  wrapperClassName,
  size = "1.6rem",
  to,
  children,
  id,
}) {
  return (
    <div className="wrapperNavLink position-relative" id={id}>
      <NavLink
        to={to}
        className={`nav-button-wrapper ${wrapperClassName}`}
        onClick={onClick}
        style={{ fontSize: size, cursor: "pointer" }}
      >
        <div
          className="buttonWrapper buttonWrapper-nav position-absolute"
          style={{ inset: 0, zIndex: 1000 }}
          onClick={buttonEffect}
        />
        <i className={`nav-button ${className}`}>{children}</i>
      </NavLink>
    </div>
  );
}

function NavButtonNoRedirect({
  onClick,
  className,
  wrapperClassName,
  size = "1.6rem",
  id,
  children,
}) {
  return (
    <div
      className="buttonWrapper position-relative"
      onClick={buttonEffect}
      id={id}
    >
      <div
        className={`nav-button-wrapper ${wrapperClassName}`}
        onClick={onClick}
        style={{ fontSize: size, cursor: "pointer" }}
      >
        {" "}
        <i className={`nav-button ${className}`}>{children}</i>
      </div>
    </div>
  );
}

function AuthButtons() {
  const navigate = useNavigate();
  return (
    <div className="d-flex align-items-center justify-content-center">
      <NavButton className="bi bi-person-fill" size="1.77rem" to={"/log-in"} />
    </div>
  );
}

function LoggedButtons({ info }) {
  const { cerrarSesion, currentToken } = useContext(AuthContext);
  const { shoppingCartSize, wishListSize } = useContext(CartContext);

  const profilePic = useRef(null);
  const profileDropdown = useRef(null);

  useEffect(() => {
    if (!profileDropdown.current) return;
    document.addEventListener("click", (event) => {
      const isClickInsideDropdown = profileDropdown.current.contains(
        event.target
      );
      const isProfileClicked = profilePic.current.contains(event.target);

      if (!isClickInsideDropdown && !isProfileClicked) {
        profileDropdown.current.classList.add("hide");
        profileDropdown.current.classList.add("dropdown__wrapper--fade-in");
      }
    });
  }, [currentToken]);

  return (
    <>
      <NavButton
        className="bi bi-heart position-relative mt-1"
        id="wishList-button"
        to="/wishlist"
      >
        {wishListSize > 0 && <NavButtonBadge value={wishListSize} />}
      </NavButton>
      <NavButton
        className="bi bi-cart4 position-relative cart-icon cart-button"
        id="cart-button"
        to="/cart"
      >
        {shoppingCartSize > 0 && <NavButtonBadge value={shoppingCartSize} />}
      </NavButton>
      <img
        className="profile"
        src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
        alt="Tu"
        ref={profilePic}
        onClick={() => {
          profileDropdown.current.classList.remove("none");
          profileDropdown.current.classList.toggle("hide");
        }}
      />
      <div
        className="dropdown__wrapper hide dropdown__wrapper--fade-in none"
        ref={profileDropdown}
      >
        <nav>
          <ul>
            <li style={{ color: "#E3452F" }} onClick={cerrarSesion}>
              <i className="bi bi-box-arrow-right"></i>
              Logout
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

function DiscountBanner() {
  const banner = useRef(null);
  return (
    <div className="discount-banner" ref={banner}>
      <span className="message">
        USE COUPON &ldquo;75THON&ldquo; FOR A 75% OFF DISCOUNT
      </span>
      <i
        className="bi bi-x-lg"
        onClick={() => {
          document.documentElement.style.setProperty(
            "--nav-banner-height",
            "0px"
          );
          banner.current.remove();
        }}
      ></i>
    </div>
  );
}
