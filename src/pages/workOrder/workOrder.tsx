import { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text, ActivityIndicator, IconButton, useTheme, Button, Menu, Surface, AnimatedFAB } from "react-native-paper";
import Icon from "@react-native-vector-icons/material-design-icons";

// import ScSwapButton from "../../components/ScSwapButton/ScSwapButton";
import ScInput from "../../components/ScInput";
import { ScVoucherHeader, ScVoucherFooter, ScVoucherBody } from "../../components/ScVoucher";
import { multiSortByArr } from "../../components/tools/sort";
import { getInitialValue, checkWOErrors, transWOToBackend } from "./constructor";
import { checkObjErrors, checkVouchBodyErrors } from "../../utils/pub";
import { reqEditWO, reqAddWO } from "../../api/workOrder";
import { cloneDeep } from "lodash";
import { pubParams } from "../../components/pub/pubParams";
import { useAppSelector } from "../../store/hooks";
import { useBusinessNavigation, useBusinessRoute } from "../../navigation/config/screenParams";
import { getDefaultWorkOrderRow } from "../../dataType/dataZero/workOrder";
import { WorkOrder } from "../../dataType/types/workOrder";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import { WORepo } from "../../db/crud/workorder";

const EditWorkOrder = () => {
    const navigation = useBusinessNavigation();
    const route = useBusinessRoute();
    const { isLocal, isNew, isModify, oriWO, refreshAction } = (route.params as any) || {};
    const { person, department } = useAppSelector(state => state.user);
    const isOffLine = useAppSelector(state => state.appInfo.isOffline);
    const [voucherData, setVoucherData] = useState<WorkOrder | undefined>((undefined));
    const [deletedRows, setDeletedRows] = useState([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);

    const isEdit = !(!isModify && !isNew);
    const canTempSave = isLocal ? true : isModify ? false : true;
    const isOverSize = pubParams.screen.isOverSize;
    //命令按钮位置
    const { buttonPosition, orderPosition, orderVisible } = useAppSelector(state => state.swapPosition);
    const dataErrs = useMemo(() => checkWOErrors(voucherData), [voucherData]);
    const isHeaderErr = useMemo(() => checkObjErrors(dataErrs), [dataErrs]);
    const isBodyErr = useMemo(() => checkVouchBodyErrors(dataErrs), [dataErrs])
    const theme = useTheme();

    const MenuItem = ({ row, index, isErr, selectRowAction }) => {
        return (<Menu.Item
            leadingIcon={() => isErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />}
            key={row.rowNumber}
            onPress={() => selectRowAction(index)}
            title={`第${row.rowNumber}行 ${row.sceneitem.name}`}
            style={{ width: "90%" }}
            titleStyle={{ width: "100%" }}
        />);
    };

    useEffect(() => {
        async function initVoucher() {
            const newWO = await getInitialValue(oriWO, isNew, isModify, person, department);
            setVoucherData(newWO);
        }
        initVoucher();
    }, [oriWO, isModify, isNew]);

    //获取值以后的操作
    const handleGetValue = async  <T extends keyof InitialValueMap>(
        value: InitialValueMap[T],
        itemkey: string,
        positionID: 0 | 1 | 2,
        rowIndex: number,
        errMsg: ErrMsg
    ) => {
        if (voucherData === undefined || !isEdit) {
            return
        }
        //设置单据值
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0://修改表头字段
                    newData[itemkey] = value;
                    break;
                case 1://如果修改的是表体字段                                       
                    newData.body[rowIndex][itemkey] = value;
                    break;
                case 2:
                    newData[itemkey] = value;
                    break;
                default:
                    break;
            }
            return newData;
        });

    };
    //增行
    const handleAddRow = () => {
        if (voucherData === undefined) {
            return
        }
        //生成数据
        const newVoucherData = cloneDeep(voucherData);
        let newRow = getDefaultWorkOrderRow(newVoucherData?.creator, newVoucherData?.department, newVoucherData?.createDate);
        //自动生成行号
        if (newVoucherData.body.length === 1) { //如果表体只有一行
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(multiSortByArr([{ field: "rowNumber", order: "asc" }]));
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        //自动填写开始时间和结束时间
        if (newVoucherData.workDate !== "") {
            newRow.startTime = newVoucherData.workDate + "0800";
            newRow.endTime = newVoucherData.workDate + "1800";
        } else {
            newRow.startTime = dayjs(new Date()).format("YYYYMMDD") + "0800";
            newRow.endTime = dayjs(new Date()).format("YYYYMMDD") + "1800";
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        setCurrentRowIndex(newVoucherData.body.length - 1);
    };
    //复制增行
    const handleCopyAddRow = () => {
        if (voucherData === undefined) {
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherData.body[currentRowIndex]);

        //自动生成行号
        if (newVoucherData.body.length === 1) { //如果表体只有一行
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(multiSortByArr([{ field: "rowNumber", order: "asc" }]));
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        //修改复制行的id和hid
        newRow.id = 0;
        newRow.hid = 0;

        if (newVoucherData.workDate !== "") {
            newRow.startTime = newVoucherData.workDate + "0800";
            newRow.endTime = newVoucherData.workDate + "1800";
        } else {
            newRow.startTime = dayjs(new Date()).format("YYYYMMDD") + "0800";
            newRow.endTime = dayjs(new Date()).format("YYYYMMDD") + "1800";
        }
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        setCurrentRowIndex(newVoucherData.body.length - 1);
    };
    //删行
    const handleDeleteRow = () => {
        if (voucherData === undefined) {
            return
        }
        if (voucherData.body.length === 1) {
            Alert.alert("提示", "不能删除最后一行!");
            return
        }
        const newVoucherData = cloneDeep(voucherData);
        const newDeletedRows = cloneDeep(deletedRows);
        let row = newVoucherData.body[currentRowIndex];
        let newRowIndex = currentRowIndex;
        if (isModify) {
            //判断是否在编辑状态下新增的行
            if (row.id === 0) {
                newVoucherData.body.splice(currentRowIndex, 1);//新增的行直接删除掉
            } else {
                newVoucherData.body[currentRowIndex].dr = 1;  //原有行修改删除标志
                newDeletedRows.push(newVoucherData.body[currentRowIndex]); //将已经删除的行暂存
                newVoucherData.body.splice(currentRowIndex, 1); //删除原有行
            }
        } else {
            //新增状态下直接删除行
            newVoucherData.body.splice(currentRowIndex, 1);
        }

        if (newRowIndex > (newVoucherData.body.length - 1)) {
            newRowIndex = newVoucherData.body.length - 1;
        }
        setDeletedRows(newDeletedRows);
        setVoucherData(newVoucherData);
        setCurrentRowIndex(newRowIndex);
    };

    //取消
    const handleCancel = () => {
        if (refreshAction !== undefined) {
            refreshAction();
        }
        navigation.goBack();
    };

    //上传指令单
    const handleUploadWO = async () => {
        if (voucherData === undefined) {
            return
        }
        let newWO = cloneDeep(voucherData);
        if (isModify && deletedRows.length > 0) {
            newWO.body.push(...deletedRows);
        }
        //转换数据到后端格式
        const thisWO = transWOToBackend(newWO);

        if (isModify) {
            if (isLocal) { //编辑状态下本地单据上传
                let localID = thisWO.id;
                thisWO.id = 0;
                delete thisWO.isHeaderErr
                delete thisWO.isBodyErr
                let addRes = await reqAddWO(thisWO);
                if (addRes.data.status === 0) {
                    WORepo.delVoucher(voucherData)
                    Alert.alert("提示", `本地指令单L${localID}上传成功,单据编号:${addRes.data.data.billnumber}`);
                } else {
                    Alert.alert("错误", `本地指令单L${localID}上传失败:${addRes.data.statusMsg}`);
                    return
                }
            } else { //编辑远程单据
                let editRes = await reqEditWO(thisWO);
                if (editRes.data.status === 0) {
                    Alert.alert("提示", "修改编号" + thisWO.billnumber + "指令单成功!");
                } else {
                    Alert.alert("错误", "修改编号" + thisWO.billnumber + "指令单失败:" + editRes.data.statusMsg);
                }
            }

        } else {
            let addRes = await reqAddWO(thisWO);
            if (addRes.data.status === 0) {
                Alert.prompt("提示", "新增指令单成功,单据编号:" + addRes.data.data.billnumber);
            } else {
                Alert.alert("错误", "新增指令单失败" + addRes.data.statusMsg);
            }
        }
        if (refreshAction !== undefined) {
            refreshAction();
        }
        navigation.goBack();
    };

    //暂存指令单
    const handleTempSave = () => {
        if (voucherData === undefined) {
            return
        }
        let newVoucherData = cloneDeep(voucherData);
        //记录单据是否存在错误
        newVoucherData.isHeaderErr = isHeaderErr;
        newVoucherData.isBodyErr = isBodyErr;

        //暂存单据
        if (isModify) { //是否编辑
            if (isLocal) {
                WORepo.editVoucher(newVoucherData);
            } else { //远程单据编辑不允许暂存
                Alert.alert("错误", "编辑远程单据时不允许暂存!");
            }

        } else { //非编辑状态
            WORepo.saveVoucher(newVoucherData, person.id)
        }

        if (refreshAction !== undefined) {
            refreshAction();
        }
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1 }}>
            <Surface key="voucherTitle" style={{ height: 42, alignItems: "center", justifyContent: "center" }}>
                <Text variant="titleLarge" maxFontSizeMultiplier={1.2}>指令单</Text>
            </Surface>
            {voucherData !== undefined
                ? <View style={{ flex: 1 }}>
                    <ScrollView>
                        <ScVoucherHeader isHeaderErr={isHeaderErr} title="表头">
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="单据编号"
                                itemKey="billnumber"
                                initValue={isLocal ? `L${voucherData.id}` : voucherData.billnumber}
                                placeholder="自动编号"
                                isBackendTest={false}
                                key="billnumber"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="单据日期"
                                itemKey="billdate"
                                initValue={voucherData.billdate}
                                pickDone={handleGetValue}
                                placeholder=""
                                isBackendTest={false}
                                key="billdate"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={520}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="部门"
                                itemKey="department"
                                initValue={voucherData.department}
                                pickDone={handleGetValue}
                                placeholder="请选择部门"
                                isBackendTest={false}
                                key="department"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={306}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="作业日期"
                                itemKey="workDate"
                                initValue={voucherData.workDate}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="workDate"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={405}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="状态"
                                itemKey="status"
                                initValue={voucherData.status}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="status"
                                positionID={0}
                                rowIndex={-1}
                                color="warning"
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="备注"
                                itemKey="description"
                                initValue={voucherData.description}
                                pickDone={handleGetValue}
                                placeholder="请输入备注"
                                isBackendTest={false}
                                key="description"
                                positionID={0}
                                rowIndex={-1}
                                rowNumber={2}
                                width="100%"
                            />
                        </ScVoucherHeader>
                        <ScVoucherBody
                            isBodyErr={isBodyErr}
                            isEdit={isEdit}
                            addRowAction={handleAddRow}
                            voucherBodyData={voucherData.body}
                            errorBodyData={dataErrs.body}
                            MenuItem={MenuItem}
                            currentRowIndex={currentRowIndex}
                            setCurrentRowIndex={setCurrentRowIndex}
                        >
                            {voucherData.body[currentRowIndex].dr === 0
                                ? <>
                                    <View style={{ width: "100%", minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                                        <IconButton onPress={handleCopyAddRow} icon="content-copy" iconColor={theme.colors.primary} disabled={!isEdit} />
                                        <IconButton onPress={handleDeleteRow} icon="playlist-remove" iconColor={theme.colors.error} disabled={!isEdit} />
                                    </View>
                                    <ScInput
                                        dataType={302}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="行号"
                                        itemKey="rowNumber"
                                        initValue={voucherData.body[currentRowIndex].rowNumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="rowNumber"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"50%"}
                                    />
                                    <ScInput
                                        dataType={405}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="状态"
                                        itemKey="status"
                                        initValue={voucherData.body[currentRowIndex].status}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="status"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"50%"}
                                    />
                                    <ScInput
                                        dataType={570}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="现场"
                                        itemKey="sceneitem"
                                        initValue={voucherData.body[currentRowIndex].sceneitem}
                                        errInfo={dataErrs.body[currentRowIndex].sceneitem}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="sceneitem"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="说明"
                                        itemKey="description"
                                        initValue={voucherData.body[currentRowIndex].description}
                                        pickDone={handleGetValue}
                                        placeholder="请输入说明"
                                        isBackendTest={false}
                                        key="description"
                                        positionID={1}
                                        rowNumber={2}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={510}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="执行人"
                                        itemKey="execperson"
                                        initValue={voucherData.body[currentRowIndex].execperson}
                                        errInfo={dataErrs.body[currentRowIndex].execperson}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="execperson"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={580}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="执行模板"
                                        itemKey="eit"
                                        initValue={voucherData.body[currentRowIndex].eit}
                                        errInfo={dataErrs.body[currentRowIndex].eit}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="eit"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="开始时间"
                                        itemKey="startTime"
                                        initValue={voucherData.body[currentRowIndex].startTime}
                                        errInfo={dataErrs.body[currentRowIndex].startTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="startTime"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="结束时间"
                                        itemKey="endTime"
                                        initValue={voucherData.body[currentRowIndex].endTime}
                                        errInfo={dataErrs.body[currentRowIndex].endTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="endTime"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"100%"}
                                    />
                                </>
                                : null
                            }
                        </ScVoucherBody>
                        <ScVoucherFooter isFooterErr={false} title={"表尾"}>
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="创建人"
                                itemKey="createuser"
                                initValue={voucherData.createuser}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="createuser"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "40%"}
                            />
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="创建日期"
                                itemKey="createdate"
                                initValue={voucherData.createdate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="createdate"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "60%"}
                            />
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="修改人"
                                itemKey="modifyuser"
                                initValue={voucherData.modifyuser}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifyuser"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "40%"}
                            />
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="更新日期"
                                itemKey="modifydate"
                                initValue={voucherData.modifydate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifydate"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "60%"}
                            />
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="确认人"
                                itemKey="confirmuser"
                                initValue={voucherData.confirmuser}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmuser"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "40%"}
                            />
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="确认日期"
                                itemKey="confirmdate"
                                initValue={voucherData.confirmdate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmdate"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "60%"}
                            />
                        </ScVoucherFooter>
                    </ScrollView>
                    {isEdit
                        ? <Surface style={{ minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center", justifyContent: "flex-end", paddingHorizontal: 16 }}>
                            {canTempSave
                                ? <Button mode="text" icon="cellphone-arrow-down" onPress={handleTempSave}>暂存</Button>
                                : null
                            }

                            {isOffLine === 0
                                ? <Button mode="text" onPress={handleUploadWO} icon="cloud-upload" disabled={isHeaderErr || isBodyErr}>上传</Button>
                                : null
                            }
                        </Surface>
                        : null
                    }
                    {orderVisible
                        ? <>
                            <AnimatedFAB
                                icon="keyboard-return"
                                label="返回"
                                extended={false}
                                visible={true}
                                onPress={handleCancel}
                                animateFrom={buttonPosition}
                                style={{ bottom: 64, position: "absolute", ...orderPosition }}
                            />
                        </>
                        : null
                    }
                    {/* <ScSwapButton hiddenIconVisible={true} /> */}
                </View>
                : <ActivityIndicator />
            }

        </View>
    );
};

export default EditWorkOrder;