import { Portal, Dialog, Text, Button, MD3Theme } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { TFunction } from "i18next";
import { Position } from "../../../dataType/types/postion";

interface PositionDetailProps {
    visible: boolean;
    currentItem: Position;
    backAction: () => void;
    t: TFunction;
    theme: MD3Theme
}

const PositionDetail = ({ visible, currentItem, backAction, t, theme }: PositionDetailProps) => {
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
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("positionName")} : {currentItem.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("description")}: {currentItem.description}</Text>
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

export default PositionDetail;