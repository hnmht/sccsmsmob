import { memo, useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { ScDataTypeList, ScInputProps } from "../../../dataType/types/scInput";

const genders = ["", "male", "female"];

//401 Seacloud Gender Select Component
const ScSelectGender = (props: ScInputProps<ScDataTypeList.Gender>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = true,
        isEdit = false,
        itemShowName = "",
        placeholder = "",
        itemKey,
        initValue = 0,
        pickDone,
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68
    } = props;
    const [fieldValue, setFieldValue] = useState(initValue);
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const theme = useTheme();
    const label = allowNull ? itemShowName : "*" + itemShowName;
    useEffect(() => {
        function updateInitvalue() {
            setFieldValue(initValue);
        }
        updateInitvalue();
    }, [initValue]);

    // Passing data to the parent component
    const handleTransfer = async (value = fieldValue) => {
        if (!isEdit) {
            return
        }
        setVisible(false);

        setFieldValue(value);
        pickDone(value, itemKey, positionID, rowIndex, errInfo);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
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
                        label={label}
                        placeholder={isEdit ? placeholder : ""}
                        editable={false}
                        disabled={!isEdit}
                        value={t(genders[fieldValue])}
                        error={errInfo.isErr}
                        left={errInfo.isErr
                            ? <TextInput.Icon
                                icon="alert"
                                color={theme.colors.error}
                                onPress={() => Alert.alert(t("error"), errInfo.msg)}
                                disabled={!isEdit}
                            />
                            : null}
                        right={
                            <TextInput.Icon
                                icon="gender-male-female-variant"
                                color={isEdit ? theme.colors.primary : theme.colors.onBackground}
                                onPress={() => setVisible(true)}
                                disabled={!isEdit}
                            />
                        }
                        style={{ width: "100%" }}
                    />

                }
            >
                <Menu.Item onPress={() => handleTransfer(0)} title="" />
                <Menu.Item onPress={() => handleTransfer(1)} title={t("male")} />
                <Menu.Item onPress={() => handleTransfer(2)} title={t("female")} />
            </Menu>
        </View>
    );
}

export default memo(ScSelectGender);