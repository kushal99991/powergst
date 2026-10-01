
 class CompanyAdd {
    constructor(gstinNumber,
        companyName,
        tradeName,
        code,
        groupName,
        companyType,
        mobileNo,
        email,
        gstR1FilingType,
        registrationType,
        username,
        password,
        isCompositionScheme,
        isForeignTaxPerson,
        isInputServiceDistributor,
        isTDSApplicable,
        isECommerceOperator,
        isitC04Applicable,
        clientStatus,
        contactPersonName,
        contactPersonDesignation,
        contactPersonEmail,
        contactPersonOfficeNo,
        contactPersonMobileNo,
        insertedBy,
        userId,
        ewayBillUserName,
        ewayBillPassword,
        iceGateUserName,
        iceGatePassword
    ) {
        this.gstinNumber = gstinNumber;
        this.companyName = companyName;
        this.tradeName = tradeName;
        this.code = code;
        this.groupName = groupName;
        this.companyType = companyType;
        this.mobileNo = mobileNo;
        this.email = email;
        this.gstR1FilingType = gstR1FilingType;
        this.registrationType = registrationType;
        this.username = username;
        this.password = password;
        this.isCompositionScheme = isCompositionScheme;
        this.isForeignTaxPerson = isForeignTaxPerson;
        this.isInputServiceDistributor = isInputServiceDistributor;
        this.isTDSApplicable = isTDSApplicable;
        this.isECommerceOperator = isECommerceOperator;
        this.isitC04Applicable = isitC04Applicable;
        this.clientStatus = clientStatus;
        this.contactPersonName = contactPersonName;
        this.contactPersonDesignation = contactPersonDesignation;
        this.contactPersonEmail = contactPersonEmail;
        this.contactPersonOfficeNo = contactPersonOfficeNo;
        this.contactPersonMobileNo = contactPersonMobileNo;
        this.insertedBy = insertedBy;
        this.userId = userId;
        this.ewayBillUserName = ewayBillUserName;
        this.ewayBillPassword = ewayBillPassword;
        this.iceGateUserName = iceGateUserName;
        this.iceGatePassword = iceGatePassword;

    }
}


export class CompanyEdit {
    constructor(
        clientId,
        gstinNumber,
        companyName,
        tradeName,
        code,
        groupName,
        companyType,
        mobileNo,
        email,
        gstR1FilingType,
        registrationType,
        username,
        password,
        isCompositionScheme,
        isForeignTaxPerson,
        isInputServiceDistributor,
        isTDSApplicable,
        isECommerceOperator,
        isitC04Applicable,
        clientStatus,
        contactPersonName,
        contactPersonDesignation,
        contactPersonEmail,
        contactPersonOfficeNo,
        contactPersonMobileNo,
        insertedBy,
        userId,
        ewayBillUserName,
        ewayBillPassword,
        iceGateUserName,
        iceGatePassword
    ) {
        this.clientId = clientId
        this.gstinNumber = gstinNumber;
        this.companyName = companyName;
        this.tradeName = tradeName;
        this.code = code;
        this.groupName = groupName;
        this.companyType = companyType;
        this.mobileNo = mobileNo;
        this.email = email;
        this.gstR1FilingType = gstR1FilingType;
        this.registrationType = registrationType;
        this.username = username;
        this.password = password;
        this.isCompositionScheme = isCompositionScheme;
        this.isForeignTaxPerson = isForeignTaxPerson;
        this.isInputServiceDistributor = isInputServiceDistributor;
        this.isTDSApplicable = isTDSApplicable;
        this.isECommerceOperator = isECommerceOperator;
        this.isitC04Applicable = isitC04Applicable;
        this.clientStatus = clientStatus;
        this.contactPersonName = contactPersonName;
        this.contactPersonDesignation = contactPersonDesignation;
        this.contactPersonEmail = contactPersonEmail;
        this.contactPersonOfficeNo = contactPersonOfficeNo;
        this.contactPersonMobileNo = contactPersonMobileNo;
        this.insertedBy = insertedBy;
        this.userId = userId;
        this.ewayBillUserName = ewayBillUserName;
        this.ewayBillPassword = ewayBillPassword;
        this.iceGateUserName = iceGateUserName;
        this.iceGatePassword = iceGatePassword;
    }

}


export default CompanyAdd;