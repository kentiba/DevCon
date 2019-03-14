import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../../utils/setAuthToken';

import {GET_ERRORS, SET_CURRENT_USER} from './actionTypes';

//Register user
export const registerUser = (userData, history) => dispatch => {
    axios
        .post('/api/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data,
            }),
        );
};

//Login user - get user token

export const loginUser = (userData, history) => dispatch => {
    axios
        .post('/api/users/login', userData)
        .then(res => {
            //Save to localStorage
            const {token} = res.data;
            //Set token to localStorage
            localStorage.setItem('jwtToken', token);
            //Set token to authHeader
            setAuthToken(token);
            //Decode tp get user data
            const decoded = jwt_decode(token);
            //set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data,
            }),
        );
};

//set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
    };
};

//log user out
export const logoutUser = () => dispatch => {
    //remove token from local storage
    localStorage.removeItem('jwtToken');
    //remove auth header for future requests
    setAuthToken(false);
    //set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};
