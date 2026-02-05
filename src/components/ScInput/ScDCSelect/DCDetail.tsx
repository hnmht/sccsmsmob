import { Portal, Dialog, Text, Button, useTheme } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { TFunction } from "i18next";
import { DC } from "../../../dataType/types/dc";

interface DCDetailProps {
    visible: boolean;
    currentItem: DC;
    backAction: () => void;
    t: TFunction;
}

const DCDetail = ({ visible, currentItem, backAction, t }: DCDetailProps) => {
    const theme = useTheme();
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={backAction}>
                <Dialog.Title maxFontSizeMultiplier={1.2} style={{ color: theme.colors.primary }}>{t("detail")}</Dialog.Title>
                <Dialog.ScrollArea style={{ maxHeight: "75%" }} >
                    {currentItem === undefined || currentItem.id === 0
                        ? <View>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4}>{t("noData")}</Text>
                        </View>
                        : <ScrollView style={{ maxHeight: "100%" }}>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("name")} : {currentItem.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("description")} : {currentItem.description}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("status")}: {t(currentItem.status === 0 ? "normal" : "disable")}</Text>
                        </ScrollView>
                    }
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={backAction}>{t("back")}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default DCDetail;