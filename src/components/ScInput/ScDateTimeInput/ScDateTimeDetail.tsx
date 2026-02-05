import { Portal, Dialog, Text, Button } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { dayjs } from "../../../i18n/dayjs";
import { ScDetailProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

const ScDateTimeDetail = ({ visible, currentItem, backAction, t, theme }: ScDetailProps<ScDataTypeList.DateTime>) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={backAction}>
                <Dialog.Title maxFontSizeMultiplier={1.2} style={{ color: theme.colors.primary }}>{t("detail")}</Dialog.Title>
                <Dialog.ScrollArea style={{ maxHeight: "75%" }} >
                    {currentItem === undefined || !dayjs(currentItem).isValid()
                        ? <View>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4}>{t("noData")}</Text>
                        </View>
                        : <ScrollView style={{ maxHeight: "100%" }}>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{currentItem}</Text>
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

export default ScDateTimeDetail; 