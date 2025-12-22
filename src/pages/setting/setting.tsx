import { useContext, useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Switch, List, Divider, useTheme, Button, Surface, IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { ThemeContext } from "../../theme/context";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";

import { setIsOffline } from "../../store/slice/appInfo";
import { getWORefsData, getEORefsDataWithImage } from "../../store/pub";
import { simpDeptRepo } from "../../db/crud/department";
import { simpEPCRepo } from "../../db/crud/epc";
import { personRepo } from "../../db/crud/person";
import { CSRepo } from "../../db/crud/csa";
import { simpCSCRepo } from "../../db/crud/csc";
import { CSORepo } from "../../db/crud/cso";
import { UDCRepo } from "../../db/crud/udc";
import { UDARepo } from "../../db/crud/uda";
import { EPARepo } from "../../db/crud/epa";
import { EPTRepo } from "../../db/crud/ept";
import { riskLevelRepo } from "../../db/crud/risklevel";
import { simpDCRepo } from "../../db/crud/dc";
import { positionRepo } from "../../db/crud/position";
import { TCRepo } from "../../db/crud/tc";
import { PPERepo } from "../../db/crud/ppe";
import { useRootNavigation, useSettingNavigation } from "../../navigation/config/screenParams";
import { reqLogout } from "../../api/login";

const Setting = () => {
    const navigation = useRootNavigation();
    const settingNav = useSettingNavigation();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const { toggleTheme, isThemeDark } = useContext(ThemeContext);
    const person = useAppSelector(state => state.user.person);
    const appInfo = useAppSelector(state => state.appInfo);
    const isOffLine = appInfo.isOffline === 1;

    //Switch to Offline mode
    const handleSwitchOffLine = async () => {
        if (isOffLine) {
            // Switch to online mode
            dispatch(setIsOffline(0));
            // Navigate to Login Page
            navigation.replace("AuthStack", { screen: "Login" });
        } else {
            handleDownOfflineData();
        }
    };

    //切换到离线模式数据准备
    const handleDownOfflineData = async () => {
        try {
            setOverlayStatus({ visible: true, description: t("syncUDC") });
            await UDCRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncSimpDept") });
            await simpDeptRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncSimpEPC") });
            await simpEPCRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncSimpCSC") });
            await simpCSCRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncUDA") });
            await UDARepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncPerson") });
            await personRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncEPA") });
            await EPARepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncCSO") });
            await CSORepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncCS") });
            await CSRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncEPT") });
            await EPTRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncRiskLevel") });
            await riskLevelRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncDC") });
            await simpDCRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncPosition") });
            await positionRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncTC") });
            await TCRepo.initCache();

            setOverlayStatus({ visible: true, description: t("syncPPE") });
            await PPERepo.initCache();

            setOverlayStatus({ visible: true, description: t("downloadWO") });
            await getWORefsData();

            setOverlayStatus({ visible: true, description: t("downloadIssue") });
            await getEORefsDataWithImage();

            setOverlayStatus({ visible: false, description: "" });
            // Switch to offline mode
            dispatch(setIsOffline(1));
        } catch (err) {
            setOverlayStatus({ visible: false, description: "" });
            Alert.alert(t("error"), t("syncErrorMsg"))
            dispatch(setIsOffline(1));
        }
    };
    // Login out
    const handleExitLogin = () => {
        if (!isOffLine) {
            console.log("Logout in online mode");
            reqLogout();
        }
        navigation.replace("AuthStack", { screen: "Login" });
    };
    // Navigate to Profile page
    const handleUserDetail = () => {
        settingNav.navigate("Profile");
    };
    // Navigate to About page
    const handleAbout = () => {
        settingNav.navigate("About");
    };
    // Navigate to Prvacy Policy page
    const handlePrivacy = () => {
        settingNav.navigate("Privacy");
    };

    // Naviagte to Change Password page
    const handleChangePassword = () => {
        settingNav.navigate("ChangePassword");
    };
    // Navigate to File Clean page
    const handleFileCleaning = () => {
        settingNav.navigate("FileClean");
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
            />
            <Surface style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 80 }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 16 }}>
                    <PersonAvatar url={person.avatar.fileUrl} isOffLine={appInfo.isOffline} name={person.name} />
                    <View style={{ marginLeft: 8 }}>
                        <Text variant="titleLarge" maxFontSizeMultiplier={1}>{person.name}</Text>
                        <Text variant="titleSmall" maxFontSizeMultiplier={1}>{person.deptName}</Text>
                    </View>
                </View>
                <Button disabled={isOffLine} style={{ paddingRight: 16 }} onPress={handleUserDetail}>{t("detail")}</Button>
            </Surface>
            <ScrollView>
                <List.Section>
                    <List.Item
                        title={t(isThemeDark ? "switchLight" : "switchDark")}
                        left={() => <List.Icon icon="invert-colors" color={theme.colors.primary} />}
                        right={() => <Switch value={isThemeDark} onValueChange={toggleTheme} />}
                        style={{ paddingLeft: 16, height: 64, alignItems: "center", justifyContent: "center" }}
                        titleMaxFontSizeMultiplier={1.2}
                    />
                    <Divider />
                    <List.Item
                        title={t(isOffLine ? "switchOnline" : "switchOffline")}
                        left={() => <List.Icon icon={isOffLine ? "wifi-off" : "wifi"} color={theme.colors.primary} />}
                        right={() => <Switch color={theme.colors.error} value={isOffLine} onValueChange={handleSwitchOffLine} />}
                        style={{ paddingLeft: 16, height: 64, alignItems: "center", justifyContent: "center" }}
                        titleMaxFontSizeMultiplier={1.2}
                    />
                    <Divider />
                    {!isOffLine
                        ? <>
                            <List.Item
                                title={t("changePassword")}
                                left={() => <List.Icon icon="form-textbox-password" color={theme.colors.primary} />}
                                right={() => <IconButton iconColor={theme.colors.primary} icon="chevron-right" size={24} style={{ padding: 0, margin: 0 }} />}
                                style={{ paddingLeft: 16, height: 64, alignItems: "center", justifyContent: "center" }}
                                onPress={handleChangePassword}
                                titleMaxFontSizeMultiplier={1.2}
                            />
                            <Divider />
                        </>
                        : null
                    }
                    <List.Item
                        title={t("fileCleanup")}
                        left={() => <List.Icon icon="file-replace-outline" color={theme.colors.primary} />}
                        right={() => <IconButton iconColor={theme.colors.primary} icon="chevron-right" size={24} style={{ padding: 0, margin: 0 }} />}
                        style={{ paddingLeft: 16, height: 64, alignItems: "center", justifyContent: "center" }}
                        onPress={handleFileCleaning}
                        titleMaxFontSizeMultiplier={1.2}
                    />
                    <Divider />
                    <List.Item
                        title={t("MenuAbout")}
                        left={() => <List.Icon icon="information-variant" color={theme.colors.primary} />}
                        right={() => <IconButton iconColor={theme.colors.primary} icon="chevron-right" size={24} style={{ padding: 0, margin: 0 }} />}
                        style={{ paddingLeft: 16, height: 64, alignItems: "center", justifyContent: "center" }}
                        onPress={handleAbout}
                        titleMaxFontSizeMultiplier={1.2}
                    />
                    <Divider />
                    <List.Item
                        title={t("privacyPolicy")}
                        left={() => <List.Icon icon="alert-circle-outline" color={theme.colors.primary} />}
                        right={() => <IconButton iconColor={theme.colors.primary} icon="chevron-right" size={24} style={{ padding: 0, margin: 0 }} />}
                        style={{ paddingLeft: 16, height: 64, alignItems: "center", justifyContent: "center" }}
                        onPress={handlePrivacy}
                        titleMaxFontSizeMultiplier={1.2}
                    />
                    <Divider />

                </List.Section>
                <View style={{ alignContent: "center", alignItems: "center", marginTop: 20, marginBottom: 20 }}>
                    <Button
                        mode="contained-tonal"
                        icon="exit-to-app"
                        textColor={theme.colors.error}
                        style={{ width: "60%" }}
                        onPress={handleExitLogin}
                        maxFontSizeMultiplier={1.2}
                    >
                        {t("logout")}
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Setting;