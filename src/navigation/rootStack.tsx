import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNavigationContainerRef, ParamListBase, NavigationProp, Route } from "@react-navigation/native";
import { RootStackParamList } from "../dataType/types/navigation";
import Splash from "../pages/splash/splash";
import SignPrivacy from "../pages/privacyPolicy/signProvacy";
import AuthStackScreen from "./authStack";
// import Navigator from "./navigator";


const RootStack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<ParamListBase>();
export function navigate<RouteName extends keyof ParamListBase>(
    name: RouteName,
    params?: ParamListBase[RouteName] extends undefined
        ? undefined
        : ParamListBase[RouteName]
) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as any, params as any);
    }
};

export const RootStackScreen = () => {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash" >
            <RootStack.Screen name="AuthStack" component={AuthStackScreen} />
            <RootStack.Screen name="Splash" component={Splash} />
            <RootStack.Screen name="SignPrivacy" component={SignPrivacy} />
            {/* <RootStack.Screen name="Navigator" component={Navigator} /> */}
        </RootStack.Navigator>
    )
}; 
