import { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text, Button, ActivityIndicator, Menu, useTheme, Surface } from "react-native-paper";
import Icon from "@react-native-vector-icons/material-design-icons";
import { dayjs } from "../../i18n/dayjs";
import { cloneDeep } from "lodash";

import { ScVoucherHeader, ScVoucherBody, ScVoucherFooter } from "../../components/ScVoucher";
import ScInput from "../../components/ScInput";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";
import { pubParams } from "../../components/pub/pubParams";

import { getAllDynamicDataOnline } from "../../store/pub";
import { updateDynamicWORefs } from "../../store/slice/dynamicData";
import { reqGetFilesByHash, reqUploadFiles } from "../../api/file";
import { reqAddEO, reqEditEO } from "../../api/executionOrder";
import { multiSortByArr } from "../../components/tools/sort";


import { getInitialValue, checkEOErrors, checkForProblem, eptBodyToEOBody, transVoucherDataToFiles, transEOToBackend, generateMarkText } from "./constructor";
import { updateWORefStatus,getLocalWOR } from "../../db/crud/workorderref";
import { useBusinessNavigation, useBusinessRoute } from "../../navigation/config/screenParams";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ExecutionOrder } from "../../dataType/types/executionOrder";
import ScHandSwitch from "../../components/ScHandSwitch/ScHandSwitch";
import { useTranslation } from "react-i18next";
import { ErrMsg, InitialValueMap } from "../../dataType/types/scInput";
import { EORepo } from "../../db/crud/executionOrder";


