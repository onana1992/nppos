import { GET_USER } from './actions';

const initialState = {
    user: null,
    signin: false,
    profil_url: null,
    mode: "pro",
    pro_account: null,
    pro_accounts: [],
    enterprise_account:null
};

function UserReducer(state = initialState, action: any) {

    switch (action.type) {
        case 'SIGN_IN':
            return { ...state, user: action.value, signin: true };

        case 'SIGN_OUT': 
            return { ...state,   user: null, signin: false };

        case 'SET_ACCOUNT':
            return { ...state, account: action.value };

        case 'SET_MODE':
            return { ...state, mode: action.value };

        case 'SET_PRO_ACCOUNT':
            return { ...state, pro_accounts: action.value };

        case 'SET_ENTERPRISE_ACCOUNT':
            return { ...state, enterprise_account: action.value };

        default:
            return state;
    }
}

export default UserReducer;