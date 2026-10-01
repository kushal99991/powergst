import axios from 'axios'
import { string } from 'yup';
import { API_URL } from '../../configs/config';


class companyNewService {
    // ** New Company add
    AddNewCompany(data) {
        console.log(data);
        return axios.post(API_URL + '/api/client', data)
    }

    //**  edit Company
    editCompany(data) {
        console.log(data);
        return axios.post(API_URL + '/api/client/update', data)
    }

    // **  delete company
    deleteCompany(userId, clientId, deletedBy) {

        return axios.post(API_URL + '/api/client/delete?UserId='+ userId +'&ClientId=' + clientId + '&DeletedBy=' + deletedBy )
    }

    // **  Search company
    getCompanyClientId(id) {
        return axios.get(API_URL + '/api/client?Id=' + id)
    }

    // **  Search company with userid
    getCompanyByUserId(payload) {
        return axios.post(API_URL + '/api/client/get-client-by-user-id', payload)
    }

    // Principle place of business
    // **  Add- Principle place of business
    addPrinciplePlaceofBusiness(data) {
        console.log(data);
        return axios.post(API_URL + '/api/client/add-principle-place-of-business', data)
    }

    editPrinciplePlaceofBusiness(data) {
        console.log(data);
        return axios.post(API_URL + '/api/client/update-principle-place-of-business', data)
    }


    // add nature of business
    addNatureofbusiness(data) {
        console.log(data);
        return axios.post(API_URL + '/api/client/add-nature-of-business', data)
    }

    editNatureofbusiness(data) {
        console.log(data);
        return axios.post(API_URL + '/api/client/update-nature-of-business', data)
    }

    // add-client-promoter-signatory
    addClientPromoterSignatory(data) {
        console.log(data);
        return axios.post(API_URL + '/api/client/add-client-promoter-signatory', data)
    }

    editClientPromoterSignatory(data) {
        return axios.post(API_URL + '/api/client/update-client-promoter-signatory', data)
    }

    // get-client-promoter-signatory-by-id
    getClientPromoterSignatory(id , IsSignatory ) {
        console.log('get promoter data ' + id );
        return axios.get(API_URL + '/api/client/get-client-promoter-signatory-by-Client-id?ClientId=' + id + '&IsSignatory='+ IsSignatory )
    }


    // ** Bank detail
    addBankDetail(data) {
        return axios.post(API_URL + '/api/client/add-client-bank', data)
    }

    editBankDetail(data) {
        return axios.post(API_URL + '/api/client/update-client-bank', data)
    }

    getBankList(id) {
        return axios.get(API_URL + '/api/client/get-client-bank-by-id?Id=' + id)
    }

    deleteBankId(id) {
        return axios.post(API_URL + '/api/client/delete-client-bank?Id=' + id)
    }


    // ** add-client-commodities
    addClientCommodities(data) {
        return axios.post(API_URL + '/api/client/add-client-commodities', data)
    }

    editClientCommodities(data) {
        return axios.post(API_URL + '/api/client/add-client-commodities', data)
    }

    getClientCommodities(id) {
        return axios.get(API_URL + '/api/client/get-client-Commodities-by-id', id)
    }

    deleteSignPromoterId(id) {
         return axios.post(API_URL + '/api/client/delete-client-promoter-signatory?Id=' + id)
    }

    // Validate GST
    getGSTINValidate(gstin) {
        return axios.post(API_URL + '/api/client/validate-gstin' , gstin )
    }

    //  Company logged Data
    getCompanyloggedData(month, year) {
        return axios.get(API_URL + '/api/client/get-company-logged-data?Month=' + month + '&Year='+ year );
    }

}

export default new companyNewService();