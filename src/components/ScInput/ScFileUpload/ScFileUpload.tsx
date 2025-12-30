import { useState } from "react";
import { View, Modal, Alert } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

import { useAppSelector } from "../../../store/hooks";
import FilePicker from "./FilePicker";
import { ScDataTypeList, ScInputProps } from "../../../dataType/types/scInput";
import { voucherFilesToFiles, filesToVoucherFiles } from "./constructions";
import { File } from "../../../dataType/types/file";
import { VoucherFile } from "../../../dataType/types/voucherFile";
import { getEmptyErrMsg } from "../../../dataType/dataZero/scInput";

//902 文件上传
const ScFileUpload = (props: ScInputProps<ScDataTypeList.FileUpload>) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, errInfo, isOnSitePhoto, width, height, markTexts } = props;
    const [files, setFiles] = useState(voucherFilesToFiles(initValue));
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();
    const label = allowNull ? itemShowName : "*" + itemShowName;
    //命令按钮位置
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    //向父组件传递数据
    const handleTransfer = async (items = files) => {
        if (!isEdit) {
            return
        }

        let oldVoucherFiles: VoucherFile[] = initValue ? initValue : [];
        let voucherFiles = filesToVoucherFiles(oldVoucherFiles, items);
        setFiles(items);
        pickDone(voucherFiles, itemKey, positionID, rowIndex, errInfo);
    };

    //对话框点击ok按钮
    const handleSelectedOk = (items: File[]) => {
        setDialogOpen(false);
        handleTransfer(items);
    };

    return (
        <View id={`View${itemKey}-p${positionID}-r${rowIndex}`} style={{ width: width, height: height, padding: 2 }}>
            <TextInput
                id={`TextInput${itemKey}-p${positionID}-r${rowIndex}`}
                mode="outlined"
                keyboardType="default"
                label={label}
                placeholder={isEdit ? placeholder : ""}
                editable={false}
                disabled
                value={`${files.length}`}
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
                        icon="paperclip"
                        color={isEdit ? theme.colors.primary : theme.colors.onBackground}
                        onPress={() => setDialogOpen(true)}
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
                        icon="paperclip"
                        color={isEdit ? theme.colors.primary : theme.colors.onBackground}
                        onPress={() => setDialogOpen(true)}
                    />

                }
                style={{ width: "100%" }}
            />
            <Modal
                key={`modal${itemKey}-p${positionID}-r${rowIndex}`}
                visible={dialogOpen}
            >
                <FilePicker
                    key={`filepicker${itemKey}-p${positionID}-r${rowIndex}`}
                    isOnSitePhoto={false}
                    isEdit={isEdit}
                    initFiles={files}
                    onCancel={() => setDialogOpen(false)}
                    onOk={handleSelectedOk}
                    markTexts={markTexts ? markTexts : []}
                />
            </Modal>
        </View>
    );
};

export default ScFileUpload;

