import axios from "axios";
import { API_URL } from "@configs/config";
import { globleVariable } from "@configs/globalVariable";
import LocalFunction from "@configs/getLocalFunction";
import { convertIntoURL } from "../utils";

const token = LocalFunction.getLocalValue(globleVariable.tokenKey, true);

class SampleFileService {
  getTemplateFile(TemplateFileType) {
    return axios.get(
      `${API_URL}/api/master/export-Template-Excel?${convertIntoURL({
        TemplateFileType,
        t: token,
      })}`
    );
  }
}

export default new SampleFileService();
