import { Card, Text } from "react-native-paper";
// import dayjs from "dayjs";
import dayjs from "../../utils/myDayjs";
import { VoucherStatus } from "../../utils/pub";
import { pubParams } from "../../components/pub/pubParms";

const WOCardContent = ({ wo, isLocal }) => {
    return (
        <Card.Content key={`wocardcontent${wo.id}`} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
            <Text variant="titleMedium" style={{ width: pubParams.screen.isOverSize ? "100%" : "60%" }}>编号:{isLocal ? `LW${wo.id}` : wo.billnumber}</Text>
            {isLocal
                ? <Text variant="titleSmall" style={{ width: pubParams.screen.isOverSize ? "100%" : "40%" }}>行数:{wo.body.length}</Text>
                : null
            }
            <Text variant="titleSmall" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>作业日期:{dayjs(wo.workdate).format("YYYY-MM-DD")}</Text>
            <Text variant="bodyMedium" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>状态:{VoucherStatus[wo.status]}</Text>
            <Text variant="titleSmall" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>单据日期:{dayjs(wo.billdate).format("YYYY-MM-DD")}</Text>
            <Text variant="bodyMedium" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>制单人:{wo.createuser.name}</Text>
            <Text variant="bodyMedium" style={{ width: pubParams.screen.isOverSize ? "100%" : "50%" }}>部门:{wo.department.name}</Text>
            <Text variant="bodyMedium" style={{ width: "100%" }}>备注:{wo.description}</Text>
        </Card.Content>
    );
};

export default WOCardContent;