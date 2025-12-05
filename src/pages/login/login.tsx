import { SafeAreaView } from "react-native-safe-area-context";
import { Text,Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AuthStackParmList } from "../../dataType/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type LoginProps = NativeStackScreenProps<AuthStackParmList, "Login">;

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
