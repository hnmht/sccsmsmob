import { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Alert } from "react-native";
import { Text, Button, ActivityIndicator, Menu, useTheme, Surface, AnimatedFAB } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from "react-redux";
import dayjs from "../../utils/myDayjs";
import { cloneDeep } from "lodash";

import ScSwapButton from "../../components/ScSwapButton/ScSwapButton";
import { ScVoucherHeader, ScVoucherBody, ScVoucherFooter } from "../../components/ScVoucher";
import ScInput from "../../components/ScInput";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";
import { pubParams } from "../../components/pub/pubParms";

import { getAllDynamicData } from "../../store/pub";
import { updateDynamicWORefs } from "../../store/slice/dynamicData";
import { reqGetFilesByHash, reqUploadFiles } from "../../api/file";
import { reqAddED, reqEditED } from "../../api/executeDoc";

import { DeepCloneJSON, MultiSortByArr } from "../../utils/tools";
import { getInitialValue, checkEDErrors, checkForProblem, voucherRow, eitBodyToEdBody, transVoucherDataToFiles, transEDToBackend, generateMarkText } from "./constructor";
import { checkObjErrors, checkVouchBodyErrors } from "../../utils/pub";
import { delLocalED, editLocalED, saveLocalED } from "../../db/table/executedoc";
import { updateWorefStatus, getLocalWOR } from "../../db/table/workerorderref";

