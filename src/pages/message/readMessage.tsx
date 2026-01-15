import { useState, useMemo } from "react";
import { View, Alert, FlatList, Modal } from "react-native";
import { Text, Card, useTheme, IconButton } from "react-native-paper";
import { useSelector } from "react-redux";
// import dayjs from "dayjs";
import dayjs from "../../utils/myDayjs";

import ScInput from "../../components/ScInput";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import { generateMSGQueryFields, generateMsgDefaultCons } from "./constructor";
import { reqReadComments } from "../../api/message";

const ReadMessage = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [conditions, setConditions] = useState(generateMsgDefaultCons());
    const [readMsgs, setReadMsgs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const queryFields = useMemo(generateMSGQueryFields, []);
    const theme = useTheme();
    const isOffline = useSelector(state => state.appinfo.isoffline);
    const handleGetValue = (value, itemKey, positionID, rowIndex, err) => {
        setShowDialog(false);
        setConditions(value);
        //向服务器请求数据
        handleReqReadMsgs(value);
    };
    //请求已读消息
    const handleReqReadMsgs = async (cons = conditions) => {
        setRefreshing(true);
        let queryString = transConditionsToString(cons);
        let res = await reqReadComments({ queryString: queryString });
        let newRows = [];
        if (res.data.status === 0 && res.data.data != null) {
            newRows = res.data.data;
        } else {
            Alert.alert("错误", res.data.statusMsg);
        }
        setReadMsgs(newRows);
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
            </Card>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ minHeight: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="bodyLarge" maxFontSizeMultiplier={1}>共{readMsgs.length}条</Text>
                <IconButton onPress={() => setShowDialog(true)} icon="filter-variant" maxFontSizeMultiplier={false} iconColor={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={readMsgs}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    refreshing={refreshing}
                    onRefresh={handleReqReadMsgs}
                />
            </View>
            <Modal
                visible={showDialog}
                onDismiss={() => setShowDialog(false)}
            >
                <QueryPanel
                    onCancel={() => setShowDialog(false)}
                    title="过滤条件"
                    queryFields={queryFields}
                    initalConditions={conditions}
                    onOk={handleGetValue}
                />
            </Modal>
        </View>
    );
};

export default ReadMessage;