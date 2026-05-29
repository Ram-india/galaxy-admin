import React, { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/api";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // HANDLE INPUT CHANGE

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // HANDLE SUBMIT

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);
        console.log(formData);
        await API.post(
          "/auth/register",
          formData
        );

        alert(
          "Registration successful"
        );

        navigate("/login");

      } catch (error) {

        setError(
          error.response?.data
            ?.message ||
            "Registration Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-100
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-xl
          p-8
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-center
            mb-6
          "
        >
          Register
        </h1>

        {error && (

          <div
            className="
              bg-red-100
              text-red-500
              p-3
              rounded-lg
              mb-4
            "
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="
              w-full
              border
              rounded-xl
              p-3
            "
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="
              w-full
              border
              rounded-xl
              p-3
            "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="
              w-full
              border
              rounded-xl
              p-3
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-blue-600
              text-white
              py-3
              rounded-xl
              hover:bg-blue-700
              transition
            "
          >
            {
              loading
                ? "Registering..."
                : "Register"
            }
          </button>

        </form>

        <p className="mt-4 text-center">

          Already have account?

          <Link
            to="/login"
            className="
              text-blue-600
              ml-2
            "
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Register;