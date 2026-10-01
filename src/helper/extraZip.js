import { base64ToBuffer } from "@helper/base64ToBuffer"
import JSZip from 'jszip'

const extractZip = async (resData) => {
    let resArr = []
    let buffer = await base64ToBuffer(resData);
    const zip = new JSZip();
    const extractedFiles = await zip.loadAsync(buffer);
    Object.entries(extractedFiles.files).forEach(([relativePath, file]) => {
        if (!file.dir) {
            file.async('string').then(content => {
                resArr.push(JSON.parse(content));
            });
        }
    });
    return resArr
}

export default extractZip;