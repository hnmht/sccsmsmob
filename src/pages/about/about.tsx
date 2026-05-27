import { useTranslation } from "react-i18next";
import { Linking, ScrollView } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../store/hooks";

const maxScale = 1.2;

function About() {
    const { t } = useTranslation();
    const theme = useTheme();
    const appInfo = useAppSelector(state => state.appInfo);

    const handleLinkGPLPress = async () => {
        const url = "https://www.gnu.org/licenses/";
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            console.warn("Don't know how to open URI: " + url);
        }
    }
    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ScrollView>
                <Card style={{ marginHorizontal: 4, marginTop: 16, marginBottom: 8 }}>
                    <Card.Title
                        title={t("openSourceLicense")}
                        titleMaxFontSizeMultiplier={maxScale}
                    />
                    <Card.Content>
                        <Text onPress={handleLinkGPLPress} style={{ color: theme.colors.primary, textDecorationLine: "underline", fontWeight: "bold" }}>
                            GNU GPL 3.0 License
                        </Text>
                    </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
    )
}

export default About; 