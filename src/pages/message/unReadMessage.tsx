import { useState } from "react";
import { FlatList, View, Alert } from "react-native";
import { Card, Text, useTheme, Button } from "react-native-paper";
import { useAppSelector } from "../../store/hooks";
import { dayjs } from "../../i18n/i18n";

import ScInput from "../../components/ScInput";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";

import { reqToReadMsg } from "../../api/message";
import { getDynamicMessages } from "../../store/pub";
import { CommentMessage } from "../../dataType/types/message";
import { ScDataTypeList } from "../../dataType/types/scDataType";

const UnReadMessages = () => {
    const [refreshing, setRefreshing] = useState(false);
    const theme = useTheme();
    const unReadMessages = useAppSelector(state => state.dynamicData.messages);
    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    //标记信息已读
    const handleToReadMessage = async (msg: CommentMessage) => {
        setRefreshing(true);
        const res = await reqToReadMsg(msg);
        if (res.status) {
            Alert.alert("提示", "消息成功标记为已读");

        } else {
            Alert.alert("错误", "消息标记为已读失败:" + res.msg);
        }
        getDynamicMessages();
        setRefreshing(false);
    };
    //刷新
    const handleRefreshUnMessages = () => {
        setRefreshing(true);
        getDynamicMessages();

        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: CommentMessage }) => {
        return (
            <Card style={{ margin: 4 }}>
                <Card.Title
                    title={item.creator.name}
                    subtitle={dayjs(item.createDate).format("YYYY-MM-DD HH:mm:ss")}
                    left={() => <PersonAvatar url={item.creator.avatar.fileUrl} name={item.creator.name} isOffLine={isOffline} />}
                    titleMaxFontSizeMultiplier={1.5}
                    subtitleMaxFontSizeMultiplier={1.5}
                />
                <Card.Content>
                    <Text variant="bodyLarge" style={{ width: "100%", color: theme.colors.primary }}>{item.content}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>现场: {item.csaName}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>执行单号:{item.billNumber}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>行号: {item.rowNumber}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>执行项目: {item.epaName}</Text>
                    <Text variant="bodyMedium" style={{ width: "100%" }}>项目值:{item.executionValueDisp}</Text>
                    <View style={{height:68,  margin: 0, width: "100%"}}>
                        <ScInput
                            dataType={ScDataTypeList.FileUpload}
                            isOnSitePhoto={false}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="附件"
                            itemKey="edfiles"
                            initValue={item.eoFiles}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="edfiles"
                            positionID={0}
                            rowIndex={0}
                            errInfo={{isErr:false,msg:""}}
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
            keyExtractor={item => String(item.id)}
            refreshing={refreshing}
            onRefresh={handleRefreshUnMessages}
        />
    );
};

export default UnReadMessages;