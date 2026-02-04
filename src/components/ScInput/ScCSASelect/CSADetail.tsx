import { Portal, Dialog, Text, Button, useTheme } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { ConstructionSite } from "../../../dataType/types/csa";
import { TFunction } from "i18next";
import { useAppSelector } from "../../../store/hooks";

interface CSADetailProps {
    visible: boolean;
    currentItem: ConstructionSite;
    backAction: () => void;
    t: TFunction;
}

const CSADetail = ({ visible, currentItem, backAction, t }: CSADetailProps) => {
    const theme = useTheme();
    const csos = useAppSelector(state => state.dynamicData.csos);
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
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("category")} : {currentItem.csc.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("code")} : {currentItem.code}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("name")} : {currentItem.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("description")}: {currentItem.description}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("subDept")} : {currentItem.subDept.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("respDept")} : {currentItem.respDept.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("respPerson")} : {currentItem.respPerson.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("longtitude")}: {currentItem.longitude}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>{t("latitude")}: {currentItem.latitude}</Text>
                            {csos.map(cso => {
                                return cso.enable === 1
                                    ? <Text maxFontSizeMultiplier={1.4} key={cso.id} selectable>{cso.displayName}:{(currentItem as any)[cso.code]?.name}</Text>
                                    : null
                            })}
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

export default CSADetail;