import { useState } from "react";
import { View, FlatList } from "react-native";
import { SegmentedButtons, Surface, Text, useTheme } from "react-native-paper";
import ReadMessage from "./readMessage";
import UnReadMessages from "./unReadMessages";


const Message = (props) => {
    const [content, setContent] = useState("unRead");
    const theme = useTheme();

    return (
        <View style={{ flex: 1 }}>
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
                {content === "unRead"
                    ? <UnReadMessages />
                    : <ReadMessage />
                }

            </View>
        </View>
    );
};

export default Message;