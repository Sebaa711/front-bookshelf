/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useEffect } from "react";

function Test() {
  useEffect(() => {
    document.title = "Bookshelf";
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
          <span className style={{ fontSize: "1.4rem", fontStyle: "italic" }}>
            Using coupon &quot;5050&quot;
          </span>
        </div>

        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F12cbceb6be9648e2a8a23b8c10684f0b%2F0c04c1c9c7744c2398fe7158225aae53?format=webp&width=2000"
          className="col-12 col-md-4 img-set-2"
        />
      </div>
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
