class PromoterSignatoryModel {
    constructor(fkClientId,
        firstName,
        middleName,
        lastName,
        fatherFirstName,
        fatherMiddleName,
        fatherLastName,
        dob,
        gender,
        mobile,
        phoneNo,
        email,
        designation,
        panNo,
        dinNo,
        isIndian,
        passportNo,
        aadharNo,
        buildingNo,
        floorNo,
        buildingName,
        road,
        area,
        state,
        district,
        pincode,
        isAuthSign,
        isSignatory

    ) {
        this.fkClientId = fkClientId
        this.firstName = firstName
        this.middleName = middleName
        this.lastName = lastName
        this.fatherFirstName = fatherFirstName
        this.fatherMiddleName = fatherMiddleName
        this.fatherLastName = fatherLastName
        this.dob = dob
        this.gender = gender
        this.mobile = mobile
        this.phoneNo = phoneNo
        this.email = email
        this.designation = designation
        this.panNo = panNo
        this.dinNo = dinNo
        this.isIndian = isIndian
        this.passportNo = passportNo
        this.aadharNo = aadharNo
        this.buildingNo = buildingNo
        this.floorNo = floorNo
        this.buildingName = buildingName
        this.road = road
        this.area = area
        this.state = state
        this.district = district
        this.pincode = pincode
        this.isAuthSign = isAuthSign
        this.isSignatory = isSignatory
    }
}


export class PromoterSignatoryEditModel {
    constructor(
        clientPromoterId,
        fkClientId,
        firstName,
        middleName,
        lastName,
        fatherFirstName,
        fatherMiddleName,
        fatherLastName,
        dob,
        gender,
        mobile,
        phoneNo,
        email,
        designation,
        panNo,
        dinNo,
        isIndian,
        passportNo,
        aadharNo,
        buildingNo,
        floorNo,
        buildingName,
        road,
        area,
        state,
        district,
        pincode,
        isAuthSign,
        isSignatory

    ) {
        this.clientPromoterId = clientPromoterId
        this.fkClientId = fkClientId
        this.firstName = firstName
        this.middleName = middleName
        this.lastName = lastName
        this.fatherFirstName = fatherFirstName
        this.fatherMiddleName = fatherMiddleName
        this.fatherLastName = fatherLastName
        this.dob = dob
        this.gender = gender
        this.mobile = mobile
        this.phoneNo = phoneNo
        this.email = email
        this.designation = designation
        this.panNo = panNo
        this.dinNo = dinNo
        this.isIndian = isIndian
        this.passportNo = passportNo
        this.aadharNo = aadharNo
        this.buildingNo = buildingNo
        this.floorNo = floorNo
        this.buildingName = buildingName
        this.road = road
        this.area = area
        this.state = state
        this.district = district
        this.pincode = pincode
        this.isAuthSign = isAuthSign
        this.isSignatory = isSignatory
    }
}
 

export default PromoterSignatoryModel;