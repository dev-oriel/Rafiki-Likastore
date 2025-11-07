import { motion } from "framer-motion";
import { Loader, Lock, Mail, User, Phone, CalendarDays } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

// Helper function to check age
const isOldEnough = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!dob) {
      toast.error("Please enter your date of birth.");
      return;
    }
    if (!isOldEnough(dob)) {
      toast.error("You must be at least 18 years old to register.");
      return;
    }

    const formattedPhone = phone.startsWith("0")
      ? `254${phone.substring(1)}`
      : phone;

    setLoading(true);
    try {
      // 1. Just call register.
      // The GuestRoute will automatically handle the redirect.
      await register(name, email, password, formattedPhone, dob);

      // 2. REMOVED navigation logic from here.
    } catch (error) {
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
            Create Account
          </h1>
          <form onSubmit={handleSignUp}>
            <Input
              Icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              Icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              Icon={Phone}
              type="tel"
              placeholder="Phone (07...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              Icon={CalendarDays}
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <Input
              Icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordStrengthMeter password={password} />

            <motion.button
              className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white 
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
                "Create Account"
              )}
            </motion.button>
          </form>
        </div>
        <div className="px-8 py-4 bg-zinc-50 dark:bg-zinc-950/50 flex justify-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-amber-500 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
