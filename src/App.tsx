import { View, Text } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as RNLocalize from "react-native-localize";
interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
}

function getPropertyValue<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const App = () => {
    const laptop: Product = {
        id: 101,
        name: "Laptop Pro",
        price: 1200.50,
        inStock: true,
    };

    const productName = getPropertyValue(laptop, 'name');
    console.log("productName:",productName);

    const locales = RNLocalize.getLocales();
    const preferredLanguage = locales[0].languageTag;

    console.log(preferredLanguage);
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ display: "flex", flexDirection: 'column', alignItems: "center"}}>
                <View style={{ height: 100, width: 100, backgroundColor: 'blue', flex: 0.2 }} />
                <View style={{ height: 100, width: 100, backgroundColor: 'red', flex: 0.4 }} />
                <Text>React Native Using TypeScript</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default App;