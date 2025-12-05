import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button } from "react-native-paper";

import { useAuthStackNavigation } from "../../dataType/types/navigation";
import { useAppSelector } from "../../store/hooks";



function Login() {

    const navigation = useAuthStackNavigation();

    const appInfo = useAppSelector(state => state.appInfo);
    console.log("Login appInfo:", appInfo);
    return (
        <SafeAreaView>
            <Text>LoginPage</Text>
            <Button onPress={() => navigation.navigate("Setup")}>返回</Button>
        </SafeAreaView>
    )
}

export default Login;
