/* eslint-disable react/prop-types */
import { Form } from "react-router-dom";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { AuthContext } from "../contexts/auth.context";
import { useNavigate, Navigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Registro() {
  const navigate = useNavigate();
  const { currentToken, iniciarSesion } = useContext(AuthContext);
  const methods = useForm();
  const formRef = useRef();

  const onSubmit = async (data) => {
    try {
      const result = await axios.post(
        import.meta.env.VITE_SERVER_URI + "/sign-up",
        data,
        {
          timeout: 5000,
        }
      );

      console.log(result);

      if (result.data.code === 200) {
        Swal.fire({
          title: "Registrado con exito",
          text: "Sera redireccionado en 5 segundos",
          icon: "success",
          showConfirmButton: false,
        });
        setTimeout(() => {
          Swal.close();
          iniciarSesion(result.data.user);
          navigate("/");
        }, 3000);
        return;
      }
      if (result.data.code === 409) {
        Swal.fire({
          title: result.data.error,
          text: "Ingrese los campos de nuevo por favor",
          icon: "error",
        });
      }
    } catch (e) {
      Swal.fire({
        title: "Error al registrarse",
        text: "Error en el servidor interno",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    formRef.current.querySelector("input").focus();
    methods.register("captcha", {});

    return () => methods.unregister("captcha");
  }, [methods]);

  if (currentToken !== null) return <Navigate to="/" />;

  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="d-flex flex-column gap-2 bg-white text-dark p-3 p-md-5 text-light rounded"
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        }}
        ref={formRef}
      >
        <h2 className="mb-3 fw-bold">Registro</h2>

        <InputForm
          name="username"
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
          constraints={{
            required: "This field is required",
            validate: {
              isEqual: (value) =>
                value === methods.getValues().password ||
                "Passwords don't match",
            },
          }}
        />

        <div className="input-wrapper"></div>
        <button type="submit" className="btn btn-primary align-self-end">
          Registrarse
        </button>
      </Form>
    </FormProvider>
  );
}

function InputForm({ name, displayName, type = "text", constraints = {} }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="input-wrapper">
      <div className="label-wrapper d-flex align-items-center">
        <label htmlFor={name} className="form-label fw-bold">
          {displayName ||
            name[0].toUpperCase() + name.slice(1).toLowerCase() + ":"}
          {constraints.required ? "*" : ""}
        </label>
        {errors[name] && (
          <span className="badge text-danger ms-auto p-0 m-0">
            {errors[name].message}
          </span>
        )}
      </div>
      <input
        type={type}
        className="form-control border-dark"
        id={name}
        {...register(name, constraints)}
      />
    </div>
  );
}
