import { memo, useState } from "react";
import { View } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";
import { logicDisplay } from "./constructor";


const LogicSelect = (props) => {
    const { positionID, rowIndex, itemShowName, itemKey, isEdit, pickDone } = props;
    const [fieldValue, setFieldValue] = useState("and");
    const [visible, setVisible] = useState(false);
    const theme = useTheme();

    const handleChange = (newValue) => {
        setFieldValue(newValue);
        let errMsg = { isErr: false, msg: "" };
        setVisible(false);
        pickDone(newValue, itemKey, positionID, rowIndex, errMsg);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: "100%", padding: 2 }}>
            <Menu
                id={`menu${itemKey}${positionID}${rowIndex}`}
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchorPosition="bottom"
                anchor={
                    <TextInput
                        id={itemKey}
                        mode="outlined"
                        keyboardType="default"
                        label={"*" + itemShowName}
                        editable={false}
                        disabled={!isEdit}
                        value={logicDisplay[fieldValue]}
                        right={
                            <TextInput.Icon
                                icon="arrow-down-drop-circle"
                                iconColor={isEdit ? theme.colors.primary : theme.colors.onBackground}
                                onPress={() => setVisible(true)}
                                disabled={!isEdit}
                            />
                        }
                        style={{ width: "100%" }}
                    />
                }
            >
                <Menu.Item key={"and"} onPress={() => handleChange("and")} title="并且" />
                <Menu.Item key={"or"} onPress={() => handleChange("or")} title="或者" />
            </Menu>
        </View>

    );
};

export default memo(LogicSelect);