const ExecuteDoc = (props) => {
    const { navigation } = props;
    const { isLocal, isNew, isModify, oriWOR, oriED, refreshAction } = props.route.params;
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [voucherData, setVoucherData] = useState((undefined));
    const isOffLine = useSelector(state => state.appinfo.isoffline);
    //命令按钮位置
    const { buttonPosition, orderPosition, orderVisible } = useSelector(state => state.swapposition);
    const [deletedRows, setDeletedRows] = useState([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const dataErrs = useMemo(() => checkEDErrors(voucherData), [voucherData]);

    const theme = useTheme();
    const dispatch = useDispatch();
    const isOverSize = pubParams.screen.isOverSize;
    const row = voucherData ? voucherData.body[currentRowIndex] : undefined;
    const rowErrs = dataErrs ? dataErrs.body[currentRowIndex] : undefined;
    const isEdit = !(!isModify && !isNew);
    const canTempSave = isLocal ? true : isModify ? false : true;
    const isHeaderErr = useMemo(() => checkObjErrors(dataErrs), [dataErrs]);
    const isBodyErr = useMemo(() => checkVouchBodyErrors(dataErrs), [dataErrs])
    const delButtonEnabled = row && (!isEdit || (row.allowdelrow === 0));

    const rowMarkTexts = generateMarkText(voucherData, row);

    useEffect(() => {
        function initVoucher() {
            const newED = getInitialValue(isNew, isModify, oriWOR, oriED);
            setVoucherData(newED);
        }
        initVoucher();
    }, [oriWOR, isModify, oriED, isNew]);

    const MenuItem = ({ row, index, isErr, selectRowAction }) => {
        return (<Menu.Item
            leadingIcon={() => isErr ? <Icon name="alert" size={24} color="red" /> : <Icon name="check" size={24} color="green" />}
            key={row.rownumber}
            onPress={() => selectRowAction(index)}
            title={`第${row.rownumber}行 ${row.eid.name}`}
            style={{ width: "90%" }}
            titleStyle={{ width: "100%" }}
        />);
    };

    //取消
    const handleCancel = () => {
        if (refreshAction !== undefined) {
            refreshAction();
        }
        navigation.goBack();
    };
    const handleResteCurrentRowIndex = () => {
        setCurrentRowIndex(0);
    };
    //获取值后的操作
    const handleGetValue = async (value, itemkey, positionID, rowIndex, errMsg) => {
        if (voucherData === undefined || !isEdit) {
            return
        }
        // let startTime = new Date();
        //设置单据值
        setVoucherData((prevState) => {
            let newData = cloneDeep(prevState);
            switch (positionID) {
                case 0://修改表头字段
                    if (itemkey === "eit" && value.id !== prevState.eit.id) { //如果修改的是eit字段且于前值不同
                        handleResteCurrentRowIndex(); //将currentIndex设置为0
                        isModifyEit = true;
                        newEitRowNumber = value.body.length;
                        const handlePerson = newData.sceneitem.id === 0 ? newData.execperson : newData.sceneitem.respperson;
                        newData.body = eitBodyToEdBody(value.body, newData.starttime, newData.endtime, handlePerson); //将执行模板表体转换到表体
                        newData.allowaddrow = value.allowaddrow;
                        newData.allowdelrow = value.allowdelrow;
                    }
                    //如果修改的是现场档案字段
                    if (itemkey === "sceneitem" && value.id !== prevState.sceneitem.id) {
                        if (newData.body.length > 0) {
                            newData.body.map(row => {
                                row.handleperson = value.respperson;
                                return row;
                            })
                        }
                    }
                    //如果修改的是开始时间字段
                    if (itemkey === "starttime" && value !== prevState.starttime) {
                        if (newData.endtime <= value) { //如果结束时间小于开始时间，自动将结束时间延后一个小时
                            newData.endtime = dayjs(value, "YYYYMMDDHHmm", true).add(1, "hours").format("YYYYMMDDHHmm");
                        }

                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.handlestarttime = dayjs(value).add(24, "hour").format("YYYYMMDDHHmm");
                                row.handleendtime = dayjs(newData.endtime).add(1, "day").format("YYYYMMDDHHmm");
                                return row;
                            })
                        }
                    }
                    //如果修改的是结束时间字段
                    if (itemkey === "endtime" && value !== prevState.endtime) {
                        if (newData.starttime >= value) {//如果开始时间大于结束时间,自动将开始时间提前1小时
                            newData.starttime = dayjs(value, "YYYYMMDDHHmm", true).subtract(1, "hours").format("YYYYMMDDHHmm");
                        }
                        if (newData.body.length > 0) { //如果表体存在行
                            newData.body.map(row => {
                                row.handlestarttime = dayjs(newData.starttime).add(24, "hour").format("YYYYMMDDHHmm");
                                row.handleendtime = dayjs(value).add(1, "day").format("YYYYMMDDHHmm");
                                return row;
                            })
                        }
                    }
                    newData[itemkey] = value;
                    break;
                case 1://如果修改的是表体字段                                       

                    //更新的是项目值列，则自动检查是否存在问题
                    if (itemkey === "exectivevalue") {
                        if (newData.body[rowIndex].ischeckerror === 1) {//自动检查问题
                            let isProblem = checkForProblem(newData.body[rowIndex].eid.resulttype.id, newData.body[rowIndex].errorvalue, value);
                            newData.body[rowIndex].iserr = isProblem;
                            if (isProblem === 0) {
                                newData.body[rowIndex].isrectify = 0; //是否现场处理
                                newData.body[rowIndex].ishandle = 0; //是否后续处理                                
                            } else {
                                if (newData.body[rowIndex].isrectify === 1) { //现场处理为1
                                    newData.body[rowIndex].ishandle = 0; //是否后续处理  
                                } else {
                                    newData.body[rowIndex].ishandle = 1; //是否后续处理    
                                }
                            }
                        }
                    }
                    //如果更新的是是否存在问题
                    if (itemkey === "iserr") {
                        if (value === 0) {
                            newData.body[rowIndex].isrectify = 0;
                            newData.body[rowIndex].ishandle = 0;
                        } else {
                            if (newData.body[rowIndex].isrectify === 0) {
                                newData.body[rowIndex].ishandle = 1;
                            } else {
                                newData.body[rowIndex].ishandle = 0;
                            }
                        }
                    }
                    //如果更新的是是否现场整改
                    if (itemkey === "isrectify") {
                        if (value === 1) {
                            newData.body[rowIndex].ishandle = 0;
                        } else {
                            newData.body[rowIndex].ishandle = 1;
                        }
                    }
                    //如果更新的是执行项目字段
                    if (itemkey === "eid" && value.id !== prevState.body[rowIndex].eid.id) {
                        newData.body[rowIndex].exectivevalue = value.defaultvalue;
                        newData.body[rowIndex].exectivedisp = value.defaultvaluedisp;
                        newData.body[rowIndex].files = [];
                        newData.body[rowIndex].eiddescription = value.description;
                        newData.body[rowIndex].ischeckerror = value.ischeckerror;
                        newData.body[rowIndex].errorvalue = value.errorvalue;
                        newData.body[rowIndex].errorvaluedisp = value.errorvaluedisp;
                        newData.body[rowIndex].isrequirefile = value.isrequirefile;
                        newData.body[rowIndex].isonsitephoto = value.isonsitephoto;
                        newData.body[rowIndex].isfromeit = 0;
                        newData.body[rowIndex].risklevel = value.risklevel;
                    }
                    //如果更新的是开始时间字段
                    if (itemkey === "handlestarttime") {
                        if (newData.body[rowIndex].handleendtime <= value) {
                            newData.body[rowIndex].handleendtime = dayjs(value, "YYYYMMDDHHmm", true).add(1, "hours").format("YYYYMMDDHHmm");
                        }
                    }
                    //如果更新的结束时间字段
                    if (itemkey === "handleendtime") {
                        if (newData.body[rowIndex].handlestarttime >= value) {
                            newData.body[rowIndex].handlestarttime = dayjs(value, "YYYYMMDDHHmm", true).subtract(1, "hours").format("YYYYMMDDHHmm");
                        }
                    }
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
        //生成表体数据
        const newVoucherData = DeepCloneJSON(voucherData);
        let newRow = DeepCloneJSON(voucherRow);
        //自动生成行号
        if (newVoucherData.body.length === 1) { //如果表体只有一行
            newRow.rownumber = newVoucherData.body[0].rownumber + 10;
        } else {
            newVoucherData.body.sort(MultiSortByArr([{ field: "rownumber", order: "asc" }]))
            newRow.rownumber = newVoucherData.body[newVoucherData.body.length - 1].rownumber + 10;
        }
        //填写处理人、处理开始时间、处理结束时间
        const handlePerson = newVoucherData.sceneitem.id === 0 ? newVoucherData.execperson : newVoucherData.sceneitem.respperson;
        newRow.handleperson = handlePerson;
        newRow.handlestarttime = newVoucherData.endtime;
        newRow.handleendtime = newVoucherData.endtime;
        newVoucherData.body.push(newRow);
        setVoucherData(newVoucherData);
        setCurrentRowIndex(newVoucherData.body.length - 1);
    };
    //删行
    const handleDeleteRow = () => {
        if (voucherData.body.length === 1) {
            Alert.alert("错误", "不能删除最后一行!");
            return
        }
        const newVoucherData = DeepCloneJSON(voucherData);
        const newDeletedRows = DeepCloneJSON(deletedRows);
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
        let newVoucherData = DeepCloneJSON(voucherData);
        //记录单据是否存在错误
        newVoucherData.isHeaderErr = isHeaderErr;
        newVoucherData.isBodyErr = isBodyErr;

        //暂存单据
        if (isModify) { //是否编辑
            if (isLocal) {
                //更新修改数据
                editLocalED(newVoucherData);
            } else { //远程单据编辑不允许暂存
                Alert.alert("错误", "编辑远程单据时不允许暂存!");
            }
        } else { //非编辑状态
            if (newVoucherData.sourcebid !== 0 && isOffLine === 1) { //参照单据需要修改本地worefs为执行态
                updateWorefStatus(newVoucherData.sourcebid, 2); //修改数据库中woref为执行态
                //更新状态
                const worefs = getLocalWOR();
                dispatch(updateDynamicWORefs(worefs));
            }
            saveLocalED(newVoucherData);
        }

        if (refreshAction !== undefined) {
            refreshAction();
        }
        navigation.goBack();
    };
    //上传指令单
    const handleUpload = async () => {
        let newEd = DeepCloneJSON(voucherData);
        if (isModify && deletedRows.length > 0) {
            newEd.body.push(...deletedRows);
        }

        const thisED = transEDToBackend(newEd);
        //处理指令单文件
        setOverlayStatus({ visible: true, description: "正在上传文件..." });
        try {
            const filesArr = transVoucherDataToFiles(voucherData);
            if (filesArr.length > 0) { //如果存在文件则需要先上传文件
                const getFilesHashRes = await reqGetFilesByHash(filesArr);
                if (getFilesHashRes.data.status !== 0) {
                    Alert.alert("错误", "向服务器请求检查重复文件出错:" + getFilesHashRes.data.statusMsg)
                    setOverlayStatus({ visible: false, goBackDisabled: false, description: "" });
                    return
                }
                //上传文件
                let willUploadFileNumber = 0;
                let willUploadFiles = getFilesHashRes.data.data;
                let formData = new FormData(); //准备formData
                for (let i = 0; i < willUploadFiles.length; i++) {
                    if (willUploadFiles[i].fileid === 0) {
                        willUploadFileNumber++
                        let file = { uri: willUploadFiles[i].filepath, type: willUploadFiles[i].mime, name: willUploadFiles[i].originfilename };
                        formData.append("files", file);
                        formData.append("filekey", i);
                        formData.append("filehash", willUploadFiles[i].filehash);
                        formData.append("filename", willUploadFiles[i].originfilename);
                        formData.append("filetype", willUploadFiles[i].filetype);
                        formData.append("isimage", willUploadFiles[i].isimage);
                        formData.append("model", willUploadFiles[i].model); //相机型号
                        formData.append("DateTimeOriginal", willUploadFiles[i].datetimeoriginal); //初始拍摄时间
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
                    if (uploadRes.data.status !== 0) {
                        Alert.alert("错误", "向服务器上传文件时出错" + uploadRes.data.statusMsg);
                        setOverlayStatus({ visible: false, goBackDisabled: false, description: "" });
                        return
                    }
                    //根据返回的数据修改服务器返回的文件列表
                    const uploadFiles = uploadRes.data.data;
                    //合并fileArr1 和 uploadFiles
                    willUploadFiles = willUploadFiles.concat(uploadFiles);
                }
                //创建fileMap
                const fileMap = new Map();
                willUploadFiles.forEach(item => {
                    fileMap.set(item.filehash, item);
                });
                //修改单据表体所有文件的id
                thisED.body.map(row => {
                    row.files.map((rowFile) => {
                        if (rowFile.file.fileid === 0) {
                            rowFile.file = fileMap.get(rowFile.file.filehash);
                        }
                    })
                });
            }
            setOverlayStatus({ visible: true, description: "正在上传单据..." });
            if (isModify) {
                if (isLocal) {//编辑状态下本地单据上传

                    thisED.id = 0
                    delete thisED.isHeaderErr
                    delete thisED.isBodyErr
                    let addRes = await reqAddED(thisED);
                    if (addRes.data.status === 0) {
                        delLocalED(voucherData);
                        Alert.alert("提示", "新增执行单成功,单据编号:" + addRes.data.data.billnumber);
                    } else {
                        Alert.alert("错误", "新增执行单失败:" + addRes.data.statusMsg);
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                } else { //远程单据编辑
                    const editRes = await reqEditED(thisED);
                    if (editRes.data.status === 0) {
                        Alert.alert("提示", "修改执行单成功,单据编号:" + editRes.data.data.billnumber);
                    } else {
                        Alert.alert("错误", "修改执行单失败:" + editRes.data.statusMsg);
                        setOverlayStatus({ visible: false, description: "" });
                        return
                    }
                }
            } else { //新增
                let addRes = await reqAddED(thisED);
                if (addRes.data.status === 0) {
                    Alert.prompt("提示", "新增执行单成功,单据编号:" + addRes.data.data.billnumber);
                } else {
                    Alert.alert("错误", "新增执行单失败:" + addRes.data.statusMsg);
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
        if (thisED.sourcetype !== "UA" && isOffLine === 0) {
            getAllDynamicData();
        }

        if (refreshAction !== undefined) {
            refreshAction();
        }
        navigation.goBack();
    };

    // console.log("voucherData:",voucherData);
    return (
        <View style={{ flex: 1 }}>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
                closeAction={() => setOverlayStatus({ visible: false, goBackDisabled: false, description: "" })}
            />
            <View key="voucherTitle" style={{ height: 42, alignItems: "center", justifyContent: "center" }}>
                <Text variant="titleLarge" maxFontSizeMultiplier={1.2}>执行单</Text>
            </View>

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
                                itemKey="execperson"
                                initValue={voucherData.execperson}
                                errInfo={dataErrs.execperson}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="execperson"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={570}
                                allowNull={false}
                                isEdit={isEdit && voucherData.sourcebid === 0}
                                itemShowName="现场"
                                itemKey="sceneitem"
                                initValue={voucherData.sceneitem}
                                errInfo={dataErrs.sceneitem}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sceneitem"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={580}
                                allowNull={false}
                                isEdit={isNew && isEdit && voucherData.sourcebid === 0}
                                itemShowName="执行模板"
                                itemKey="eit"
                                initValue={voucherData.eit}
                                errInfo={dataErrs.eit}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="eit"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="开始时间"
                                itemKey="starttime"
                                initValue={voucherData.starttime}
                                errInfo={dataErrs.starttime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="starttime"
                                positionID={0}
                                rowIndex={-1}
                                width="100%"
                            />
                            <ScInput
                                dataType={307}
                                allowNull={false}
                                isEdit={isEdit}
                                itemShowName="结束时间"
                                itemKey="endtime"
                                initValue={voucherData.endtime}
                                errInfo={dataErrs.endtime}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="endtime"
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
                                itemKey="sourcetype"
                                initValue={voucherData.sourcetype}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourcetype"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={301}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据号"
                                itemKey="sourcebillnumber"
                                initValue={voucherData.sourcebillnumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourcebillnumber"
                                positionID={0}
                                rowIndex={-1}
                                width={isOverSize ? "100%" : "50%"}
                            />
                            <ScInput
                                dataType={302}
                                allowNull={true}
                                isEdit={false}
                                itemShowName="来源单据行号"
                                itemKey="sourcerownumber"
                                initValue={voucherData.sourcerownumber}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="sourcerownumber"
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
                                itemKey="allowaddrow"
                                initValue={voucherData.allowaddrow}
                                pickDone={handleGetValue}
                                isBackendTest={false}
                                key="allowaddrow"
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
                            addRowDisabled={!(isEdit && voucherData.eit.id !== 0 && voucherData.allowaddrow === 1)}
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
                                        itemKey="rownumber"
                                        initValue={row.rownumber}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="rownumber"
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
                                        isEdit={isEdit && row.isfromeit === 0}
                                        itemShowName="执行项目"
                                        itemKey="eid"
                                        initValue={row.eid}
                                        errInfo={rowErrs.eid}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="eid"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={590}
                                        allowNull={false}
                                        isEdit={false}
                                        itemShowName="风险等级"
                                        itemKey="risklevel"
                                        initValue={row.risklevel}
                                        errInfo={rowErrs.risklevel}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="risklevel"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={row.eid.resulttype.id}
                                        allowNull={false}
                                        isEdit={isEdit}
                                        itemShowName="执行项目值"
                                        itemKey="exectivevalue"
                                        initValue={row.exectivevalue}
                                        errInfo={rowErrs.exectivevalue}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="exectivevalue"
                                        positionID={1}
                                        udc={row.eid.udc}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={902}
                                        allowNull={row.isrequirefile === 0}
                                        isEdit={isEdit}
                                        itemShowName="附件"
                                        itemKey="files"
                                        initValue={row.files}
                                        errInfo={rowErrs.files}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="files"
                                        positionID={1}
                                        isOnSitePhoto={row.isonsitephoto === 1}
                                        rowIndex={currentRowIndex}
                                        width="40%"
                                        markTexts={rowMarkTexts}
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="必传附件"
                                        itemKey="isrequirefile"
                                        initValue={row.isrequirefile}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isrequirefile"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="60%"
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="必须现场拍照"
                                        itemKey="isonsitephoto"
                                        initValue={row.isonsitephoto}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isonsitephoto"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "80%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={301}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="填写说明"
                                        itemKey="eiddescription"
                                        initValue={row.eiddescription}
                                        pickDone={handleGetValue}
                                        placeholder=""
                                        isBackendTest={false}
                                        key="eiddescription"
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
                                        isEdit={isEdit && row.ischeckerror === 0}
                                        itemShowName="是否存在问题"
                                        itemKey="iserr"
                                        initValue={row.iserr}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="iserr"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "100%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={isEdit && row.iserr === 1}
                                        itemShowName="是否现场整改"
                                        itemKey="isrectify"
                                        initValue={row.isrectify}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="isrectify"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "100%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={403}
                                        allowNull={true}
                                        isEdit={false}
                                        itemShowName="是否问题处理"
                                        itemKey="ishandle"
                                        initValue={row.ishandle}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="ishandle"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "100%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={510}
                                        allowNull={row.ishandle === 0}
                                        isEdit={isEdit && row.ishandle === 1}
                                        itemShowName="问题处理人"
                                        itemKey="handleperson"
                                        initValue={row.handleperson}
                                        errInfo={rowErrs.handleperson}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="handleperson"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width={isOverSize ? "100%" : "50%"}
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={row.ishandle === 0}
                                        isEdit={isEdit && row.ishandle === 1}
                                        itemShowName="处理开始时间"
                                        itemKey="handlestarttime"
                                        initValue={row.handlestarttime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="handlestarttime"
                                        positionID={1}
                                        rowIndex={currentRowIndex}
                                        width="100%"
                                    />
                                    <ScInput
                                        dataType={307}
                                        allowNull={row.ishandle === 0}
                                        isEdit={isEdit && row.ishandle === 1}
                                        itemShowName="处理完成时间"
                                        itemKey="handleendtime"
                                        initValue={row.handleendtime}
                                        pickDone={handleGetValue}
                                        isBackendTest={false}
                                        key="handleendtime"
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
                    <ScSwapButton hiddenIconVisible={true} />
                </View>
                : <ActivityIndicator animating={true} />
            }
        </View >
    );
};

export default ExecuteDoc;