const EditExecutionOrder = () => {
    const navigation = useBusinessNavigation();
    const route = useBusinessRoute<"ExecutionOrder">();
    const { isLocal, isNew, isModify, oriWOR, oriEO, onGoBack } = route.params ?? {};
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [voucherData, setVoucherData] = useState<ExecutionOrder | undefined>((undefined));
    const isOffLine = useAppSelector(state => state.appInfo.isOffline);
    const { t } = useTranslation();
    const { person, department } = useAppSelector(state => state.user);
    //命令按钮位置
    const { buttonPosition } = useAppSelector(state => state.swapPosition);
    const [deletedRows, setDeletedRows] = useState([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const dataErrs = useMemo(() => checkEOErrors(voucherData), [voucherData]);

    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isOverSize = pubParams.screen.isOverSize;
    const row = voucherData ? voucherData.body[currentRowIndex] : undefined;
    const rowErrs = dataErrs ? dataErrs.body[currentRowIndex] : undefined;
    const isEdit = !(!isModify && !isNew);
    const canTempSave = isLocal ? true : isModify ? false : true;
    const delButtonEnabled = row && (!isEdit || (row.allowDelRow === 0));

    const rowMarkTexts = generateMarkText(voucherData, row);

    useEffect(() => {
        function initVoucher() {
            const newED = getInitialValue(isNew, isModify, oriWOR, oriEO);
            setVoucherData(newED);
        }
        initVoucher();
    }, [oriWOR, isModify, oriEO, isNew]);

    const MenuItem = ({ row, index, isErr, selectRowAction }) => {
        return (<Menu.Item
            leadingIcon={() => isErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />}
            key={row.rowNumber}
            onPress={() => selectRowAction(index)}
            title={`第${row.rowNumber}行 ${row.epa.name}`}
            style={{ width: "90%" }}
            titleStyle={{ width: "100%" }}
        />);
    };

    //取消
    const handleCancel = () => {
        if (onGoBack !== undefined) {
            onGoBack(true);
        }
        navigation.goBack();
    };
    const handleResteCurrentRowIndex = () => {
        setCurrentRowIndex(0);
    };
    //获取值后的操作
    const handleGetValue = async <T extends keyof InitialValueMap>(
        value: any,
        itemKey: string,
        positionID: 0 | 1 | 2,
        rowIndex: number,
        errMsg: ErrMsg
    ) => {
        if (voucherData === undefined || !isEdit) {
            return
        }

        //设置单据值
        setVoucherData((prevState) => {
            if (prevState === undefined) {
                return undefined;
            }
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0://修改表头字段
                    if (itemKey === "ept" && ("id" in value) && value.id !== prevState.ept.id) { //如果修改的是ept字段且于前值不同
                        handleResteCurrentRowIndex(); //将currentIndex设置为0
                        const handlePerson = newData.csa.id === 0 ? newData.executor : newData.csa.respPerson;
                        newData.body = eptBodyToEOBody(value.body, newData.startTime, newData.endTime, handlePerson); //将执行模板表体转换到表体
                        newData.allowAddRow = value.allowAddRow;
                        newData.allowDelRow = value.allowDelRow;
                    }
                    //如果修改的是现场档案字段
                    if (itemKey === "csa" && value.id !== prevState.csa.id) {
                        if (newData.body.length > 0) {
                            newData.body.map(row => {
                                row.issueOwner = value.respPerson;
                                return row;
                            })
                        }
                    }
                    //如果修改的是开始时间字段
                    if (itemKey === "startTime" && value !== prevState.startTime) {
                        if (newData.endTime <= value) { //如果结束时间小于开始时间，自动将结束时间延后一个小时
                            newData.endTime = dayjs(value, "YYYYMMDDHHmm", true).add(1, "hours").format("YYYYMMDDHHmm");
                        }

                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.handleStartTime = dayjs(value).add(24, "hour").format("YYYYMMDDHHmm");
                                row.handleEndTime = dayjs(newData.endTime).add(1, "day").format("YYYYMMDDHHmm");
                                return row;
                            })
                        }
                    }
                    //如果修改的是结束时间字段
                    if (itemKey === "endTime" && value !== prevState.endTime) {
                        if (newData.startTime >= value) {//如果开始时间大于结束时间,自动将开始时间提前1小时
                            newData.startTime = dayjs(value, "YYYYMMDDHHmm", true).subtract(1, "hours").format("YYYYMMDDHHmm");
                        }
                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.handleStartTime = dayjs(newData.startTime).add(24, "hour").format("YYYYMMDDHHmm");
                                row.handleEndTime = dayjs(value).add(1, "day").format("YYYYMMDDHHmm");
                                return row;
                            })
                        }
                    }
                    newData[itemKey] = value;
                    break;
                case 1://如果修改的是表体字段                                       

                    //更新的是项目值列，则自动检查是否存在问题
                    if (itemKey === "executionValue") {
                        if (newData.body[rowIndex].isCheckError === 1) {//自动检查问题
                            let isProblem = checkForProblem(newData.body[rowIndex].epa.resultType.id, newData.body[rowIndex].errorValue, value);
                            newData.body[rowIndex].isIssue = isProblem;
                            if (isProblem === 0) {
                                newData.body[rowIndex].isRectify = 0; //是否现场处理
                                newData.body[rowIndex].isHandle = 0; //是否后续处理                                
                            } else {
                                if (newData.body[rowIndex].isRectify === 1) { //现场处理为1
                                    newData.body[rowIndex].isHandle = 0; //是否后续处理  
                                } else {
                                    newData.body[rowIndex].isHandle = 1; //是否后续处理    
                                }
                            }
                        }
                    }
                    //如果更新的是是否存在问题
                    if (itemKey === "isIssue") {
                        if (value === 0) {
                            newData.body[rowIndex].isRectify = 0;
                            newData.body[rowIndex].isHandle = 0;
                        } else {
                            if (newData.body[rowIndex].isRectify === 0) {
                                newData.body[rowIndex].isHandle = 1;
                            } else {
                                newData.body[rowIndex].isHandle = 0;
                            }
                        }
                    }
                    //如果更新的是是否现场整改
                    if (itemKey === "isRectify") {
                        if (value === 1) {
                            newData.body[rowIndex].isHandle = 0;
                        } else {
                            newData.body[rowIndex].isHandle = 1;
                        }
                    }
                    //如果更新的是执行项目字段
                    if (itemKey === "epa" && value.id !== prevState.body[rowIndex].epa.id) {
                        newData.body[rowIndex].executionValue = value.defaultValue;
                        newData.body[rowIndex].executionValueDisp = value.defaultValueDisp;
                        newData.body[rowIndex].files = [];
                        newData.body[rowIndex].epaDescription = value.description;
                        newData.body[rowIndex].isCheckError = value.isCheckError;
                        newData.body[rowIndex].errorValue = value.errorValue;
                        newData.body[rowIndex].errorValueDisp = value.errorValueDisp;
                        newData.body[rowIndex].isRequireFile = value.isRequireFile;
                        newData.body[rowIndex].isOnSitePhoto = value.isOnSitePhoto;
                        newData.body[rowIndex].isFromEpt = 0;
                        newData.body[rowIndex].riskLevel = value.riskLevel;
                    }
                    //如果更新的是开始时间字段
                    if (itemKey === "handleStartTime") {
                        if (newData.body[rowIndex].handleEndTime <= value) {
                            newData.body[rowIndex].handleEndTime = dayjs(value, "YYYYMMDDHHmm", true).add(1, "hours").format("YYYYMMDDHHmm");
                        }
                    }
                    //如果更新的结束时间字段
                    if (itemKey === "handleEndTime") {
                        if (newData.body[rowIndex].handleStartTime >= value) {
                            newData.body[rowIndex].handleStartTime = dayjs(value, "YYYYMMDDHHmm", true).subtract(1, "hours").format("YYYYMMDDHHmm");
                        }
                    }
                    newData.body[rowIndex][itemKey] = value;
                    break;
                case 2:
                    newData[itemKey] = value;
                    break;
                default:
                    break;
            }

            return newData;
        });

    };
    //增行
    const handleAddRow = () => {
        //生成表体数据
        const newVoucherData = cloneDeep(voucherData);
        let newRow = cloneDeep(voucherRow);
        //自动生成行号
        if (newVoucherData.body.length === 1) { //如果表体只有一行
            newRow.rowNumber = newVoucherData.body[0].rowNumber + 10;
        } else {
            newVoucherData.body.sort(multiSortByArr([{ field: "rowNumber", order: "asc" }]))
            newRow.rowNumber = newVoucherData.body[newVoucherData.body.length - 1].rowNumber + 10;
        }
        //填写处理人、处理开始时间、处理结束时间
        const handlePerson = newVoucherData.csa.id === 0 ? newVoucherData.executor : newVoucherData.csa.respPerson;
        newRow.issueOwner = handlePerson;
        newRow.handleStartTime = newVoucherData.endTime;
        newRow.handleEndTime = newVoucherData.endTime;
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
            Alert.alert("错误", "不能删除最后一行!");
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
                newVoucherData.body[currentRowIndex].files = [];//将原有行上的文件清除
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
    //暂存指令单
    const handleTempSave = () => {
        if (voucherData === undefined) {
            return
        }
        let newVoucherData = cloneDeep(voucherData);
        //记录单据是否存在错误
        newVoucherData.errData = dataErrs;
        //暂存单据
        if (isModify) { //是否编辑
            if (isLocal) {
                //更新修改数据
                EORepo.editVoucher(newVoucherData);
            } else { //远程单据编辑不允许暂存
                Alert.alert("错误", "编辑远程单据时不允许暂存!");
            }
        } else { //非编辑状态
            if (newVoucherData.sourceBID !== 0 && isOffLine === 1) { //参照单据需要修改本地worefs为执行态
                updateWORefStatus(newVoucherData.sourceBID, 2); //修改数据库中woref为执行态
                
                //更新状态
                const worefs = getLocalWOR();
                dispatch(updateDynamicWORefs(worefs));
            }
            EORepo.saveVoucher(newVoucherData, person.id);
        }

        if (onGoBack !== undefined) {
            onGoBack(true);
        }
        navigation.goBack();
    };
    //上传指令单
    const handleUpload = async () => {
        if (voucherData === undefined) {
            return
        }
        let newEO = cloneDeep(voucherData);
        if (isModify && deletedRows.length > 0) {
            newEO.body.push(...deletedRows);
        }

        const thisEO = transEOToBackend(newEO);
        //处理指令单文件
        setOverlayStatus({ visible: true, description: "正在上传文件..." });
        try {
            const filesArr = transVoucherDataToFiles(voucherData);
            if (filesArr.length > 0) { //如果存在文件则需要先上传文件
                const getFilesHashRes = await reqGetFilesByHash(filesArr);
                if (!getFilesHashRes.status) {
                    Alert.alert("错误", "向服务器请求检查重复文件出错:" + getFilesHashRes.msg)
                    setOverlayStatus({ visible: false, description: "" });
                    return
                }
                //上传文件
                let willUploadFileNumber = 0;
                let willUploadFiles = getFilesHashRes.data;
                let formData = new FormData(); //准备formData
                for (let i = 0; i < willUploadFiles.length; i++) {
                    if (willUploadFiles[i].id === 0) {
                        willUploadFileNumber++
                        let file = { uri: willUploadFiles[i].filePath, type: willUploadFiles[i].mime, name: willUploadFiles[i].originfilename };
                        formData.append("files", file);
                        formData.append("filekey", i);
                        formData.append("filehash", willUploadFiles[i].hash);
                        formData.append("filename", willUploadFiles[i].originFileName);
                        formData.append("filetype", willUploadFiles[i].fileType);
                        formData.append("isimage", willUploadFiles[i].isImage);
                        formData.append("model", willUploadFiles[i].model); //相机型号
                        formData.append("dateTimeOriginal", willUploadFiles[i].dateTimeOriginal); //初始拍摄时间
                        formData.append("latitude", willUploadFiles[i].latitude);//纬度
                        formData.append("longitude", willUploadFiles[i].longitude);//经度 
                        formData.append("source", willUploadFiles[i].source);// 来源
                        //从fileArr中删除
                        willUploadFiles.splice(i, 1);
                        i--;
                    }
                };

                if (willUploadFileNumber > 0) {
                    const uploadRes = await reqUploadFiles(formData, false);    //将未获取hash值的文件进行上传
                    if (!uploadRes.status) {
                        Alert.alert("错误", "向服务器上传文件时出错" + uploadRes.msg);
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                    //根据返回的数据修改服务器返回的文件列表
                    const uploadFiles = uploadRes.data;
                    //合并fileArr1 和 uploadFiles
                    willUploadFiles = willUploadFiles.concat(uploadFiles);
                }
                //创建fileMap
                const fileMap = new Map();
                willUploadFiles.forEach(item => {
                    fileMap.set(item.hash, item);
                });
                //修改单据表体所有文件的id
                thisEO.body.map(row => {
                    row.files.map((rowFile) => {
                        if (rowFile.file.id === 0) {
                            rowFile.file = fileMap.get(rowFile.file.hash);
                        }
                    })
                });
            }
            setOverlayStatus({ visible: true, description: "正在上传单据..." });
            if (isModify) {
                if (isLocal) {//编辑状态下本地单据上传
                    thisEO.id = 0
                    let addRes = await reqAddEO(thisEO);
                    if (addRes.status) {
                        EORepo.delVoucher(voucherData);
                        Alert.alert("提示", "新增执行单成功,单据编号:" + addRes.data.billNumber);
                    } else {
                        Alert.alert("错误", "新增执行单失败:" + addRes.msg);
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                } else { //远程单据编辑
                    const editRes = await reqEditEO(thisEO);
                    if (editRes.status) {
                        Alert.alert("提示", "修改执行单成功,单据编号:" + editRes.data.billNumber);
                    } else {
                        Alert.alert("错误", "修改执行单失败:" + editRes.msg);
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                }
            } else { //新增
                let addRes = await reqAddEO(thisEO);
                if (addRes.status) {
                    Alert.prompt("提示", "新增执行单成功,单据编号:" + addRes.data.billNumber);
                } else {
                    Alert.alert("错误", "新增执行单失败:" + addRes.msg);
                    setOverlayStatus({ visible: false, description: "" });
                    return
                }
            }
        }
        catch (err) {
            setOverlayStatus({ visible: false, description: "" });
            return
        }
        setOverlayStatus({ visible: false, description: "" });

        //如果指令单参照单据生成,则刷新worefs
        if (thisEO.sourceType !== "UA" && isOffLine === 0) {
            getAllDynamicDataOnline();
        }

        if (onGoBack !== undefined) {
            onGoBack(true);
        }
        navigation.goBack();
    };

    // console.log("voucherData:",voucherData);
    return (
        <View style={{ flex: 1 }}>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
                closeAction={() => setOverlayStatus({ visible: false, description: "" })}
            />
            <View key="voucherTitle" style={{ height: 42, alignItems: "center", justifyContent: "center" }}>
                <Text variant="titleLarge" maxFontSizeMultiplier={1.2}>执行单</Text>
            </View>

            {voucherData !== undefined
                ? <View style={{ flex: 1 }}>
                    <ScrollView>
                        <ScVoucherHeader isHeaderErr={dataErrs.isHeaderErr} title="表头">
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="单据编号"
                                itemKey="billnumber"
                                initValue={isLocal ? `L${voucherData.id}` : voucherData.billNumber}
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
                                itemKey="billDate"
                                initValue={voucherData.billDate}
                                pickDone={handleGetValue}
                                placeholder=""
                                isBackendTest={false}
                                key="billDate"
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
                                errInfo={dataErrs.department}
                                pickDone={handleGetValue}
                                placeholder="请选择部门"
                                isBackendTest={false}
                                key="department"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={510}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="执行人"
                                itemKey="executor"
                                initValue={voucherData.executor}
                                errInfo={dataErrs.executor}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="executor"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={570}
                                allowNull={false}
                                isEdit={isEdit && voucherData.sourceBID === 0}
                                itemShowName="现场"
                                itemKey="csa"
                                initValue={voucherData.csa}
                                errInfo={dataErrs.csa}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="csa"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={580}
                                allowNull={false}
                                isEdit={isNew && isEdit && voucherData.sourceBID === 0}
                                itemShowName="执行模板"
                                itemKey="ept"
                                initValue={voucherData.ept}
                                errInfo={dataErrs.ept}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="ept"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="开始时间"
                                itemKey="startTime"
                                initValue={voucherData.startTime}
                                errInfo={dataErrs.startTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="startTime"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="结束时间"
                                itemKey="endTime"
                                initValue={voucherData.endTime}
                                errInfo={dataErrs.endTime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="endTime"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
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
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据类型"
                                itemKey="sourceType"
                                initValue={voucherData.sourceType}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceType"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据号"
                                itemKey="sourceBillNumber"
                                initValue={voucherData.sourceBillNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceBillNumber"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={302}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据行号"
                                itemKey="sourceRowNumber"
                                initValue={voucherData.sourceRowNumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourceRowNumber"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={isEdit}
                                itemShowName="说明"
                                itemKey="description"
                                placeholder={"请输入说明"}
                                initValue={voucherData.description}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="description"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={403}
                                allowNull={false}
                                isEdit={false}
                                itemShowName="允许增行"
                                itemKey="allowAddRow"
                                initValue={voucherData.allowAddRow}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="allowAddRow"
                                positionID={0}
                                rowIndex={-1}
                                width="50%"
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
                            addRowDisabled={!(isEdit && voucherData.ept.id !== 0 && voucherData.allowAddRow === 1)}
                        >
                            {row !== undefined
                                ? <>
                                    <View style={{ width: "100%", minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
                                        <Button
                                            onPress={handleDeleteRow}
                                            icon="playlist-remove"
                                            textColor={theme.colors.error}
                                            disabled={delButtonEnabled}
                                            style={{ margin: 4 }}
                                        >
                                            删行
                                        </Button>
                                    </View>
                                    <ScInput
                                        dataType={302}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="行号"
                                        itemKey="rowNumber"
                                        initValue={row.rowNumber}
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
                                        initValue={row.status}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="status"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={"50%"}
                                    />
                                    <ScInput
                                        dataType={560}
                                        allowNull={false}
                                        isEdit={isEdit && row.isFromEpt === 0}
                                        itemShowName="执行项目"
                                        itemKey="epa"
                                        initValue={row.epa}
                                        errInfo={rowErrs.epa}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="epa"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={590}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="风险等级"
                                        itemKey="riskLevel"
                                        initValue={row.riskLevel}
                                        errInfo={rowErrs.riskLevel}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="riskLevel"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={row.epa.resultType.id}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="执行项目值"
                                        itemKey="executionValue"
                                        initValue={row.executionValue}
                                        errInfo={rowErrs.executionValue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="executionValue"
                                        positionID={1}
                                        udc={row.epa.udc}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={902}
                                        allowNull={row.isRequireFile === 0}
                                        isEdit={isEdit}
                                        itemShowName="附件"
                                        itemKey="files"
                                        initValue={row.files}
                                        errInfo={rowErrs.files}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="files"
                                        positionID={1}
                                        isOnSitePhoto={row.isOnSitePhoto === 1}
                                        rowIndex={currentRowIndex}
                                        width="40%"
                                        markTexts={rowMarkTexts}
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="必传附件"
                                        itemKey="isRequireFile"
                                        initValue={row.isRequireFile}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isRequireFile"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="60%"
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="必须现场拍照"
                                        itemKey="isOnSitePhoto"
                                        initValue={row.isOnSitePhoto}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isOnSitePhoto"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "80%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="填写说明"
                                        itemKey="epaDescription"
                                        initValue={row.epaDescription}
                                        pickDone={handleGetValue}
                                        placeholder=""
                                        isBackendTest={false}
                                        key="epaDescription"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={isEdit}
                                        itemShowName="说明"
                                        itemKey="description"
                                        initValue={row.description}
                                        pickDone={handleGetValue}
                                        placeholder="请输入说明"
                                        isBackendTest={false}
                                        key="description"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit && row.isCheckError === 0}
                                        itemShowName="是否存在问题"
                                        itemKey="isIssue"
                                        initValue={row.isIssue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isIssue"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "100%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit && row.isIssue === 1}
                                        itemShowName="是否现场整改"
                                        itemKey="isRectify"
                                        initValue={row.isRectify}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isRectify"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "100%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="是否问题处理"
                                        itemKey="isHandle"
                                        initValue={row.isHandle}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isHandle"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "100%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={510}
                                        allowNull={row.isHandle === 0}
                                        isEdit={isEdit && row.isHandle === 1}
                                        itemShowName="问题处理人"
                                        itemKey="issueOwner"
                                        initValue={row.issueOwner}
                                        errInfo={rowErrs.issueOwner}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="issueOwner"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "100%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={row.isHandle === 0}
                                        isEdit={isEdit && row.isHandle === 1}
                                        itemShowName="处理开始时间"
                                        itemKey="handleStartTime"
                                        initValue={row.handleStartTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="handleStartTime"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={row.isHandle === 0}
                                        isEdit={isEdit && row.isHandle === 1}
                                        itemShowName="处理完成时间"
                                        itemKey="handleEndTime"
                                        initValue={row.handleEndTime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="handleEndTime"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
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
                                itemKey="creator"
                                initValue={voucherData.creator}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="creator"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "40%"}
                            />
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="创建日期"
                                itemKey="createDate"
                                initValue={voucherData.createDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="createDate"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "60%"}
                            />
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="修改人"
                                itemKey="modifier"
                                initValue={voucherData.modifier}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifier"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "40%"}
                            />
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="更新日期"
                                itemKey="modifyDate"
                                initValue={voucherData.modifyDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="modifyDate"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "60%"}
                            />
                            <ScInput
                                dataType={510}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="确认人"
                                itemKey="confirmer"
                                initValue={voucherData.confirmer}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmer"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "40%"}
                            />
                            <ScInput
                                dataType={307}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="确认日期"
                                itemKey="confirmDate"
                                initValue={voucherData.confirmDate}
                                pickDone={() => { }}
                                isBackendTest={false}
                                key="confirmDate"
                                positionID={2}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "60%"}
                            />
                        </ScVoucherFooter>
                    </ScrollView>
                    {isEdit
                        ? <Surface style={{ minHeight: 42, flexDirection: buttonPosition === "right" ? "row" : "row-reverse", alignItems: "center", justifyContent: "flex-end" }}>
                            {canTempSave
                                ? <Button mode="text" onPress={handleTempSave} icon="cellphone-arrow-down" >暂存</Button>
                                : null
                            }
                            {isOffLine === 0
                                ? <Button mode="text" icon="cloud-upload" onPress={handleUpload} disabled={isHeaderErr || isBodyErr}>上传</Button>
                                : null
                            }
                        </Surface>
                        : null
                    }
                    <ScHandSwitch
                        refreshDisplay={false}
                        docRefresh={() => { }}
                        cancelAction={handleCancel}
                        theme={theme}
                        t={t}
                    />

                </View>
                : <ActivityIndicator animating={true} />
            }
        </View >
    );
};

export default EditExecutionOrder;
