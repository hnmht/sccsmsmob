import { memo, useState } from "react";
import { View } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";
import { Comparisons } from "../../dataType/dataZero/queryPanel";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { Comparison } from "../../dataType/types/queryPanel";
import { useTranslation } from "react-i18next";

interface comparisonsSelectProps {
    positionID: 0 | 1 | 2;
    rowIndex: number;
    itemShowName: string;
    itemKey: string;
    pickDone: (value: Comparison, itemKey: string, positionID: 0 | 1 | 2, rowIndex: number, errMsg: ErrMsg) => void;
    dataType: ScDataTypeList;
    isEdit: boolean;
    selected: Comparison;
}

const ComparisonsSelect = (props: comparisonsSelectProps) => {
    const { positionID, rowIndex, itemShowName, itemKey, pickDone, dataType, isEdit, selected } = props;
    const currentComps = Comparisons.filter((item) => item.applicable.includes(dataType));
    const [fieldValue, setFieldValue] = useState(selected ? selected : currentComps[0]);
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const { t } = useTranslation();
    const handleChange = (newValue: Comparison) => {
        setVisible(false);
        setFieldValue(newValue);
        handleTransfer(newValue);
    };

    //向父组件传递数据
    const handleTransfer = (value: Comparison) => {
        let errMsg: ErrMsg = { isErr: false, msg: "" };
        pickDone(value, itemKey, positionID, rowIndex, errMsg);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: "100%", padding: 2 }}>
            <Menu
                key={`menu${itemKey}${positionID}${rowIndex}`}
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
                        value={t(fieldValue.label)}
                        right={
                            <TextInput.Icon
                                icon="arrow-down-drop-circle"
                                color={isEdit ? theme.colors.primary : theme.colors.onBackground}
                                onPress={() => setVisible(true)}
                                disabled={!isEdit}
                            />
                        }
                        style={{ width: "100%" }}
                    />
                }
            >
                {currentComps.map(c => <Menu.Item key={c.id} title={t(c.label)} onPress={() => handleChange(c)} />)}
            </Menu>
        </View>
    );
};

export default memo(ComparisonsSelect);
