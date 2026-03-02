import { useState } from "react";
import { MD3Theme, Menu, Button } from "react-native-paper";
import { WOErrors, WorkOrderRow } from "../../dataType/types/workOrder";
import Icon from "@react-native-vector-icons/material-design-icons";
import { TFunction } from "i18next";
import { checkObjectError } from "../../components/tools/checkError";

interface WoBodyMenuProps {
    woErrors: WOErrors;
    woRows: WorkOrderRow[];
    setCurrentRowIndex: (index: number) => void;
    theme: MD3Theme;
    t: TFunction;    
}

const WOBodyMenu = ({ woErrors, woRows, setCurrentRowIndex, theme, t }: WoBodyMenuProps) => {
    const [rowMenuVisible, setRowMenuVisible] = useState<boolean>(false);
    const handleSelectRow = (index: number) =>{
        setRowMenuVisible(false);
        setCurrentRowIndex(index);
    }
    return (woRows === undefined
        ? null
        : <Menu
            visible={rowMenuVisible}
            onDismiss={() => setRowMenuVisible(false)}
            anchor={
                < Button
                    onPress={() => setRowMenuVisible(true)}
                    icon="select"
                    textColor={woErrors.isBodyErr ? "red" : theme.colors.primary}
                    disabled={woRows.length <= 0}
                >
                    定位行
                </Button>
            }>
            {woRows.map((row, index) => {
                const isErr = checkObjectError(woErrors.body[index]);
                return (
                    <Menu.Item
                        leadingIcon={() => isErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />}
                        key={row.rowNumber}
                        onPress={() => handleSelectRow(index)}
                        title={`第${row.rowNumber}行 ${row.csa.name}`}
                        style={{ width: "90%" }}
                        titleStyle={{ width: "100%" }}
                    />
                )
            })
            }
        </Menu>
    );
};

export default WOBodyMenu;