import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function loginRequest({ email, password }) {
  const res = await axios.get(`${BASE_URL}/users`, {
    params: { email },
  });

  const matchedUser = res.data.find(
    (u) => u.email === email && u.password === password,
  );

  if (!matchedUser) {
    throw new Error("Invalid email or password");
  }

  return matchedUser;
}

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (user) => {
      setUser(user);
      navigate("/dashboard");
    },
    onError: (err) => {
      toast(err.message || "Something went wrong, please try again");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      toast(firstError || "Please check your input");
      return;
    }

    mutate(formData);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="rounded-2xl bg-white shadow-2xl p-8 w-[400px]">
        <h1 className="text-center text-3xl font-bold text-blue-600">
          Shopify
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to your admin account
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Email Address</label>
            <input
              type="email"
              placeholder="admin@nexus.io"
              className="border border-gray-300 rounded-md p-2"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium">Password</label>
            <input
              type="password"
              placeholder="********"
              className="border border-gray-300 rounded-md p-2"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
