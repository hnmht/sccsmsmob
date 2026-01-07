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
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={backAction}>
                <Dialog.Title maxFontSizeMultiplier={1.2} style={{ color: theme.colors.primary }}>详情</Dialog.Title>
                <Dialog.ScrollArea style={{ maxHeight: "75%" }} >
                    {currentItem === undefined || currentItem.id === 0
                        ? <View>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4}>数据为空</Text>
                        </View>
                        : <ScrollView style={{ maxHeight: "100%" }}>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>编码: {currentItem.code}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>名称: {currentItem.name}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>说明: {currentItem.description}</Text>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>部门主管: {currentItem.leader.name}</Text>
                        </ScrollView>
                    }
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={backAction}>返回</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default DeptDetail;