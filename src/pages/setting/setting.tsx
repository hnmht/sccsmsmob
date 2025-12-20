import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRootNavigation } from "../../navigation/config/screenParams";

function Setting() {
    const navigation = useRootNavigation();
    const handleOnPressGoback = () => {
        navigation.replace("AuthStack", { screen: "Login" })
    }
    return (
        <SafeAreaView style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Text>Setting</Text>
            <Button mode="contained" style={{ marginTop: 8 }} onPress={handleOnPressGoback}>返回登录</Button>
        </SafeAreaView>
    )
}

export default Setting; 