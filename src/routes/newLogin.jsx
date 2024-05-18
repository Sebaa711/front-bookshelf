/* eslint-disable react/prop-types */
import "./newLogin.css";
import { Form, NavLink } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { AuthContext } from "../contexts/auth.context";
import { Navigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

function NewLogin() {
  const { currentToken, iniciarSesion } = useContext(AuthContext);
  const methods = useForm();
  const formRef = useRef();
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Login";
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const result = await axios.post(
        import.meta.env.VITE_SERVER_URI + "/log-in",
        data,
        {
          timeout: 5000,
        }
      );

      if (result.data.code === 200) {
        iniciarSesion(result.data.token);
      } else {
        setError(result.data.error);
      }
    } catch (e) {
      console.log(e);
      setError("Error connecting with the server");
    }
  };

  if (currentToken !== null) return <Navigate to="/" />;

  return (
    <div className="form-wrapper">
      <div className="form-side">
        <img src="/bookshelf.png" className="logo" alt="Ofin" />
        <FormProvider {...methods}>
          <Form
            onSubmit={methods.handleSubmit(onSubmit)}
            ref={formRef}
            className="my-form"
          >
            <div className="form-welcome-row">
              <h1>Welcome Back! 👋</h1>
            </div>

            <div className="text-field">
              <label htmlFor="email">
                Email:
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="off"
                  placeholder="Your Email"
                  {...methods.register("email")}
                />
              </label>
            </div>
            <div className="text-field">
              <label htmlFor="password">
                Password:
                <div className="group-input"></div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your Password"
                  title="Minimum 6 characters at 
                                    least 1 Alphabet and 1 Number"
                  {...methods.register("password")}
                />
              </label>
            </div>
            {error && <p className="text-danger p-0 m-0">{error}</p>}
            <button type="submit" className="my-form__button log-in-button">
              Login
            </button>
            <button
              type="button"
              className="my-form__button"
              onClick={() =>
                onSubmit({ email: "Guest@guest.com", password: "aBC12345%" })
              }
            >
              Continue as a Guest
            </button>
            <div className="my-form__actions">
              <a href="#" title="Reset Password">
                Reset Password
              </a>
              <NavLink to="/sign-up" title="Create Account">
                Don&apos;t have an account?
              </NavLink>
            </div>
          </Form>
        </FormProvider>
      </div>
      <div className="info-side">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F12cbceb6be9648e2a8a23b8c10684f0b%2F3d58dcb7e64c4152bf11151669b5224f?format=webp&width=2000"
          alt="Mock"
          className="mockup"
        />
      </div>
    </div>
  );
}

export default NewLogin;
