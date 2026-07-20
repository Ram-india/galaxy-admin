import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const darkMode = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="
                p-2.5
                rounded-xl
                text-slate-600
                dark:text-slate-300
                hover:bg-slate-100
                dark:hover:bg-slate-800
                transition-colors
            "
        >
            {darkMode ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
};

export default ThemeToggle;
