import { useState } from "react";
import { View, FlatList } from "react-native";
import { SegmentedButtons, Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
// import ReadMessage from "./readMessage";
// import UnReadMessages from "./unReadMessages";
import ComparisonsSelect from "../../components/QueryPanel/ComparisonsSelect";
import { Comparison } from "../../dataType/types/queryPanel";
import { ErrMsg } from "../../dataType/types/scInput";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { equal } from "../../dataType/dataZero/queryPanel";


const Message = () => {
    const [content, setContent] = useState("unRead");
    const theme = useTheme();

    const handleGetValue = (value: Comparison, itemkey: string, positionID: 0 | 1 | 2, rowIndex: number, errMsg: ErrMsg) => {
        console.log(value)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginTop: 8, padding: 2 }}>
                <SegmentedButtons
                    value={content}
                    onValueChange={setContent}
                    buttons={[
                        {
                            value: 'unRead',
                            label: '未读',
                            checkedColor: theme.colors.primary,
                            icon: "email-outline"
                        },
                        {
                            value: 'read',
                            label: '已读',
                            checkedColor: theme.colors.primary,
                            icon: "email-open-outline"
                        }
                    ]}
                />
            </View>
            <View style={{ flex: 1 }}>
                {/*  {content === "unRead"
                    ? <UnReadMessages />
                    : <ReadMessage />
                } */}
                <ComparisonsSelect
                    positionID={0}
                    rowIndex={0}
                    itemShowName="Comparison"
                    itemKey="a"
                    pickDone={handleGetValue}
                    dataType={ScDataTypeList.Gender}
                    isEdit={true}
                    selected={equal}
                />
            </View>
        </SafeAreaView>
    );
};

export default Message;

