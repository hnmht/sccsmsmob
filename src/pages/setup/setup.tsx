import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import {  useAuthStackNavigation } from "../../dataType/types/navigation";

function Setup() {
    const { t } = useTranslation();
    const navigation = useAuthStackNavigation();
    console.log("naviagtion:",navigation);
    const handleOkButtonPress = () => {
        navigation.navigate("Login")
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text>Setup</Text>
            <Button onPress={handleOkButtonPress}>{t("ok")}</Button>
        </SafeAreaView>
    )
}

export default Setup;