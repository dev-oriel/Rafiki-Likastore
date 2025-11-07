import { motion } from "framer-motion";
import { Lock, Mail, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/"); // Redirect to home on success
      }
    } catch (error) {
      // Error is already toasted by AuthContext
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border dark:border-zinc-800"
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-400 to-amber-500 text-transparent bg-clip-text">
            Welcome Back
          </h1>
          <form onSubmit={handleLogin}>
            <Input
              Icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              Icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end mb-6">
              <Link
                to="/forgot-password" // You can create this route later
                className="text-sm text-amber-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <motion.button
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white 
                font-bold rounded-lg shadow-lg hover:from-amber-600
                hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                focus:ring-offset-white dark:focus:ring-offset-zinc-900 transition duration-200 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>
        <div className="px-8 py-4 bg-zinc-50 dark:bg-zinc-950/50 flex justify-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Don't have an account?{" "}
            <Link
              to={"/register"}
              className="text-amber-500 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
