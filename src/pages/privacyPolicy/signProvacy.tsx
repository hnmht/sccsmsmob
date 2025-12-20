import { useState } from "react";
import { Button, Text, Checkbox } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { View, BackHandler, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrivacyText from "./privacyText";
import { useAuthNavigation,useRootNavigation } from "../../navigation/config/screenParams";

function SignPrivacy() {
    const { t } = useTranslation();
    const rootNav = useRootNavigation();
    const [agree, setAgree] = useState(false);
    // Actions after click Reject button
    const handleRefuse = () => {
        BackHandler.exitApp();
    };
    // Actions after click Agree button
    const handleAgree = () => {
        // navigation.replace("AuthStack", { screen: "Setup" });
        rootNav.replace("AuthStack",{screen:"Setup"});
    };

    return (<SafeAreaView style={{ flex: 1 }}>
        <Text variant="titleLarge" style={{ margin: 8 }}>隐私政策</Text>
        <ScrollView>
            <PrivacyText />
        </ScrollView>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Checkbox.Item
                label=""
                status={agree ? "checked" : "unchecked"}
                position="leading"
                onPress={() => setAgree(!agree)}
            />
            <Text variant="bodyLarge">我已阅读并同意</Text>
            <Text variant="bodyLarge" style={{ color: "blue" }}>《隐私政策》</Text>
            <Text variant="bodyLarge">。</Text>
        </View>
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 8 }}>
            <Button mode="elevated" textColor="red" onPress={handleRefuse} style={{ marginRight: 8 }} >{t("rejectAndExit")}</Button>
            <Button mode="elevated" onPress={handleAgree} disabled={!agree} >{t("agreeAndContinue")}</Button>
        </View>
    </SafeAreaView>
    );
};

export default SignPrivacy;