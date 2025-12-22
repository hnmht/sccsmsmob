
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { WorkOrderParams } from './businessNav';
// AuthStack 
export type AuthStackParmList = {
    Login: undefined;
    Setup: undefined;
}
export function useAuthNavigation<T extends keyof AuthStackParmList>() {
    return useNavigation<NativeStackNavigationProp<AuthStackParmList, T>>();
}
export function useAuthRoute<T extends keyof AuthStackParmList>() {
    return useRoute<RouteProp<AuthStackParmList, T>>();
}
// BusinessNav
export type BusinessNavParamList = {
    BusinessScreen: undefined;
    AddressBook: undefined;
    WorkOrder: WorkOrderParams | undefined;
    WorkOrderList: undefined;
    ExecutionOrder: WorkOrderParams | undefined;
    ExecutionOrderList: undefined;
    ExecutionOrderReview: undefined;
    ExecutionOrderReviewList: undefined;
    IssueResolutionForm: undefined;
    IssueResolutionFormList: undefined;
    LookupDocument: undefined;
    ReceivedTraining: undefined;
    PPEReport: undefined;
}

export function useBusinessNavigation<T extends keyof BusinessNavParamList>() {
    return useNavigation<NativeStackNavigationProp<BusinessNavParamList, T>>();
}
export function useBusinessRoute<T extends keyof BusinessNavParamList>() {
    return useRoute<RouteProp<BusinessNavParamList, T>>();
}

// SettingNav
export type SettingNavParamList = {
    Setting: undefined;
    Profile: undefined;
    About: undefined;
    Privacy: undefined;
    ChangePassword: undefined;
    FileClean: undefined;
}

export function useSettingNavigation<T extends keyof SettingNavParamList>() {
    return useNavigation<NativeStackNavigationProp<SettingNavParamList, T>>();
}
export function useSettingRoute<T extends keyof SettingNavParamList>() {
    return useRoute<RouteProp<SettingNavParamList, T>>();
}

// Bottom Naviagtion
export type BottomNavParamList = {
    Home: undefined;
    Message: undefined;
    Calendar: undefined;
    BusinessNav: NavigatorScreenParams<BusinessNavParamList> | undefined;
    SettingNav: NavigatorScreenParams<SettingNavParamList>;
}
export function useBottomNavigation<T extends keyof BottomNavParamList>() {
    return useNavigation<BottomTabNavigationProp<BottomNavParamList, T>>();
}

export function useBottomRoute<T extends keyof BottomNavParamList>() {
    return useRoute<RouteProp<BottomNavParamList, T>>();
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

