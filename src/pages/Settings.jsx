import { Globe, Sun, Moon, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import { useThemeStore } from "@/store/themeStore";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/langStore";

export default function Settings() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <div>
      <Header title={t("sidebar.settings")} />
      <div className="p-4 flex flex-col gap-4 max-w-2xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.language")}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={language === "en" ? "default" : "outline"}
              onClick={() => setLanguage("en")}
              className={
                language === "en"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500"
                  : ""
              }
            >
              English
            </Button>
            <Button
              variant={language === "ar" ? "default" : "outline"}
              onClick={() => setLanguage("ar")}
              className={
                language === "ar"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500"
                  : ""
              }
            >
              العربية
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.appearance")}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className={
                theme === "light"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  : ""
              }
            >
              <Sun className="size-4 mr-1" /> {t("settings.light")}
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className={
                theme === "dark"
                  ? "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  : ""
              }
            >
              <Moon className="size-4 mr-1" /> {t("settings.dark")}
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.accountInfo")}
            </h3>
          </div>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">{t("settings.name")}</Label>
              <Input id="name" defaultValue="Alex Morgan" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{t("settings.email")}</Label>
              <Input
                id="email"
                type="email"
                defaultValue="alex.morgan@nexus.io"
              />
            </div>
            <Button
              type="submit"
              className="w-fit bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {t("settings.saveChanges")}
            </Button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.changePassword")}
            </h3>
          </div>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password">{t("settings.currentPassword")}</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">{t("settings.newPassword")}</Label>
              <Input id="new-password" type="password" />
            </div>
            <Button
              type="submit"
              className="w-fit bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {t("settings.changePassword")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
