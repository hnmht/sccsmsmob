import { useState } from "react";
import { FlatList, View, Alert } from "react-native";
import { Card, Text, useTheme, Button } from "react-native-paper";
import { useSelector } from "react-redux";
// import dayjs from "dayjs";
import dayjs from "../../utils/myDayjs";

import ScInput from "../../components/ScInput";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";

import { reqToReadMsg } from "../../api/message";
import { getDyanmincMessages } from "../../store/pub";


const UnReadMessages = (props) => {
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();
    const unReadMessages = useSelector(state => state.dynamicdata.messages);
    const isOffline = useSelector(state => state.appinfo.isoffline);
    //标记信息已读
    const handleToReadMessage = async (msg) => {
        setRefreshing(true);
        const res = await reqToReadMsg(msg);
        if (res.data.status === 0) {
            Alert.alert("提示", "消息成功标记为已读");

        } else {
            Alert.alert("错误", "消息标记为已读失败:" + res.data.statusMsg);
        }
        getDyanmincMessages();
        setRefreshing(false);
    };
    //刷新
    const handleRefreshUnMessages = () => {
        setRefreshing(true);
        getDyanmincMessages();
        setRefreshing(false);
    };

    const renderItem = ({ item }) => {
        return (
            <Card style={{ margin: 4 }}>
                <Card.Title
                    title={item.createuser.name}
                    subtitle={dayjs(item.createdate).format("YYYY-MM-DD HH:mm:ss")}
                    left={() => <PersonAvatar url={item.createuser.avatar.fileurl} name={item.createuser.name} isOffLine={isOffline} />}
                    titleMaxFontSizeMultiplier={1.5}
                    subtitleMaxFontSizeMultiplier={1.5}
                />
                <Card.Content>
                    <Text variant="bodyLarge" style={{ width: "100%", color: theme.colors.primary }}>{item.content}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>现场: {item.siname}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>执行单号:{item.billnumber}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>行号: {item.rownumber}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>执行项目: {item.eidname}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>项目值:{item.exectivevaluedisp}</Text>
                    <View style={{ height: 62, margin: 0, width: "100%" }}>
                        <ScInput
                            dataType={902}
                            isOnSitePhoto={false}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="附件"
                            itemKey="edfiles"
                            initValue={item.edfiles}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="edfiles"
                            positionID={1}
                            rowIndex={-1}
                        />
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button mode="text" onPress={() => handleToReadMessage(item)} loading={refreshing} disabled={refreshing} >已读</Button>
                </Card.Actions>
            </Card>
        );
    };

    return (
        <FlatList
            data={unReadMessages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            refreshing={refreshing}
            onRefresh={handleRefreshUnMessages}
        />
    );
};

export default UnReadMessages;