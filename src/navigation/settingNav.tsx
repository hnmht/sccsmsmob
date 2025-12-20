import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Setting from "../pages/setting/setting";
import Profile from "../pages/profile/profile";
import ChangePassword from "../pages/changePassword/changePassword";
import FileClean from "../pages/fileClean/fileClean";
import About from "../pages/about/about";
import PrivacyPolicy from "../pages/privacyPolicy/privacyPolicy";
import { SettingNavParamList } from "./config/screenParams";

const SettingStack = createNativeStackNavigator<SettingNavParamList>();

const SettingNav = () => {
    return (
        <SettingStack.Navigator initialRouteName="Setting">
            <SettingStack.Screen name="Setting" options={{ headerShown: false, title: "设置", }} component={Setting} />
            <SettingStack.Screen name="Profile" options={{ headerShown: true, title: "个人中心", headerBackVisible: false }} component={Profile} />
            <SettingStack.Screen name="About" options={{ headerShown: true, title: "软件许可", headerBackVisible: false }} component={About} />
            <SettingStack.Screen name="Privacy" options={{ headerShown: true, title: "隐私政策", headerBackVisible: false }} component={PrivacyPolicy} />
            <SettingStack.Screen name="ChangePassword" options={{ headerShown: true, title: "修改密码", headerBackVisible: false }} component={ChangePassword} />
            <SettingStack.Screen name="FileClean" options={{ headerShown: true, title: "文件清理", headerBackVisible: false }} component={FileClean} />
        </SettingStack.Navigator>
    );
};

export default SettingNav;