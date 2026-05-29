import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const success = await login(
            email,
            password
        );
        if (success) {
            navigate("/dashboard");
        } else {
            setError(
                "Invalid email or password"
            );
        }
        setLoading(false);
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
            mb-2
          "
                >
                    GPS Admin
                </h1>
                <p
                    className="
            text-center
            text-slate-500
            mb-8
          "
                >
                    Solar Project Management
                </p>
                {error && (
                    <div
                        className="
              bg-red-100
              text-red-600
              p-3
              rounded-lg
              mb-4
              text-sm
            "
                    >
                        {error}
                    </div>
                )}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* EMAIL */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Email
                        </label>
                        <div className="relative">
                            <Mail
                                className="
                  absolute
                  left-3
                  top-3
                  text-slate-400
                "
                                size={18}
                            />
                            <input
                                type="email"
                                placeholder="admin@gmail.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  border
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                            />
                        </div>
                    </div>
                    {/* PASSWORD */}
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                className="
                  absolute
                  left-3
                  top-3
                  text-slate-400
                "
                                size={18}
                            />
                            <input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  border
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                            />
                        </div>
                    </div>
                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-xl
              font-medium
              transition
            "
                    >
                        {
                            loading
                                ? "Signing In..."
                                : "Sign In"
                        }
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Don't have account?
                    <Link
                        to="/register"
                        className="text-blue-600 ml-2"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;