import { SafeAreaView } from "react-native-safe-area-context";
import { Text,Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function Login() {
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <Text>LoginPage</Text>
            <Button onPress={()=> navigation.goBack()}>返回</Button>
        </SafeAreaView>
    )
}

export default Login;
