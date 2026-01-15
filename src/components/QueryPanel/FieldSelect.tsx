import { memo, useState } from "react";
import { View } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";

const FieldSelect = (props) => {
    const { positionID, rowIndex, itemShowName, itemKey, pickDone, fields, isEdit, selected } = props;
    const [fieldValue, setFieldValue] = useState(selected ? selected : fields[0]);
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    //选择项目变动
    const handleChange = (newValue) => {
        setVisible(false);
        setFieldValue(newValue);
        handleTransfer(newValue);
    };
    //向父组件传递数据
    const handleTransfer = (value) => {
        let errMsg = { isErr: false, msg: "" };
        pickDone(value, itemKey, positionID, rowIndex, errMsg);
    }

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
                        value={fieldValue.label}
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
                {fields.map((field, index) => <Menu.Item value={field.id} key={index} title={field.label} onPress={() => handleChange(field)} />)}
            </Menu>
        </View>
    );
};

export default memo(FieldSelect);
