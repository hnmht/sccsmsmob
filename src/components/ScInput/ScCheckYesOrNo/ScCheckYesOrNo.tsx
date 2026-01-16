import { memo, useEffect, useState } from "react";
import { View } from "react-native";
import { Checkbox, useTheme } from "react-native-paper";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";

// Convert Boolean to Number
function boolTransInt(b: boolean): 0 | 1 {
    return b ? 1 : 0;
}
// Convert Number to Boolean
function intTransBool(i: number): boolean {
    return i === 1;
}

//402 Seacloud Check Yes Or No Component
const ScCheckYesOrNo = (props: ScInputProps<ScDataTypeList.CheckYesOrNo>) => {
    const { positionID, rowIndex, isEdit, itemShowName, itemKey, initValue = 0, pickDone, errInfo = { isErr: false, msg: "" }, width = "100%", height = 68 } = props;
    const [fieldValue, setFieldValue] = useState(intTransBool(initValue));
    const theme = useTheme();

    useEffect(() => {
        function updateInitvalue() {
            setFieldValue(intTransBool(initValue));
        }
        updateInitvalue();
    }, [initValue]);

    const handleOnBlur = async () => {
        if (!isEdit) {
            return
        }
        let newValue = boolTransInt(!fieldValue);
        setFieldValue(!fieldValue);
        pickDone(newValue, itemKey, positionID, rowIndex, errInfo);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <Checkbox.Item
                disabled={!isEdit}
                status={fieldValue ? "checked" : "unchecked"}
                key={`checkbox${itemKey}${positionID}${rowIndex}`}
                onPress={handleOnBlur}
                label={itemShowName ?? ""}
                labelStyle={{ color: props.color ? props.color : theme.colors.onSurfaceDisabled }}
            />
        </View>
    );
};

export default memo(ScCheckYesOrNo);

