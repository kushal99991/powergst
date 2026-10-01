class PrincipalPlaceModel {
    constructor(fkClientId, buildingNo, floorNumber, buildingName, roadStreet, area, district,
        state, pincode) {
        this.fkClientId = fkClientId
        this.buildingNo = buildingNo
        this.floorNumber = floorNumber
        this.buildingName = buildingName
        this.roadStreet = roadStreet
        this.area = area
        this.district = district
        this.state = state
        this.pincode = pincode
    }
}


export class PrincipalPlaceEditModel {
    constructor(clientPrinciplePlaceId, fkClientId, buildingNo, floorNumber, buildingName, roadStreet, area, district,
        state, pincode) {
        this.clientPrinciplePlaceId = clientPrinciplePlaceId
        this.fkClientId = fkClientId
        this.buildingNo = buildingNo
        this.floorNumber = floorNumber
        this.buildingName = buildingName
        this.roadStreet = roadStreet
        this.area = area
        this.district = district
        this.state = state
        this.pincode = pincode
    }
}





export default PrincipalPlaceModel;
