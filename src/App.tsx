import { View, Text } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
const App = () => { 
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