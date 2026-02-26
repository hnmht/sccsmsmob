import { ReactNode, useState } from "react";
import { Surface, Text, Divider, IconButton } from "react-native-paper";
import Icon from "@react-native-vector-icons/material-design-icons";
import ScCollapse from "../ScCollapse/ScCollapse";
import { useAppSelector } from "../../store/hooks";

interface ScVoucherHeaderProps {
    children: ReactNode;
    isHeaderErr: boolean;
    title: string;
}

function ScVoucherHeader({
    children,
    isHeaderErr = false,
    title = "header"
}: ScVoucherHeaderProps
) {
    const [headerCollapse, setHeaderCollapse] = useState(true);
    //命令按钮位置
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    return (
        <>
            <Surface key="voucherHeadDivider" style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center" }}>
                <Text variant="bodyMedium" style={{ paddingRight: 4 }}>{title}</Text>
                {
                    isHeaderErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />
                }
                <Divider bold style={{ flex: 1 }} />
                <IconButton
                    mode="contained"
                    icon={headerCollapse ? "chevron-double-up" : "chevron-double-down"}
                    size={16}
                    onPress={() => setHeaderCollapse(!headerCollapse)}
                />
            </Surface>
            <ScCollapse key="voucherHeader" expanded={headerCollapse} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
                {children}
            </ScCollapse>
        </>
    );
};

export default ScVoucherHeader;

