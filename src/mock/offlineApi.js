import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import cryptoFunc from '../auth/crypto/crypto';
import errorCodeConfig from '../configs/apiErrorCodeConfig';

// Demo test credentials for local offline usage
export const OFFLINE_DEMO_USERS = [
  {
    userId: '1001',
    email: 'demo@powergst.com',
    mobile: '9876543210',
    password: 'Demo@123',
    firstName: 'Demo',
    lastName: 'User',
    fkCategoryId: 1,
    subscriptionId: 'SUB-DEMO-001',
    isMultipleDownload: true,
    isMultipleCompanyDelete: true
  },
  {
    userId: '1002',
    email: 'admin@powergst.com',
    mobile: '9123456780',
    password: 'Admin@123',
    firstName: 'Admin',
    lastName: 'PowerGST',
    fkCategoryId: 2,
    subscriptionId: 'SUB-DEMO-002',
    isMultipleDownload: true,
    isMultipleCompanyDelete: true
  }
];

export const OFFLINE_DEMO_COMPANIES = [
  {
    srNo: 1,
    code: 'C001',
    clientId: 501,
    userClientId: 9001,
    parentUserClientId: 9001,
    parentFK: 9001,
    companyName: 'Demo Traders Private Limited',
    tradeName: 'Demo Traders',
    gstinNumber: '24AAACD1234E1Z5',
    groupName: 'Demo Group',
    gstR1FilingType: 'Monthly',
    regType: 'Regular',
    regTypeId: 1,
    registrationTypeLabel: 'Regular',
    contactPersonName: 'Demo User',
    contactPersonMobileNo: '9876543210',
    state: 'Gujarat',
    stateName: 'Gujarat',
    stateId: 24,
    isCMP08Applicable: false,
    username: cryptoFunc.encrypt('demo.portal'),
    password: cryptoFunc.encrypt('Portal@123'),
    totalRowCount: 2
  },
  {
    srNo: 2,
    code: 'C002',
    clientId: 502,
    userClientId: 9002,
    parentUserClientId: 9002,
    parentFK: 9002,
    companyName: 'Sample Industries Limited',
    tradeName: 'Sample Industries',
    gstinNumber: '27AABCS5678F1ZK',
    groupName: 'Demo Group',
    gstR1FilingType: 'Quarterly',
    regType: 'Regular',
    regTypeId: 1,
    registrationTypeLabel: 'Regular',
    contactPersonName: 'Admin PowerGST',
    contactPersonMobileNo: '9123456780',
    state: 'Maharashtra',
    stateName: 'Maharashtra',
    stateId: 27,
    isCMP08Applicable: false,
    username: cryptoFunc.encrypt('admin.portal'),
    password: cryptoFunc.encrypt('Portal@123'),
    totalRowCount: 2
  }
];

const STATES_LIST = [
  { stateId: 24, stateName: 'Gujarat', stateCode: '24' },
  { stateId: 27, stateName: 'Maharashtra', stateCode: '27' },
  { stateId: 7, stateName: 'Delhi', stateCode: '07' },
  { stateId: 29, stateName: 'Karnataka', stateCode: '29' },
  { stateId: 33, stateName: 'Tamil Nadu', stateCode: '33' }
];

const initOfflineMockAdapter = () => {
  // Check if mock mode is disabled explicitly
  if (import.meta.env.VITE_USE_MOCK_API === 'false') {
    return;
  }

  const mock = new MockAdapter(axios, { delayResponse: 100 });

  // 1. Pre-check email/mobile existence
  mock.onPost(/\/api\/login\/check-user-email-mobile/i).reply((config) => {
    try {
      const data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      const identifier = (data?.userEmail || data?.userEmailMobileNo || '').trim().toLowerCase();
      const exists = OFFLINE_DEMO_USERS.some(
        (u) => u.email.toLowerCase() === identifier || u.mobile === identifier
      );
      return [
        200,
        {
          statusCode: errorCodeConfig.Success,
          responseStatus: 'true',
          data: exists,
          errorMessage: exists ? '' : 'Account does not exist'
        }
      ];
    } catch {
      return [200, { statusCode: errorCodeConfig.Success, responseStatus: 'true', data: true }];
    }
  });

  // 2. Authentication Login
  mock.onPost(/\/api\/login$/i).reply((config) => {
    let credentials = {};
    try {
      if (typeof config.data === 'string') {
        const decrypted = cryptoFunc.decrypt(config.data);
        credentials = decrypted ? JSON.parse(decrypted) : JSON.parse(config.data);
      } else {
        credentials = config.data;
      }
    } catch (e) {
      console.warn('Mock login payload parse warning', e);
    }

    const email = (credentials?.loginEmail || credentials?.email || '').trim().toLowerCase();
    const password = credentials?.password || '';

    const user = OFFLINE_DEMO_USERS.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      return [
        200,
        {
          statusCode: errorCodeConfig.Unauthorized,
          responseStatus: 'false',
          errorMessage: 'User account does not exist. Please register first.'
        }
      ];
    }

    if (user.password !== password) {
      return [
        200,
        {
          statusCode: errorCodeConfig.Unauthorized,
          responseStatus: 'false',
          errorMessage: 'Incorrect password entered.'
        }
      ];
    }

    const authPayload = {
      t: `offline_token_${user.userId}_${Date.now()}`,
      rToken: `offline_refresh_${user.userId}`,
      userId: user.userId,
      ud: {
        userId: user.userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        subscriptionId: user.subscriptionId,
        fkCategoryId: user.fkCategoryId,
        role: 'Admin'
      }
    };

    return [
      200,
      {
        statusCode: errorCodeConfig.Success,
        responseStatus: 'true',
        data: cryptoFunc.encrypt(JSON.stringify(authPayload)),
        errorMessage: ''
      }
    ];
  });

  // 3. User Companies List
  mock.onPost(/\/api\/client\/get-client-by-user-id/i).reply(() => {
    return [
      200,
      {
        statusCode: errorCodeConfig.Success,
        responseStatus: 'true',
        data: OFFLINE_DEMO_COMPANIES,
        errorMessage: ''
      }
    ];
  });

  // 4. Selected Company Logged Data / Period Info
  mock.onGet(/\/api\/client\/get-company-logged-data/i).reply(() => {
    return [
      200,
      {
        statusCode: errorCodeConfig.Success,
        responseStatus: 'true',
        data: {
          clientId: 501,
          financialYear: '2024-2025',
          financialYearId: 2024,
          month: '07',
          monthName: 'July'
        },
        errorMessage: ''
      }
    ];
  });

  // 5. State Master
  mock.onGet(/\/api\/master\/get-state/i).reply(() => {
    return [
      200,
      {
        statusCode: errorCodeConfig.Success,
        responseStatus: 'true',
        data: STATES_LIST,
        errorMessage: ''
      }
    ];
  });

  // 6. User Logout
  mock.onAny(/\/api\/login\/log-out/i).reply(() => {
    return [200, { statusCode: errorCodeConfig.Success, responseStatus: 'true', data: true }];
  });

  // 7. General fallback for unmocked endpoints
  mock.onAny().passThrough();
};

initOfflineMockAdapter();
export default initOfflineMockAdapter;
