
import { useState, useMemo, useCallback } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer, useTheme, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./store";
import { CombinedDefaultTheme, CombinedDarkTheme } from "./theme/theme";
import { View, Text } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeContext } from "./theme/context";

const App = () => {
    const [isThemeDark, setIsThemeDark] = useState(false);
    let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;
    const toggleTheme = useCallback(() => {
        return setIsThemeDark(!isThemeDark);
    }, [isThemeDark]);

    const preferences = useMemo(
        () => ({
            toggleTheme,
            isThemeDark,
        }),
        [toggleTheme, isThemeDark]
    );
    console.log(theme.colors.onBackground)
    return (
        <ThemeContext.Provider value={preferences}>
            <Provider store={store}>
                <PaperProvider theme={theme}>
                    <NavigationContainer theme={theme}>                       
                        <SafeAreaView style={{ display: "flex", flexDirection: 'column', alignItems: "center" }}>
                            <Text>React Native Using TypeScript</Text>
                            <View style={{ height: 200, width: 200, backgroundColor: CombinedDarkTheme.colors.onBackground }} />
                        </SafeAreaView>
                    </NavigationContainer>
                </PaperProvider>
            </Provider>
        </ThemeContext.Provider>
    );
};

export default App;