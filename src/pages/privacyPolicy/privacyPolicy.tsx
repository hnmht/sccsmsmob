import { Button } from "react-native-paper";
import { View, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../dataType/types/navigation";

type PrivacyPolicyProps = NativeStackScreenProps<RootStackParamList, "PrivacyPolicy">;

import PrivacyText from "./privacyText";
import { useTranslation } from "react-i18next";

function PrivacyPolicy({ navigation }: PrivacyPolicyProps) {    
    const { t } = useTranslation();
    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <PrivacyText />
            </ScrollView>
            < View style={{ width: "100%", alignItems: "center", justifyContent: "center", margin: 8 }}>
                <Button mode="elevated" onPress={() => navigation.goBack()} style={{ width: "40%" }}> {t("back")} </Button>
            </View>
        </View>
    );
};

export default PrivacyPolicy;