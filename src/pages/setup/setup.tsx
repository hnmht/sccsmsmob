import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useAuthStackNavigation } from "../../dataType/types/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";


function Setup() {
    const { t } = useTranslation();
    const navigation = useAuthStackNavigation();
    const theme = useTheme();
    const appInfo = useAppSelector(state => state.appInfo)

    const [text, setText] = useState(appInfo.serverAddr);
    const [isLoading, setIsLoading] = useState(false);
    const showLogin = appInfo.serverAddr !== "";

    const handleOkButtonPress = () => {
        navigation.navigate("Login");
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text>Setup</Text>
            <Button onPress={handleOkButtonPress}>{t("ok")}</Button>
        </SafeAreaView>
    );
}
export default Setup;