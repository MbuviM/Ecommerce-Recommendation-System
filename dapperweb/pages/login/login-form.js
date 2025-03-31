import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import emailLogin from "../../firebase/login";

const schema = yup.object().shape({
  email: yup.string().email().required("* Email is required."),
  password: yup
    .string()
    .required("* Password is required.")
    .min(8, "* Password is too short - should be 8 chars minimum."),
});

export default function LoginForm() {
  const [loginError, setLoginError] = useState();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      
      console.log("Login form submitted with email:", data.email);
      await emailLogin({ email: data.email, password: data.password });
      
      // If login is successful, redirect to home page
      console.log("Login successful, redirecting to home");
      
      // Add a small delay before redirecting to ensure the user sees the success state
      setTimeout(() => {
        router.push("/");
      }, 1000); // 1 second delay
    } catch (error) {
      console.error("Login form error:", error.message);
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Input
        name="email"
        register={register}
        placeholder="E-mail"
        error={errors?.email}
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
      />
      {errors?.password && (
        <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
          {errors.password.message}
        </span>
      )}

      <Button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging In..." : "Login"}
      </Button>
      
      {loginError && (
        <span
          style={{
            color: "red",
            marginTop: 10,
            fontSize: 14,
            marginBottom: 10,
            textAlign: "center"
          }}
        >
          {loginError}
        </span>
      )}
      
      <span style={{ fontWeight: "bold", marginBottom: 60 }}>
        <Link href="/forgot-password">Forgot Password?</Link>
      </span>
    </form>
  );
}
