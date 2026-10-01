export default class Registration {
    constructor(userId, firstName, lastName, email, mobile, password, roleId, referredBy, sourceType,parentFK,companyName,clientId,
        categoryId, memberShipNumber, IsMultipleCompanyDelete  ) {
        this.userId = userId
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.mobile = mobile
        this.password = password
        this.roleId = roleId
        this.referredBy = referredBy
        this.sourceType = sourceType
        this.parentFK = parentFK
        this.companyName = companyName
        this.clientId = clientId
        this.categoryId = categoryId
        this.memberShipNumber = memberShipNumber
        this.IsMultipleCompanyDelete = IsMultipleCompanyDelete
    }
}