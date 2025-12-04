import { View } from "react-native";
import { Text } from "react-native-paper";
const PrivacyText = () => {
    return (
        <>
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>第1.1版本</Text>
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>更新日期:2024年7月25日</Text>
            <Text variant="titleMedium" style={{ marginLeft: 8 }}>生效日期:2024年7月26日</Text>
            <Text variant="bodyLarge" style={{ margin: 8 }}>
                欢迎使用“Seacloud现场管理系统”!
            </Text>
            <Text variant="bodyLarge" style={{ margin: 8 }}>
                为保障你的相关权利,本隐私指引将向你说明私有化部署“seacloud现场管理系统”(以下简称“现场管理”)会如何收集、使用和存储你的个人信息及你享有何种权利。
                除本隐私指引特别说明外，现场管理使用过程中产生和收集的信息和数据均由企业用户收集和控制。
            </Text>
        </>
    )
};

export default PrivacyText;