import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../pages/login/login";
import Setup from "../pages/setup/setup";

const AuthStack = createNativeStackNavigator();

const AuthStackScreen = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="Setup" component={Setup} />
        </AuthStack.Navigator>
    )
};

export default AuthStackScreen;