export default class BankDetailsModel {

    constructor(
        accountNo,
        accountType,
        ifscCode,
        bankName,
        bankAddress,
        bsrCode,
        micrCode,
        fkClientId
    ){
        this.accountNo = accountNo;
        this.accountType = accountType;
        this.ifscCode = ifscCode;
        this.bankName = bankName;
        this.bankAddress = bankAddress;
        this.bsrCode = bsrCode;
        this.micrCode = micrCode;
        this.fkClientId = fkClientId
    }
}


 export class BankDetailsEditModel {
    constructor(
        clientBankId,
        accountNo,
        accountType,
        ifscCode,
        bankName,
        bankAddress,
        bsrCode,
        micrCode,
        fkClientId
    ){
        this.clientBankId = clientBankId
        this.accountNo = accountNo;
        this.accountType = accountType;
        this.ifscCode = ifscCode;
        this.bankName = bankName;
        this.bankAddress = bankAddress;
        this.bsrCode = bsrCode;
        this.micrCode = micrCode;
        this.fkClientId = fkClientId
    }
}