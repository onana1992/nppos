import { GET_USER } from './actions';

const initialState = {
    user: null,
    signin: false,
    profil_url: null,
    pro_account: null,
};

function UserReducer(state = initialState, action: any) {

    switch (action.type) {
        case 'SIGN_IN':
            return { ...state, user: action.value, signin: true };

        case 'SIGN_OUT': 
            return { ...state,   user: null, signin: false };

        case 'SET_ACCOUNT':
            return { ...state, pro_account: action.value };

        default:
            return state;
    }
}

export default UserReducer;