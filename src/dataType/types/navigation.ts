/* import type { ComponentType } from 'react';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// RootStack Types
export type RootStackParamList = {
    Splash: { deepLinkUrl?: string } | undefined;
    PrivacyPolicy: { deepLinkUrl?: string } | undefined;
    SignPrivacy: { deepLinkUrl?: string } | undefined;
    AuthStack: { deepLinkUrl?: string, screen: 'Login' | 'Setup' } | undefined;
    Navigator: { deepLinkUrl?: string, screen: "Home" | "Message" | "Profile" | "Business" } | undefined;
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
export type TabRouteName = | 'Home' | 'Message' | 'Calendar' | 'Business' | 'SettingNav';
export interface TabConfig {
    title: string;
    icon: 'home' | 'message' | 'calendar' | 'all-inclusive' | 'cog';
    component: ComponentType<any>;
    showWhenOffline?: boolean;
    getBadge: (n:number) => number | undefined;
}
 */