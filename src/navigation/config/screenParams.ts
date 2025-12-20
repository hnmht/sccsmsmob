
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
 // AuthStack 
export type AuthStackParmList = {
    Login: undefined;
    Setup: undefined;
}
export function useAuthNavigation<T extends keyof AuthStackParmList>() {
    return useNavigation<NativeStackNavigationProp<AuthStackParmList,T>>();
}
export function useAuthRoute<T extends keyof AuthStackParmList>() {
    return useRoute<RouteProp<AuthStackParmList,T>>();
}

// Bottom Naviagtion
export type BottomNavParamList = {
    Home: undefined;
    Message: undefined;
    Calendar: undefined;
    BusinessNav: undefined;
    SettingNav: undefined;
}

export function useBottomNavigation<T extends keyof BottomNavParamList>() {
    return useNavigation<BottomTabNavigationProp<BottomNavParamList,T>>();
}

export function useBottomRoute<T extends keyof BottomNavParamList>() {
    return useRoute<RouteProp<BottomNavParamList,T>>();
}

// RootStack Navigation
export type RootStackParamList = {
    BottomNav: NavigatorScreenParams<BottomNavParamList>;
    AuthStack: NavigatorScreenParams<AuthStackParmList>;
    Splash: undefined;
    SignPrivacy: undefined;
}

export function useRootNavigation<T extends keyof RootStackParamList>() {
    return useNavigation<NativeStackNavigationProp<RootStackParamList, T>>();
}
export function useRootRoute<T extends keyof RootStackParamList>() {
    return useRoute<RouteProp<RootStackParamList, T>>();
} 

