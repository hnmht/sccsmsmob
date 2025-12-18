import { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    IconButton,
    Button,
    Text,
    TextInput,
    useTheme
} from "react-native-paper";
import jsencrypt from "jsencrypt";
import { useTranslation } from "react-i18next";

import { UserInfo } from "../../dataType/types/user";
import { ServerInfo } from "../../dataType/types/appInfo";
import { useAppDispatch } from "../../store/hooks";
import { useAppSelector } from "../../store/hooks";

import { appVersion } from "../../../app.json";
import { useAuthStackNavigation } from "../../dataType/types/navigation";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";

import { reqPubSysInfo } from "../../api/pub";
import { reqGetPublicKey } from "../../api/security";
import { reqLogin } from "../../api/login";
import { reqUserInfo } from "../../api/user";
import { setUserToken, setUserInfo } from "../../store/slice/user";
import { setIsOffline } from "../../store/slice/appInfo";
import { setDbid } from "../../store/slice/appInfo";

import { setServerInfo } from "../../store/slice/appInfo";
import { saveServerInfo, saveToken } from "../../db/crud/appInfo";
import { initLoaclData } from "../../db/localData";
import { saveUserInfo } from "../../db/crud/userInfo";
import { saveIsOffLine } from "../../db/crud/appInfo";


function Login() {
    const { t } = useTranslation();
    const navigation = useAuthStackNavigation();
    const theme = useTheme()
    const userInfo = useAppSelector(state => state.user)
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [userCode, setUserCode] = useState(userInfo.code);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();

    const canOffline = userInfo.id !== 0;
    const canLogin = userCode.trim() !== "" && password.trim() !== "" && !overlayStatus.visible;
    const offlineButtonDisp = canOffline ? `(${userInfo.name})` : "";

    const handleSetNetOnPress = () => {
        navigation.navigate("Setup");
    };

    // Actions after Login Failed
    const handleLoginFailed = () => {
        setOverlayStatus({ visible: false, description: "" });
    };

    const handleLogin = async () => {
        setOverlayStatus({ visible: true, description: t("requestingPublicKey") });
        try {
            // requst Public Key from backend
            const keyRes = await reqGetPublicKey();
            if (!keyRes.status) {
                handleLoginFailed();
                return
            }
            const publicKey: string = keyRes.data;
            // Encrypt password
            let encryptor = new jsencrypt();
            encryptor.setPublicKey(publicKey);
            let encryptedPwd = encryptor.encrypt(password).toString();

            setOverlayStatus({ visible: true, description: t("requestingLoginCrendentials") });
            let loginRes = await reqLogin({ userCode: userCode.trim(), password: encryptedPwd }, false);
            if (!loginRes.status) {
                handleLoginFailed();
                return
            }
            const token: string = loginRes.data;
            // Save Token into database
            saveToken(token);
            // update token in redux
            dispatch(setUserToken(token));
            setOverlayStatus({ visible: true, description: t("requestingUserInfo") });
            const userInfoRes = await reqUserInfo(token);
            if (!userInfoRes.status) {
                handleLoginFailed();
                return
            }
            const latestUserInfo: UserInfo = userInfoRes.data;
            // Save UserInfo into database
            saveUserInfo(latestUserInfo);
            // update UserInfo in redux
            dispatch(setUserInfo(latestUserInfo));

            setOverlayStatus({ visible: true, description: t("requestingServerInfo") });
            const serverInfoRes = await reqPubSysInfo();
            if (!serverInfoRes.status) {
                handleLoginFailed();
                return
            }
            const serverInfo: ServerInfo = serverInfoRes.data;
            if (appVersion.slice(0, 3) !== serverInfo.dbVersion?.slice(0, 3)) {
                Alert.alert(t("tip"), t("appAndServerInconsistent"))
            }
            // Save server Info into database
            saveServerInfo(serverInfo);
            // update Server Info in redux
            dispatch(setServerInfo(serverInfo));

            setOverlayStatus({ visible: true, description: t("requestingStaticData") });
            // Request Static data
            if (!serverInfo.dbID || serverInfo.dbID === "") {
                Alert.alert(t("tip"), t("invalidDBID"));
                handleLoginFailed();
                return
            }
            await initLoaclData(serverInfo.dbID);

            setOverlayStatus({ visible: true, description: t("requestingDynamicData") });
            dispatch(setDbid(serverInfo.dbID));
            // Request Dynamic Data
            // getAllDynamicData();
            handleLoginFailed();
        }
        catch (err) {
            handleLoginFailed();
            return
        }
        setOverlayStatus({ visible: true, description: t("redirectingToPage") });
        // Save Online status to database
        saveIsOffLine(0);
        // Write Online status into redux
        dispatch(setIsOffline(0));

        setOverlayStatus({ visible: false, description: "" });
        // navigation.replace("Navigator", { screen: "Home" });

    };

    const handleUseOffLine = () => {

    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
            />
            <View style={{ height: 60, width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
                <IconButton icon="server-network" style={{ height: 60, width: 60 }} iconColor={theme.colors.primary} onPress={handleSetNetOnPress} />
            </View>
            <KeyboardAvoidingView enabled style={styles.container}>
                <Text
                    variant="titleLarge"
                    allowFontScaling={false}
                    style={{ width: "80%", marginBottom: 16, color: theme.colors.primary, textAlign: "center" }}
                >
                    {t("systemName")}
                </Text>
                <TextInput
                    mode="outlined"
                    label={t("userCode")}
                    placeholder={t("codePlaceholder")}
                    value={userCode}
                    defaultValue={userInfo.code}
                    onChangeText={(text) => setUserCode(text)}
                    left={<TextInput.Icon icon="account" color={(isFocus) => isFocus ? theme.colors.primary : theme.colors.outline} />}
                    style={{ width: "90%", marginBottom: 8 }}
                    maxFontSizeMultiplier={1.5}
                />
                <TextInput
                    secureTextEntry={!showPassword}
                    mode="outlined"
                    label={t("labelPassword")}
                    placeholder={t("inputPasswordPlaceholder")}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={{ width: "90%", marginBottom: 16 }}
                    left={<TextInput.Icon icon="key" color={(isFocus) => isFocus ? theme.colors.primary : theme.colors.outline} />}
                    right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                    maxFontSizeMultiplier={1.5}
                />
                <Button
                    mode="contained"
                    loading={overlayStatus.visible}
                    disabled={!canLogin}
                    onPress={handleLogin}
                    style={{ width: "80%", marginBottom: 16 }}
                    maxFontSizeMultiplier={1.2}
                >
                    {t("login")}
                </Button>
                <Button mode="contained" disabled={!canOffline} onPress={handleUseOffLine} style={{ width: "80%", marginBottom: 8 }} maxFontSizeMultiplier={1.2}>
                    {`${offlineButtonDisp} ${t("offlineLogin")}`}
                </Button>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
    }
});

export default Login;
