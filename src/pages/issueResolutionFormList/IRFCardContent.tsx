import { Card, MD3Theme, Text } from "react-native-paper";
import { View } from "react-native";
import { DateTimeFormat } from "../../i18n/dayjs";
import { VoucherStatus } from "../../constant/voucherStatus";
import { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { TFunction } from "i18next";

interface IRFCardContentProps {
    irf: IssueResolutionForm;
    isLocal: boolean;
    t: TFunction;
    theme: MD3Theme;
}

function IRFCardContent({ irf, isLocal, t, theme }: IRFCardContentProps) {
    return (
        <Card.Content key={`ddcardcontent${irf.id}`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
            <Text variant="titleMedium" style={{ width: "100%" }}>编号:{isLocal ? `LD${irf.id}` : irf.billNumber}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>状态:{VoucherStatus[irf.status]}</Text>
            <Text variant="titleMedium" style={{ width: "100%" }}>现场: {irf.csa.name}</Text>
            <Text variant="titleSmall" style={{ width: "100%" }}>问题项目: {irf.epa.name}</Text>
            <View style={{ width: "100%", height: 24, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                <Text variant="bodyMedium" maxFontSizeMultiplier={1.4} selectable>风险等级:{irf.riskLevel.name} </Text>
                <View style={{ height: "100%", width: 48, backgroundColor: irf.riskLevel.color, borderRadius: 8 }}></View>
            </View>
            <Text variant="titleSmall" style={{ width: "100%" }}>问题值: {irf.executionValueDisp}</Text>
            <Text variant="titleSmall" style={{ width: "100%" }}>问题备注: {irf.eoDescription}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>单据日期: {DateTimeFormat(irf.billDate, "LL")}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>制单人: {irf.creator.name}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>开始时间: {DateTimeFormat(irf.startTime, "LLL")}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>结束时间: {DateTimeFormat(irf.endTime, "LLL")}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>处理备注:{irf.description}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>部门: {irf.department.name}</Text>
            <Text variant="titleSmall" style={{ width: "100%" }}>来源单据类型: {irf.sourceType}</Text>
            <Text variant="titleSmall" style={{ width: "100%" }}>来源单据号: {irf.sourceBillNumber}</Text>
            <Text variant="titleSmall" style={{ width: "100%" }}>来源行号: {irf.sourceRowNumber}</Text>
        </Card.Content>
    );
};

export default IRFCardContent;