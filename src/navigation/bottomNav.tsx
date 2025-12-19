import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAppSelector } from "../store/hooks";
import Dashboard from "../pages/dashboard/dashboard";
import BusinessNav from "./businessNav";
import SettingNav from "./settingNav";
import Calendar from "../pages/calendar/calendar";
import Message from "../pages/message/message";
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { pubParams } from "../components/pub/pubParams";
import { TabRouteName, TabConfig } from "./config/tab";

import { BottomNavParamList } from "./config/screenParams";

const getBudge = (n: number) => {
    if (n > 0) {
        return n;
    }
    return undefined;
};

const TAB_CONFIG: Record<TabRouteName, TabConfig> = {
    Home: {
        title: '首页',
        icon: 'home',
        component: Dashboard,
        showWhenOffline: false,
        getBadge: (n: number) => getBudge(n),
    },
    Message: {
        title: '消息',
        icon: 'message',
        component: Message,
        showWhenOffline: false,
        getBadge: (messageNumber: number) => messageNumber || undefined,
    },
    Calendar: {
        title: '日程',
        icon: 'calendar',
        component: Calendar,
        getBadge: (taskNumber: number) => taskNumber || undefined,
    },
    Business: {
        title: '业务',
        icon: 'all-inclusive',
        component: BusinessNav,
        getBadge: (n: number) => getBudge(n),
    },
    SettingNav: {
        title: '设置',
        icon: 'cog',
        component: SettingNav,
        getBadge: (n: number) => getBudge(n),
    },
};
const Tab = createBottomTabNavigator<BottomNavParamList>();

function BottomNav() {
    const dynamicData = useAppSelector(state => state.dynamicData);
    const appInfo = useAppSelector(state => state.appInfo);

    const messageNumber = dynamicData.messages.length;
    const taskNumber = dynamicData.eoRefs.length + dynamicData.woRefs.length;
    const isOffLine = appInfo.isOffline === 1;
    const badgeOptions = pubParams.screen.fontScale > 1 ? { fontSize: 16 / pubParams.screen.fontScale, lineHeight: 16 / pubParams.screen.fontScale + 2 } : undefined;

    return (
        <Tab.Navigator
             screenOptions={({ route }) => {
                 const config = TAB_CONFIG[route.name as TabRouteName];
                 return {
                     headerShown: false,
                     tabBarShowLabel: true,
                     tabBarHideOnKeyboard: true,
                     tabBarAllowFontScaling: false,
                     headerTitleAllowFontScaling: false,
                     tabBarIcon: ({ color, size }) => (
                         <MaterialDesignIcons
                             name={config?.icon ?? 'help-circle'}
                             size={size}
                             color={color}
                         />
                     ),
                 };
             }}
         >
             {(Object.keys(TAB_CONFIG) as TabRouteName[]).map(name => {
                 const config = TAB_CONFIG[name];
 
                 if (isOffLine && config.showWhenOffline === false) {
                     return null;
                 }
                 return (
                     <Tab.Screen
                         key={name}
                         name={name}
                         component={config.component}
                         options={{
                             title: config.title,
                             tabBarBadge: config.getBadge(8),
                             tabBarBadgeStyle: badgeOptions,
                         }}
                     />
                 );
             })}
         </Tab.Navigator> 
    );
};

export default BottomNav;