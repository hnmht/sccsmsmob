import { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    IconButton,
    Button,
    Text,
    TextInput,
    useTheme
} from "react-native-paper";
import { name } from "../../../app.json"

import { useAuthStackNavigation } from "../../dataType/types/navigation";
import { useAppSelector } from "../../store/hooks";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";

import { reqPubSysInfo } from "../../api/pub";
import { reqGetPublicKey } from "../../api/security";

function Login() {
    const navigation = useAuthStackNavigation();
    const theme = useTheme()
    const appInfo = useAppSelector(state => state.appInfo);
    const userInfo = useAppSelector(state => state.user)
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [userCode, setUserCode] = useState(userInfo.code);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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
        setOverlayStatus({ visible: true, description: "正在向服务器获取公玥..." });
        // requst Public Key from backend
        const keyRes = await reqGetPublicKey();
        if (!keyRes.status) {
            handleLoginFailed();
            return
        }
        const publicKey: string = keyRes.data;
        console.log("publicKey:", publicKey);
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
                <Text variant="titleLarge" allowFontScaling={false} style={{ marginBottom: 16, color: theme.colors.primary }}>{name}</Text>
                <TextInput
                    mode="outlined"
                    label={"用户编码"}
                    placeholder="请输入用户编码"
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
                    label="密码"
                    placeholder="请输入密码"
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
                    登录
                </Button>
                <Button mode="contained" disabled={!canOffline} onPress={handleUseOffLine} style={{ width: "80%", marginBottom: 8 }} maxFontSizeMultiplier={1.2}>{offlineButtonDisp}离线登录</Button>
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
