import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("tourflow-theme");
    return (stored as Theme) || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "0 0% 0%");
      root.style.setProperty("--card", "0 0% 98%");
      root.style.setProperty("--card-foreground", "0 0% 0%");
      root.style.setProperty("--popover", "0 0% 98%");
      root.style.setProperty("--popover-foreground", "0 0% 0%");
      root.style.setProperty("--primary", "0 0% 0%");
      root.style.setProperty("--primary-foreground", "0 0% 100%");
      root.style.setProperty("--secondary", "0 0% 95%");
      root.style.setProperty("--secondary-foreground", "0 0% 0%");
      root.style.setProperty("--muted", "0 0% 95%");
      root.style.setProperty("--muted-foreground", "0 0% 40%");
      root.style.setProperty("--accent", "0 0% 90%");
      root.style.setProperty("--accent-foreground", "0 0% 0%");
      root.style.setProperty("--border", "0 0% 90%");
      root.style.setProperty("--input", "0 0% 95%");
      root.style.setProperty("--ring", "0 0% 0%");
    } else {
      root.style.setProperty("--background", "0 0% 0%");
      root.style.setProperty("--foreground", "0 0% 100%");
      root.style.setProperty("--card", "0 0% 4%");
      root.style.setProperty("--card-foreground", "0 0% 100%");
      root.style.setProperty("--popover", "0 0% 4%");
      root.style.setProperty("--popover-foreground", "0 0% 100%");
      root.style.setProperty("--primary", "0 0% 100%");
      root.style.setProperty("--primary-foreground", "0 0% 0%");
      root.style.setProperty("--secondary", "0 0% 10%");
      root.style.setProperty("--secondary-foreground", "0 0% 100%");
      root.style.setProperty("--muted", "0 0% 10%");
      root.style.setProperty("--muted-foreground", "0 0% 60%");
      root.style.setProperty("--accent", "0 0% 15%");
      root.style.setProperty("--accent-foreground", "0 0% 100%");
      root.style.setProperty("--border", "0 0% 15%");
      root.style.setProperty("--input", "0 0% 10%");
      root.style.setProperty("--ring", "0 0% 100%");
    }
    localStorage.setItem("tourflow-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
