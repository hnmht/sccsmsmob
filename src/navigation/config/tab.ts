import type { ComponentType } from "react";
export type TabRouteName = | 'Home' | 'Message' | 'Calendar' | 'Business' | 'SettingNav';
export interface TabConfig {
    title: string;
    icon: 'home' | 'message' | 'calendar' | 'all-inclusive' | 'cog';
    component: ComponentType<any>;
    showWhenOffline?: boolean;
    getBadge: (n: number) => number | undefined;
}