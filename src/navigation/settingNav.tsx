import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Setting from "../pages/setting/setting";
import Profile from "../pages/profile/profile";
// import ChangePassword from "../pages/changePassword/changePassword";
// import FileCleaning from "../pages/fileCleaning/fileClearning";
// import About from "../pages/about/about";
// import PrivacyPolicy from "../pages/privacy/privacy";
// import Notice from "../pages/notice/notice";


const SettingStack = createNativeStackNavigator();

const SettingNav = () => {
    return (
        <SettingStack.Navigator initialRouteName="Setting">
            <SettingStack.Screen name="Setting" options={{ headerShown: false, title: "设置", }} component={Setting} />
            <SettingStack.Screen name="Profile" options={{ headerShown: true, title: "个人中心", headerBackVisible: false }} component={Profile} />
            {/* <SettingStack.Screen name="About" options={{ headerShown: true, title: "软件许可", headerBackVisible: false }} component={About} />
            <SettingStack.Screen name="Privacy" options={{ headerShown: true, title: "隐私政策", headerBackVisible: false }} component={PrivacyPolicy} />
            <SettingStack.Screen name="Notice" options={{ headerShown: true, title: "使用须知", headerBackVisible: false }} component={Notice} />
            <SettingStack.Screen name="ChangePassword" options={{ headerShown: true, title: "修改密码", headerBackVisible: false }} component={ChangePassword} />
            <SettingStack.Screen name="FileCleaning" options={{ headerShown: true, title: "文件清理", headerBackVisible: false }} component={FileCleaning} /> */}
        </SettingStack.Navigator>
    );
};

export default SettingNav;