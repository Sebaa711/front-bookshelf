/* eslint-disable react/prop-types */
import "./newLogin.css";
import { Form, NavLink, useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { AuthContext } from "../contexts/auth.context";
import { Navigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

function NewRegister() {
  const { currentToken, iniciarSesion } = useContext(AuthContext);
  const methods = useForm();
  const formRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Sign Up";
    window.scrollTo(0, 0);
    formRef.current.querySelector("input").focus();
  }, []);

  const onSubmit = async (data) => {
    try {
      const result = await axios.post(
        import.meta.env.VITE_SERVER_URI + "/sign-up",
        data,
        {
          timeout: 5000,
        }
      );
      console.log(data);

      if (result.data.code === 200) {
        iniciarSesion(result.data.token);
        navigate("/");
        return;
      }
      if (result.data.code === 409) {
        setError(result.data.error);
      }
    } catch (e) {
      setError("Error connecting with the server");
    }
  };

  if (currentToken !== null) return <Navigate to="/" />;

  return (
    <div className="form-wrapper">
      <div className="info-side">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F12cbceb6be9648e2a8a23b8c10684f0b%2F0c04c1c9c7744c2398fe7158225aae53?format=webp&width=2000"
          alt="Mock"
          className="mockup"
        />
      </div>
      <div className="form-side position-relative">
        <div className="position-absolute top-0 me-3">
          <img src="/bookshelf.png" className="logo" alt="Ofin" />
        </div>
        <FormProvider {...methods}>
          <Form
            onSubmit={methods.handleSubmit(onSubmit)}
            ref={formRef}
            className="my-form"
          >
            <div className="form-welcome-row">
              <h1>Welcome! 👋</h1>
            </div>

            <InputForm
              name="username"
              placeholder={"Your Username"}
              displayName={"Username"}
              constraints={{
                minLength: {
                  value: 3,
                  message: "Username must be longer than 3 chars",
                },
                required: "This field is required",
              }}
            />

            <InputForm
              name="email"
              placeholder={"Your Email"}
              displayName={"Email"}
              constraints={{
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Not a valid email.",
                },
                required: "This field is required",
              }}
            />

            <InputForm
              name="password"
              type="password"
              placeholder={"Your Password"}
              displayName={"Password"}
              constraints={{
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 chars",
                },
                validate: {
                  contieneMayuscula: (value) =>
                    /[A-Z]/.test(value) || "Minimum 1 uppercase.",
                  contieneMinuscula: (value) =>
                    /[a-z]/.test(value) || "Minimum 1 lowercase.",
                  contieneCaracterEspecial: (value) =>
                    /[^A-Za-z0-9]/.test(value) || "Minimum 1 special character",
                  contieneNumero: (value) =>
                    /[0-9]/.test(value) || "Minimum 1 number",
                },
              }}
            />

            <InputForm
              name="validatePassword"
              displayName="Confirm Password"
              type="password"
              placeholder={"Confirm Password"}
              constraints={{
                required: "This field is required",
                validate: {
                  isEqual: (value) =>
                    value === methods.getValues().password ||
                    "Passwords don't match",
                },
              }}
            />
            {error && <p className="text-danger p-0 m-0">{error}</p>}
            <button type="submit" className="my-form__button">
              Register
            </button>
            <div className="my-form__actions">
              <NavLink to="/log-in" title="Create Account">
                Already have an account?
              </NavLink>
            </div>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
}

function InputForm({
  name,
  displayName,
  type = "text",
  constraints = {},
  placeholder,
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="text-field">
      <label htmlFor="email">
        {displayName}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          {...register(name, constraints)}
        />
      </label>
      {errors[name] && (
        <span className="badge text-danger ms-auto p-0 m-0">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}

export default NewRegister;
