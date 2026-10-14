
const errorCodeConfig = {

    APIDefaultCode: {
        Default: 0,
        Success: 1,
        Exception: -1,
        PassCompulsoryFields: -100,
        EmailVerificationPending: -1104,
        MobileVerificationPending: -1105,
        GovtOTPExpire: -11005,
        InternalSeverError: 500,
        downloadOTPExpire : -12005
    },
    // Registration
    APIUserModuleRegistrationErrorCode: {
        EmailAlreadyExists: -1001,
        MobileNumberAlreadyExist: -1002,
        RegistrationFailed: -1003
    },

    // Login
    APIUserModuleLoginErrorCode: {
        IncorrectPassword: -1101,
        IncorrectEmailMobile: -1102,
        UserNotFound: -1103,
        EmailVerificationPending: -1104,
        MobileVerificationPending: -1105,
    },

    // Action Master
    APIUserModuleActionErrorCode: {
        ActionNameAlreadyExists: -1201,
        ActionNotAdded: -1202,
        ActionNotUpdated: -1203,
        ActionNotFound: -1204,
        ActionNotDeleted: -1205
    },

    // Form Master
    APIUserModuleFormErrorCode: {
        FormNameAlreadyExists: -1301,
        FormNotAdded: -1302,
        FormNotFound: -1303,
    },

    // Role Master
    APIUserModuleRoleErrorCode: {
        RoleNameAlreadyExists: -1401,
        RoleNotAdded: -1402,
        RoleNotFound: -1403
    },

    // Form Action Master
    APIUserModuleFormActionErrorCode: {
        FormActionNotFound: -1501
    },

    // User Master
    APIUserModuleUserMasterErrorCode: {
        ProfileNotUpdated: -1601,
        MailSentSuccessfully: -1602,
        PasswordUpdated: -1603
    },

    // Client Master
    APIUserModuleClientMasterAPIErrorCode: {
        ClientNotAdded: -1701,
        ClientNotFound: -1702
    },

    //  User Client Mapping
    APIUserClientMasterAPIErrorCode: {
        UserClientNotFound: -1801
    },

    // Client Year Mapping
    APIClientYearMappingAPIErrorCode: {
        ClientYearMappingNotAdded: -1901,
    }
}

export default errorCodeConfig;