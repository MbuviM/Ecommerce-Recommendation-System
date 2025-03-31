import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";

import Input from "@/components/Input";
import Button from "@/components/Button";
import { emailRegister, registerDatabase } from "../../firebase/register";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("* Name is required.")
    .min(2, "* Name is too short"),
  surname: yup
    .string()
    .required("* Surname is required.")
    .min(2, "* Surname is too short"),
  email: yup.string().email().required("* Email is required."),
  password: yup
    .string()
    .required("* Password is required.")
    .min(8, "* Password is too short - should be 8 chars minimum."),
});

export default function RegisterForm() {
  const [registerError, setRegisterError] = useState();
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async ({ email, password, name, surname }) => {
    try {
      setIsRegistering(true);
      setRegisterError(null);
      
      console.log("Registration form submitted with email:", email);
      const response = await emailRegister({ email, password });
      
      console.log("Auth registration successful, creating user document");
      await registerDatabase({
        id: response.user.uid,
        email,
        name,
        surname,
      });
      
      setRegisterError("You have registered successfully. Redirecting to login...");
      
      // Use a timeout to show the success message before redirecting
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error.message);
      setRegisterError(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", paddingTop: 0 }}
    >
      <Input
        name="name"
        register={register}
        placeholder="Name"
        error={errors?.name}
        disabled={isRegistering}
      />
      {errors?.name && (
        <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
          {errors.name.message}
        </span>
      )}
      <Input
        name="surname"
        register={register}
        placeholder="Surname"
        error={errors?.surname}
        disabled={isRegistering}
      />
      {errors?.surname && (
        <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
          {errors.surname.message}
        </span>
      )}
      <Input
        name="email"
        register={register}
        placeholder="E-mail"
        error={errors?.email}
        disabled={isRegistering}
      />
      {errors?.email && (
        <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
          {errors.email.message}
        </span>
      )}
      <Input
        name="password"
        register={register}
        placeholder="Password"
        type="password"
        error={errors?.password}
        disabled={isRegistering}
      />
      {errors?.password && (
        <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
          {errors.password.message}
        </span>
      )}

      {registerError && (
        <span
          style={{
            color: registerError.includes("successfully") ? "green" : "red",
            marginTop: 20,
            fontSize: 14,
            marginBottom: 10,
            textAlign: "center"
          }}
        >
          {registerError}
        </span>
      )}

      <Button type="submit" disabled={isRegistering}>
        {isRegistering ? "Creating Account..." : "Register"}
      </Button>
      
      <div style={{ fontSize: 12, display: "flex", marginTop: 10 }}>
        By clicking Register, you agree to use our Terms and that you have read
        our Data Use Policy, including our Cookie Use
      </div>
    </form>
  );
}
