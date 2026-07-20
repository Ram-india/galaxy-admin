import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const html = document.documentElement;
        if (theme === "dark") {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
