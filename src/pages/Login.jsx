import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";
import { useTranslation } from "react-i18next";
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

  if (matchedUser.role !== "Admin") {
    throw new Error("Access denied. Admins only.");
  }

  return matchedUser;
}

export default function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const loginSchema = z.object({
    email: z.string().email(t("login.invalidEmail")),
    password: z.string().min(8, t("login.passwordMinLength")),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginRequest,
    onSuccess: (user) => {
      setUser(user);
      navigate("/dashboard");
    },
    onError: (err) => {
      toast(err.message || t("login.genericError"));
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    const validationResult = loginSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message;
      toast(firstError || t("login.checkInput"));
      return;
    }

    mutate(formData);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-8 w-[400px]">
        <h1 className="text-center text-3xl font-bold text-blue-600 dark:text-blue-400">
          {t("login.brand")}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {t("login.subtitle")}
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-900 dark:text-gray-100">
              {t("login.email")}
            </label>
            <input
              type="email"
              placeholder="admin@nexus.io"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md p-2"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-900 dark:text-gray-100">
              {t("login.password")}
            </label>
            <input
              type="password"
              placeholder="********"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md p-2"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 dark:bg-blue-600 text-white rounded-md p-2 hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? t("login.signingIn") : t("login.signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
