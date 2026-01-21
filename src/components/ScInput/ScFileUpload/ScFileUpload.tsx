import { useState } from "react";
import { Modal, Alert, View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../../store/hooks";
import FilePicker from "./FilePicker";
import { ScInputProps } from "../../../dataType/types/scInput";
import { ScDataTypeList } from "../../../dataType/types/scDataType";
import { voucherFilesToFiles, filesToVoucherFiles } from "./constructions";
import { ScFile } from "../../../dataType/types/file";
import { VoucherFile } from "../../../dataType/types/voucherFile";

// 902 SeaCloud File Upload Component
const ScFileUpload = (props: ScInputProps<ScDataTypeList.FileUpload>) => {
    const { positionID, rowIndex, allowNull, isEdit, itemShowName, itemKey, initValue, pickDone, placeholder, errInfo, isOnSitePhoto, width, height, markTexts } = props;
    const { t } = useTranslation();
    const [files, setFiles] = useState(voucherFilesToFiles(initValue));
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();
    const label = allowNull ? itemShowName : "*" + itemShowName;
    // Button position
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    // Pass value to the parent component 
    const handleTransfer = async (items = files) => {
        if (!isEdit) {
            return
        }

        let oldVoucherFiles: VoucherFile[] = initValue ? initValue : [];
        let voucherFiles = filesToVoucherFiles(oldVoucherFiles, items);
        setFiles(items);
        pickDone(voucherFiles, itemKey, positionID, rowIndex, errInfo);
    };

    // Actions after click ok button in the dialog
    const handleSelectedOk = (items: ScFile[]) => {
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
                            onPress={() => Alert.alert(t("error"), errInfo.msg)}
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
                            onPress={() => Alert.alert(t("error"), errInfo.msg)}
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
                    isOnSitePhoto={isOnSitePhoto ?? false}
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

