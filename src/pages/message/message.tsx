import { useState } from "react";
import { View, FlatList } from "react-native";
import { SegmentedButtons, Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
// import ReadMessage from "./readMessage";
// import UnReadMessages from "./unReadMessages";

import { Comparison, Condition, QueryField } from "../../dataType/types/queryPanel";
import { ErrMsg } from "../../dataType/types/scInput";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import QueryPanel from "../../components/QueryPanel/QueryPanel";

import { equal } from "../../dataType/dataZero/queryPanel";
import { getEmptySimpDept } from "../../dataType/dataZero/department";



const Message = () => {
    const [content, setContent] = useState("unRead");
    const theme = useTheme();

  

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
               
            </View>
        </SafeAreaView>
    );
};

export default Message;

