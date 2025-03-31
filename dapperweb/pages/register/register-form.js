import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useAuth } from "@/firebase/context";

import styles from "./register.module.scss";
import Layout from "@/components/Layout";
import Input from "@/components/Input";
import Button from "@/components/Button";

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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function RegisterForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email, password, name, surname }) => {
    try {
      await signup(email, password, name, surname);
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Layout noCategories>
      <div className={styles.container}>
        <h1 className={styles.title}>Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputContainer}>
            <Input
              name="name"
              register={register}
              placeholder="Name"
              error={errors?.name}
            />
          </div>
          {errors?.name && (
            <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
              {errors.name.message}
            </span>
          )}
          <div className={styles.inputContainer}>
            <Input
              name="surname"
              register={register}
              placeholder="Surname"
              error={errors?.surname}
            />
          </div>
          {errors?.surname && (
            <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
              {errors.surname.message}
            </span>
          )}
          <div className={styles.inputContainer}>
            <Input
              name="email"
              register={register}
              placeholder="Email"
              error={errors?.email}
            />
          </div>
          {errors?.email && (
            <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
              {errors.email.message}
            </span>
          )}
          <div className={styles.inputContainer}>
            <Input
              name="password"
              type="password"
              register={register}
              placeholder="Password"
              error={errors?.password}
            />
          </div>
          {errors?.password && (
            <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
              {errors.password.message}
            </span>
          )}
          <div className={styles.inputContainer}>
            <Input
              name="confirmPassword"
              type="password"
              register={register}
              placeholder="Confirm Password"
              error={errors?.confirmPassword}
            />
          </div>
          {errors?.confirmPassword && (
            <span style={{ color: "red", marginTop: 4, fontSize: 14 }}>
              {errors.confirmPassword.message}
            </span>
          )}
          <Button type="submit">Register</Button>
        </form>
      </div>
    </Layout>
  );
} 