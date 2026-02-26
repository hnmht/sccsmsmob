import { ReactNode, useState } from "react";
import { Surface, Text, Divider, IconButton } from "react-native-paper";
import ScCollapse from "../ScCollapse/ScCollapse";
import Icon from "@react-native-vector-icons/material-design-icons";
import { useAppSelector } from "../../store/hooks";

interface ScVoucherFootProps {
    children: ReactNode;
    isFooterErr: boolean;
    title: string;
}

function ScVoucherFooter({
    children,
    isFooterErr = false,
    title = "footer"
}: ScVoucherFootProps) {
    const [footerCollapse, setFooterCollapse] = useState(false);
    //命令按钮位置
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    return (
        <>
            <Surface key="voucherFooterDivider" style={{ flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center" }}>
                <Text variant="bodyMedium" style={{ paddingRight: 4 }}>{title}</Text>
                {
                    isFooterErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />
                }
                <Divider bold style={{ flex: 1 }} />
                <IconButton
                    mode="contained"
                    icon={footerCollapse ? "chevron-double-up" : "chevron-double-down"}
                    size={16}
                    onPress={() => setFooterCollapse(!footerCollapse)}
                />
            </Surface>
            <ScCollapse expanded={footerCollapse} style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
                {children}
            </ScCollapse>
        </>
    );
};

export default ScVoucherFooter;