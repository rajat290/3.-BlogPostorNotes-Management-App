import { createContext, useState, useEffect, useContext } from 'react';
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [ dark, setDark ] = useState(
        localStorage.getItem("theme") === "dark" ? true : false     
    );

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <ThemeContext.Provider value={{ dark, setDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
