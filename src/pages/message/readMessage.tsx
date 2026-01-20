import { useState, useMemo } from "react";
import { View, Alert, FlatList, Modal } from "react-native";
import { Text, Card, useTheme, IconButton } from "react-native-paper";
import { useAppSelector } from "../../store/hooks";

import { dayjs } from "../../i18n/i18n";
import ScInput from "../../components/ScInput";
import PersonAvatar from "../../components/PersonAvatar/PersonAvatar";
import { QueryPanel, transConditionsToString } from "../../components/QueryPanel";
import { generateMSGQueryFields, generateMsgDefaultCons } from "./constructor";
import { reqReadComments } from "../../api/message";
import { CommentMessage } from "../../dataType/types/message";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import { Condition } from "../../dataType/types/queryPanel";


const ReadMessage = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [conditions, setConditions] = useState(generateMsgDefaultCons());
    const [readMsgs, setReadMsgs] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const queryFields = useMemo(generateMSGQueryFields, []);
    const theme = useTheme();
    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    const handleGetValue = (value, itemKey, positionID, rowIndex, err) => {
        setShowDialog(false);
        setConditions(value);
        //向服务器请求数据
        handleReqReadMsgs(value);
    };
    //请求已读消息
    const handleReqReadMsgs = async (cons :Condition[]= conditions) => {
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
                    <View style={{ height: 68, margin: 0, width: "100%" }}>
                        <ScInput
                            dataType={ScDataTypeList.FileUpload}
                            isOnSitePhoto={false}
                            allowNull={true}
                            isEdit={false}
                            itemShowName="附件"
                            itemKey="eoFiles"
                            initValue={item.eoFiles}
                            pickDone={() => { }}
                            isBackendTest={false}
                            key="eoFiles"
                            positionID={0}
                            rowIndex={0}
                            errInfo={{ isErr: false, msg: "" }}
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
                <IconButton onPress={() => setShowDialog(true)} icon="filter-variant" iconColor={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={readMsgs}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id) }
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