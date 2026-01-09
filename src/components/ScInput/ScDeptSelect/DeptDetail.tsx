import { Portal, Dialog, Text, Button, useTheme } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { TFunction } from "i18next";

import { SimpDept } from "../../../dataType/types/department";

interface deptDetailProps {
    visible: boolean;
    currentItem: SimpDept;
    backAction: () => void;
    t: TFunction
}
const DeptDetail = ({ visible, currentItem, backAction, t }: deptDetailProps) => {
    const theme = useTheme();
    const color = currentItem.status === 1 ? "red" : theme.colors.primary;
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
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable style={{ color: color }}>{t("deptName")}: {currentItem.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("deptCode")}: {currentItem.code}</Text>                     
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("description")}: {currentItem.description}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("leader")}: {currentItem.leader.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("status")}:{t(currentItem.status === 0 ? "normal" : "disable")}</Text>
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

export default DeptDetail;