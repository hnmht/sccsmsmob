import { memo, useState, useEffect } from "react";
import { View, Modal, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

import { useAppSelector } from "../../../store/hooks";
import DeptPicker from "./DeptPicker";
import DeptDetail from "./DeptDetail";
import { ScDataTypeList, ScInputProps } from "../../../dataType/types/scInput";
import { getEmptySimpDept } from "../../../dataType/dataZero/department";
import { SimpDept } from "../../../dataType/types/department";
import { useTranslation } from "react-i18next";

const zeroValue = getEmptySimpDept();
// 520 Seacloud SimpDept Select Component
const ScDeptSelect = (props: ScInputProps<ScDataTypeList.SimpDept>) => {
    const {
        positionID = 0,
        rowIndex = 0,
        allowNull = true,
        isEdit = false,
        itemShowName = "",
        itemKey,
        initValue = zeroValue,
        pickDone,
        placeholder,
        errInfo = { isErr: false, msg: "" },
        width = "100%",
        height = 68
    } = props;
    const [currentDept, setCurrentDept] = useState(initValue);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const theme = useTheme();
    const label = allowNull ? itemShowName : "*" + itemShowName;
    const { t } = useTranslation();
    //命令按钮位置
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    useEffect(() => {
        setCurrentDept(initValue);
    }, [initValue]);

    //检查值及向父组件传递数据
    const handleTransfer = async (doc = currentDept) => {
        if (!isEdit) {
            return
        }
        pickDone(doc, itemKey, positionID, rowIndex, errInfo);
    };

    //对话框取消
    const handleCancelAction = () => {
        setDialogOpen(false);
    };
    //对话框确认
    const handlePressItemAction = (item: SimpDept) => {
        setCurrentDept(item);
        handleTransfer(item);
        setDialogOpen(false);
    };
    //点击清除按钮
    const handleClear = () => {
        if (!allowNull) {
            return
        }
        setCurrentDept(zeroValue);
        handleTransfer(zeroValue);
    };

    return (
        <View id={`view${itemKey}${positionID}${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                id={`textinput${itemKey}${positionID}${rowIndex}`}
                mode="outlined"
                keyboardType="default"
                label={label}
                placeholder={isEdit ? placeholder : ""}
                editable={false}
                disabled={!isEdit}
                value={currentDept.name}
                error={errInfo.isErr}
                left={buttonPosition === "right"
                    ? errInfo.isErr
                        ? <TextInput.Icon
                            icon="alert"
                            color={theme.colors.error}
                            onPress={() => Alert.alert("错误", errInfo.msg)}
                        />
                        : null
                    : <TextInput.Icon
                        icon="office-building"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setDialogOpen(true) : () => setDetailOpen(true)}
                        onLongPress={isEdit ? () => handleClear() : () => { }}
                    />
                }
                right={buttonPosition === "left"
                    ? errInfo.isErr
                        ? <TextInput.Icon
                            icon="alert"
                            color={theme.colors.error}
                            onPress={() => Alert.alert("错误", errInfo.msg)}
                        />
                        : null
                    : <TextInput.Icon
                        icon="office-building"
                        color={isEdit ? theme.colors.primary : theme.colors.secondary}
                        onPress={isEdit ? () => setDialogOpen(true) : () => setDetailOpen(true)}
                        onLongPress={isEdit ? () => handleClear() : () => { }}
                    />

                }
                style={{ width: "100%" }}
            />
            <Modal
                visible={dialogOpen}
                id={`modal${itemKey}${positionID}${rowIndex}`}
            >
                <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
                    <DeptPicker
                        cancelAction={handleCancelAction}
                        pressItemAction={handlePressItemAction}
                        currentItem={currentDept}
                        t={t}
                    />
                </View>
            </Modal>
            {isEdit
                ? null
                : <DeptDetail
                    currentItem={currentDept}
                    visible={detailOpen}
                    backAction={() => setDetailOpen(false)}
                    t={t}
                />
            }
        </View>
    );
};

export default memo(ScDeptSelect);