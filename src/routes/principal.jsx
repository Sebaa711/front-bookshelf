/* eslint-disable react/prop-types */
import { useEffect } from "react";

export default function Principal() {
  useEffect(() => {
    document.title = "Bookshelf";
  }, []);

  return (
    <div className="main my-5">
      <h1 className="title-home w-100 text-center mb-5">
        Today&apos;s Featured
      </h1>
      <BookShowcase></BookShowcase>
      <h1 className="title-home w-100 text-center my-5">What is Bookshelf?</h1>
      <div className="container-md">
        <p className="fs-4">
          Bookshelf is e-library that I created to test my Full Stack skills.
        </p>
        <p className="fs-4">
          <strong>
            Bookshelf is planned to have the following features ({" "}
            <i
              className="bi bi-check-square"
              style={{ color: "var(--primary-color)" }}
            ></i>
            {"  "}
            <em>Means it&apos;s already implemented </em> ):
          </strong>
        </p>
        <br />
        <ul className="features-list">
          <FeatureItemTitle
            icon="bi bi-shield-lock-fill"
            name="Authentication"
            isCompleted={true}
          />

          <FeatureItemTitle
            icon="bi bi-search"
            name="Searching & Sorting"
            isCompleted={true}
          />
          <FeatureItemTitle
            icon="bi bi-heart-fill"
            name="Wishlist"
            isCompleted={false}
          />
          <FeatureItemTitle
            icon="bi bi-cart-fill"
            name="Shopping Cart"
            isCompleted={false}
          />
          <FeatureItemTitle
            icon="bi bi-ticket-fill"
            name="Coupons"
            isCompleted={false}
          />
        </ul>
      </div>
    </div>
  );
}

const testBook = {
  name: "Twisted Secrets (The O'Malleys Series, Bk. 3)",
  img: "https://bookoutlet.com/_next/image?url=https%3A%2F%2Fimages.bookoutlet.com%2Fcovers%2Flarge%2Fisbn978153%2F9781538756751-l.jpg&w=3840&q=75",
  price: "16.99",
  author: "Katee Robert",
  about:
    '<div><b>With her signature spicy romance, the <i>New York Times </i>bestselling author of<span style="font-style: italic;"> Neon Gods</span> delivers a gripping story of two fated souls caught up on opposite sides of a family power struggle.</b><br><br> Greed. Ambition. Violence. Those are the lessons Olivia Rashidi learned from her mafia family—and she’s determined her young daughter won’t grow up the same way. When she meets Cillian O’Malley, she recognizes he could very easily drag her into the life she’s determined to leave behind. . . yet she still can\'t stop herself from falling for the smoldering, tortured man.<br><br> Plagued by a violent past, Cillian is more vulnerable than anyone realizes. But Olivia sees through him in a way no one else can, and their sizzling chemistry awakens something he thought he’d never experience again. While his proposal of no-strings sex seems simple, what he feels for her isn’t. Cillian knows there is no escape from this life, but for Olivia, he’ll do everything in his power to try, even if it costs his life. </div>',
  info: {
    isbn: "9781538756751",
    published_date: "September 19, 2023",
    publisher: "Forever",
    language: "English",
    page_count: "326",
    size: '7.99" l x 5.23" w x 1.00" h',
  },
  category: "Fiction",
  subjects: ["Romance", "Contemporary"],
};

function FeatureItemTitle({ icon, name, isCompleted }) {
  return (
    <li className="feature-item">
      <i className={icon}></i>
      <span className="feature-name d-flex gap-3">
        <span>{name}</span>
        {isCompleted ? (
          <i className="bi bi-check-square"></i>
        ) : (
          <i className="bi bi-square"></i>
        )}
      </span>
    </li>
  );
}

function BookShowcase() {
  return (
    <div className="container w-100 w-md-60">
      <article className="card">
        <div className="background">
          <img src={testBook.img} className="w-100" alt="..." />
        </div>
        <div className="content">
          <div className="card-content">
            <h2>{testBook.name}</h2>
            <p dangerouslySetInnerHTML={{ __html: testBook.about }} />
          </div>
          <div className="blog-preview__bottom">
            <div
              className="price fs-2 w-100 text-end"
              style={{ color: "var(--primary-color)" }}
            >
              ${testBook.price}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
