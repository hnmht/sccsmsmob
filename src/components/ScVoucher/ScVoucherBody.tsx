import { useState, ReactNode, ComponentType } from "react";
import { View } from "react-native";
import { Surface, Text, Divider, IconButton, Button, useTheme, Menu } from "react-native-paper";
import Icon from "@react-native-vector-icons/material-design-icons";
import { checkObjectError } from "../tools/checkError";
import { useAppSelector } from "../../store/hooks";
import { ToErrorType } from "../../dataType/types/errors";

interface ScVoucherBodyProps<T> {
    children: ReactNode;
    isBodyErr: boolean;
    isEdit: boolean;
    addRowAction: () => void,
    voucherBodyData: T[],
    errorBodyData: ToErrorType<T>[],
    MenuItem: ComponentType<{
        row: T;
        index: number;
        isErr: boolean;
        selectRowAction: (index: number) => void;
    }>;
    currentRowIndex: number,
    setCurrentRowIndex: (index: number) => void,
    addRowDisabled: boolean;
}

function ScVoucherBody<T>({
    children,
    isBodyErr,
    isEdit,
    addRowAction,
    voucherBodyData,
    errorBodyData,
    MenuItem,
    currentRowIndex = 0,
    setCurrentRowIndex,
    addRowDisabled = false,
}: ScVoucherBodyProps<T>) {
    const theme = useTheme();
    const [rowMenuVisible, setRowMenuVisible] = useState(false);
    //命令按钮位置
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    //前一行
    const handlePrevRow = () => {
        setCurrentRowIndex(currentRowIndex - 1);
    };
    //首行
    const handleFirstRow = () => {
        setCurrentRowIndex(0);
    };
    //后一行
    const handleNextRow = () => {
        setCurrentRowIndex(currentRowIndex + 1);
    };
    //末行
    const handleLastRow = () => {
        setCurrentRowIndex(voucherBodyData.length - 1);
    };

    //选择定位行
    const handleSelectRow = (index: number) => {
        setCurrentRowIndex(index);
        setRowMenuVisible(false);
    };

    return (
        <>
            <Surface key="voucherBodyDivider" style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center" }}>
                <Text variant="bodyMedium" style={{ paddingRight: 4 }}>表体</Text>
                {
                    isBodyErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />
                }
                <Divider bold style={{ flex: 1 }} />
                {isEdit
                    ? < Button
                        onPress={addRowAction}
                        key={"addRow"}
                        icon="playlist-plus"
                        textColor={theme.colors.primary}
                        disabled={addRowDisabled}
                    >
                        增行
                    </Button>
                    : null
                }
                <Menu
                    visible={rowMenuVisible}
                    onDismiss={() => setRowMenuVisible(false)}
                    anchor={
                        <Button
                            onPress={() => setRowMenuVisible(true)}
                            icon="select"
                            textColor={isBodyErr ? "red" : theme.colors.primary}
                            disabled={voucherBodyData.length <= 0}
                        >
                            定位行
                        </Button>
                    }>
                    {voucherBodyData.map((row, index) => {
                        const isErr = checkObjectError(errorBodyData[index]);
                        return (
                            <MenuItem
                                key={`menuitem${index}`}
                                row={row}
                                index={index}
                                isErr={isErr}
                                selectRowAction={handleSelectRow}
                            />
                        );
                    })}
                </Menu>
            </Surface>
            <View key="voucherBody" style={{ flex: 1 }}>
                <View key="voucherBodyAction2" style={{ height: 40, flexDirection: buttonPosition === "right" ? "row-reverse" : "row", justifyContent: "flex-start", alignItems: "center", padding: 4 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <IconButton
                            key={"FirstRow"}
                            onPress={handleFirstRow}
                            disabled={currentRowIndex === 0 || voucherBodyData.length === 0}
                            icon="chevron-double-left"
                            iconColor={theme.colors.primary} />
                        <IconButton
                            key={"PrevRow"}
                            onPress={handlePrevRow}
                            disabled={currentRowIndex === 0 || voucherBodyData.length === 0}
                            icon="chevron-left"
                            iconColor={theme.colors.primary} />
                        <IconButton
                            key={"NextRow"}
                            onPress={handleNextRow}
                            disabled={voucherBodyData.length - 1 === currentRowIndex || voucherBodyData.length === 0}
                            icon="chevron-right"
                            iconColor={theme.colors.primary} />
                        <IconButton
                            key={"LastRow"}
                            onPress={handleLastRow}
                            disabled={voucherBodyData.length - 1 === currentRowIndex || voucherBodyData.length === 0}
                            icon="chevron-double-right"
                            iconColor={theme.colors.primary} />
                    </View>
                    <Text>{voucherBodyData.length === 0 ? "0/0" : `${currentRowIndex + 1}/${voucherBodyData.length}`}</Text>
                </View>
                <View key={`voucherBodyRow${currentRowIndex}`} style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {children}
                </View>
            </View>
        </>
    );
};

export default ScVoucherBody;

