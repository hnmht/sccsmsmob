import { VoucherFile } from "../../../dataType/types/voucherFile";
import { ScFile } from "../../../dataType/types/file";
import { getEmptyVoucherFile } from "../../../dataType/dataZero/voucherFile";

type urlAndHash = {
    url: string;
    hash: string;
}

//单据附件列表转文件列表
// Convert VoucherFile Arrar to ScFile Array
export const voucherFilesToFiles = (voucherFiles: VoucherFile[]) => {
    if (!voucherFiles) {
        return [];
    }
    let files: ScFile[] = [];
    voucherFiles.forEach(voucherFile => {
        files.push(voucherFile.file);
    });
    return files;
}

//文件列表转换为单据附件列表
export const filesToVoucherFiles = (voucherFiles: VoucherFile[], files: ScFile[]): VoucherFile[] => {
    if (!voucherFiles) {
        return [];
    }
    //筛选出删除的文件（voucherFiles中存在,但是files中不存在）
    for (let i = 0; i < voucherFiles.length; i++) {
        let fileIndex = files.findIndex(file => file.hash === voucherFiles[i].file.hash);
        if (fileIndex < 0) {
            voucherFiles[i].dr = 1;
        }
    }

    //筛选出新增的文件
    let newVoucherFiles: VoucherFile[] = [];
    for (let i = 0; i < files.length; i++) {
        let voucherFileIndex = voucherFiles.findIndex(voucherFile => voucherFile.file.hash === files[i].hash);
        if (voucherFileIndex < 0) {
            let newVoucherFile: VoucherFile = getEmptyVoucherFile();
            newVoucherFiles.push(newVoucherFile);
        } else {
            if (voucherFiles[voucherFileIndex].dr === 1) {
                voucherFiles[voucherFileIndex].dr = 0;
            }
        }
    }

    const fs = [...voucherFiles, ...newVoucherFiles];
    //整理fs,将id为0，dr为1的删除掉
    for (let i = 0; i < fs.length; i++) {
        if (fs[i].id === 0 && fs[i].dr === 1) {
            fs.splice(i, 1);
            i--
        }
    }

    return fs;
};

//文件列表转urls
export const filesToUrls = (files: ScFile[]) => {
    let imageUrls: urlAndHash[] = [];
    files.forEach(file => {
        if (file.isImage === 1) {
            imageUrls.push({ url: file.fileUrl, hash: file.hash ? file.hash : "" });
        }
    })
    return imageUrls;
};

//文件图标base64
export const fileIcon = "data:image/png;base64,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";
