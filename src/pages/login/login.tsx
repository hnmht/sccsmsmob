import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button,Icon, useTheme } from "react-native-paper";

import { useAuthStackNavigation } from "../../dataType/types/navigation";
import { useAppSelector } from "../../store/hooks";

function Login() {

    const navigation = useAuthStackNavigation();
    const theme = useTheme()

    const appInfo = useAppSelector(state => state.appInfo);
    console.log("Login appInfo:", appInfo);
    return (
        <SafeAreaView>
            <Icon
                source="camera"
                color={theme.colors.error}
                size={20}
            />
            <Text>LoginPage</Text>
            <Button onPress={() => navigation.navigate("Setup")}>返回</Button>
        </SafeAreaView>
    )
}

export default Login;
