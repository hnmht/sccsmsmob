import RNFS from "react-native-fs";
import { reqUnReadComments, reqUserEORefs, reqUserWORefs } from "../api/message";
import { reqGetCSOs } from "../api/cso";
import { sortBy } from "lodash";
import { store } from "./index";
import { setDynamicEORefs, setDynamicMessages, setDynamicCSOs, setDynamicWORefs } from "./slice/dynamicData";
import { ConstructionSiteOption } from "../dataType/types/cso";
import { CommentMessage } from "../dataType/types/message";
import { WorkOrderRow } from "../dataType/types/workOrder";
import { ReferExecutionOrder } from "../dataType/types/executionOrder";
import { bulkSaveWORefs } from "../db/crud/workorderref";
import { bulkSaveEoRefs } from "../db/crud/executionOrderRef";

export async function getAllDynamicDataOnline() {
    // Request Construction Site Options
    const res = await reqGetCSOs();
    let csos: ConstructionSiteOption[] = [];
    if (res.status) {
        csos = res.data;
    }
    const sortedCSOs = sortBy(csos, ["id"], ["asc"]);
    store.dispatch(setDynamicCSOs(sortedCSOs));
    // Get unread messages
    await getDynamicMessages();
    // Get Execution Order References
    await getEORefsData();
    // Get Work Order References
    await getWORefsData();
};
// Request unread messages from server
export async function getDynamicMessages() {
    const res = await reqUnReadComments(false);
    let comments: CommentMessage[] = [];
    if (res.status) {
        comments = res.data;
    }
    store.dispatch(setDynamicMessages(comments));
};

// Request work order reference data from server
export async function getWORefsData() {
    let worRes = await reqUserWORefs();
    let worRefs: WorkOrderRow[] = [];
    if (worRes.status) {
        worRefs = worRes.data;
    }
    // Save work order references to local database
    bulkSaveWORefs(worRefs);
    // Update work order references in Redux store
    store.dispatch(setDynamicWORefs(worRefs));
}
// Request Exection Order reference data from server
export async function getEORefsData() {
    let eorRes = await reqUserEORefs();
    let eorRefs: ReferExecutionOrder[] = [];
    if (eorRes.status) {
        eorRefs = eorRes.data;
    }
    // Save execution order references to local database
    bulkSaveEoRefs(eorRefs);
    // Update execution order references in Redux store
    store.dispatch(setDynamicEORefs(eorRefs));
}
/* 
//获取带图片的执行单参照数据
export const getEDRefsDataWithImage = async () => {
    let edrRes = await reqUserEORefs();
    let edrRefs = [];
    if (edrRes.data.status === 0) {
        edrRefs = edrRes.data.data;
    }
    for (i = 0; i < edrRefs.length; i++) {
        if (edrRefs[i].edfiles && edrRefs[i].edfiles.length > 0) {
            for (ii = 0; ii < edrRefs[i].edfiles.length; ii++) {
                const filePath = `${RNFS.DownloadDirectoryPath}/${edrRefs[i].edfiles[ii].file.miniofilename}`;
                const fileExist = await RNFS.exists(filePath);
                if (!fileExist) {
                    await downLoadDDFile({
                        fromUrl: edrRefs[i].edfiles[ii].file.fileurl,
                        toFile: filePath
                    });
                }
                edrRefs[i].edfiles[ii].file.fileurl = `file://${filePath}`;
            }
        }
    }
    store.dispatch(setDynamicEORefs(edrRefs));
};

//下载文件
const downLoadDDFile = async (options) => {
    await RNFS.downloadFile(options).promise;
}; */