import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Setting from "../pages/setting/setting";
import Profile from "../pages/profile/profile";
import ChangePassword from "../pages/changePassword/changePassword";
import FileClean from "../pages/fileClean/fileClean";
import About from "../pages/about/about";
import PrivacyPolicy from "../pages/privacyPolicy/privacyPolicy";
import { SettingNavParamList } from "./config/screenParams";
import { useTranslation } from "react-i18next";

const SettingStack = createNativeStackNavigator<SettingNavParamList>();

const SettingNav = () => {
    const {t} = useTranslation()
    return (
        <SettingStack.Navigator initialRouteName="Setting">
            <SettingStack.Screen name="Setting" options={{ headerShown: false, title: t("MenuSettings"), }} component={Setting} />
            <SettingStack.Screen name="Profile" options={{ headerShown: true, title: t("MenuProfile"), headerBackVisible: false }} component={Profile} />
            <SettingStack.Screen name="About" options={{ headerShown: true, title: t("MenuAbout"), headerBackVisible: false }} component={About} />
            <SettingStack.Screen name="Privacy" options={{ headerShown: true, title: t("privacyPolicy"), headerBackVisible: false }} component={PrivacyPolicy} />
            <SettingStack.Screen name="ChangePassword" options={{ headerShown: true, title: t("changePassword"), headerBackVisible: false }} component={ChangePassword} />
            <SettingStack.Screen name="FileClean" options={{ headerShown: true, title: t("fileCleanup"), headerBackVisible: false }} component={FileClean} />
        </SettingStack.Navigator>
    );
};

export default SettingNav;