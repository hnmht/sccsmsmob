import { Portal, Dialog, Text, Button, useTheme } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { TFunction } from "i18next";
import { SimpEPC } from "../../../dataType/types/epc";

interface EPCDetailProps {
    visible: boolean;
    currentItem: SimpEPC;
    backAction: () => void;
    t: TFunction;
}

const EPCDetail = ({ visible, currentItem, backAction, t }: EPCDetailProps) => {
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

export default EPCDetail;