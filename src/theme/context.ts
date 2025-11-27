import { createContext, Context } from 'react';

interface ThemeContextType {
    toggleTheme: () => void;
    isThemeDark: boolean;
}

export const ThemeContext: Context<ThemeContextType> = createContext<ThemeContextType>({
    toggleTheme: () => { },
    isThemeDark: false,
})