import {  globleVariable  } from '../configs/globalVariable'

const ClearSession = () => {

    console.log("clear data - data")
    //** null or blank
    sessionStorage.setItem(globleVariable.GSTR_2BFrdt, "");
    sessionStorage.setItem(globleVariable.GSTR_2BTodt, "");
    sessionStorage.setItem(globleVariable.purchaeTodt, "");
    sessionStorage.setItem(globleVariable.purchaeFrdt, "");
    sessionStorage.setItem(globleVariable.selectExportFromDt, "");
    sessionStorage.setItem(globleVariable.selectExportToDt, "");
    sessionStorage.setItem(globleVariable.purSelectExportFromDt, "");
    sessionStorage.setItem(globleVariable.purSelectExportToDt, "");
    sessionStorage.setItem(globleVariable.gstr3bSelectExportFromDt, "");
    sessionStorage.setItem(globleVariable.gstr3bToDt, "");
    sessionStorage.setItem(globleVariable.gstr1FromDt, "");
    sessionStorage.setItem(globleVariable.gstr1SelectExportToDt, "");
    sessionStorage.setItem(globleVariable.gstr1FiledFromDt, "");
    sessionStorage.setItem(globleVariable.gstr1FiledToDt, "");
    sessionStorage.setItem(globleVariable.gstr3BFiledFromDt, "");
    sessionStorage.setItem(globleVariable.gstr3BFiledToDt, "");
    //** Remove
    sessionStorage.removeItem(globleVariable.isGSTR2BITCAvailable);
    sessionStorage.removeItem(globleVariable.RecoValue);
    sessionStorage.removeItem(globleVariable.isSupplierDebitNote);
    sessionStorage.removeItem(globleVariable.isDeleteAction);
    sessionStorage.removeItem(globleVariable.isReverseCharge);
    sessionStorage.removeItem(globleVariable.isGSTR2BITCAvailable);
    sessionStorage.removeItem(globleVariable.RecoDiff);
    sessionStorage.removeItem(globleVariable.RecoValuePan);
    sessionStorage.removeItem(globleVariable.isSupplierDebitNotePan);
    sessionStorage.removeItem(globleVariable.isDeleteActionPan);
    sessionStorage.removeItem(globleVariable.isReverseChargePan);
    sessionStorage.removeItem(globleVariable.isGSTR2BITCAvailablePan);
    sessionStorage.removeItem(globleVariable.RecoDiffPan);
    sessionStorage.removeItem(globleVariable.gstr6FileFromDt)
    // sessionStorage.removeItem(globleVariable.itc04DateRange);
    // sessionStorage.removeItem(globleVariable.itc04ExpLabel);
    sessionStorage.removeItem("btnDisable");
    sessionStorage.removeItem("btnDisable4");
    sessionStorage.removeItem("btnDisable6");
    sessionStorage.removeItem("btnDisable3b");
    sessionStorage.removeItem("gstR1AckNumber");
    sessionStorage.removeItem("gstR1AckNumberDate");
    sessionStorage.removeItem("gstR04AckNumber");
    sessionStorage.removeItem("gstR04AckNumberDate");
    sessionStorage.removeItem("gstR6AckNumber");
    sessionStorage.removeItem("gstR6AckNumberDate");
    sessionStorage.removeItem("gstR3AckNumber");
    sessionStorage.removeItem("gstR3AckNumberDate");
    sessionStorage.removeItem('cmp08AckNumber');
    sessionStorage.removeItem('cmp08AckDate');
    sessionStorage.removeItem(globleVariable.cmp08DownloadDate);


}

export default ClearSession;