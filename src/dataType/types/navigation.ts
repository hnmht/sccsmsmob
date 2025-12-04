import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// RootStack Types
export type RootStackParamList = {
    Splash: { deepLinkUrl?: string } | undefined;
    PrivacyPolicy: { deepLinkUrl?: string } | undefined;
    SignPrivacy: { deepLinkUrl?: string } | undefined;
    AuthStack: { deepLinkUrl?: string, screen: 'Login' | 'Setup' } | undefined;
}

export function useRootStackNavigation() {
    return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}

export function useRootStackRoute<T extends keyof RootStackParamList>() {
    return useRoute<RouteProp<RootStackParamList, T>>();
}

export type AuthStackParmList = {
    Setup: { deepLinkUrl?: string } | undefined;
    Login: { deepLinkUrl?: string } | undefined;
}

export function useAuthStackNavigation() {
    return useNavigation<NativeStackNavigationProp<AuthStackParmList>>();
}

