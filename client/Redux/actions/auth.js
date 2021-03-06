import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_MYPROFILE,
  CLEAR_EVENTS,
  CLEAR_PROFILES,
  CLEAR_GLOBAL_POSTS,
  CLEARSEARCHEDEVENTS,
  USER_LOADED_NO_USERNAME,
  CREATE_USERNAME,
} from './types';
import axios from 'axios';
import setAuthToken from '../setAuthToken';
import AsyncStorage from '@react-native-community/async-storage';
import { ipAddress } from '../ipaddress';
import { createProfile, getCurrentProfile, createHostProfile } from './profile';
import { setAlert } from './alert';
import { loading } from './loading';

//  Load User
export const loadUser = (navigation) => async (dispatch) => {
  // set header
  dispatch(loading(true))
  const token = await AsyncStorage.getItem('token');
  if (token !== null) {
    setAuthToken(token);
    // console.log('token set successfull');
  } else {
    // console.log('notoken');
  }
  
  try {
    let res = await axios.get(`http://${ipAddress}/api/login`);
    console.log(res.data)
    if(res.data.user.username.length === 0){
      dispatch({
        type: USER_LOADED_NO_USERNAME,
        payload: {},
      });
    }else{
      dispatch({
        type: USER_LOADED,
        payload: {user: res.data.user, fromHost: res.data.fromHost},
      });
    }
    dispatch(loading(false))
  } catch (err) {
    console.log('error from loaduser: ', err)
    dispatch({
      type: AUTH_ERROR,
    });
    dispatch(loading(false))
  }
};
export const username = (username, bio, email, cocTag, fromHost) => async (dispatch) =>{
  dispatch(loading(true))
  try {
    const res = await axios.post(
      `http://${ipAddress}/api/signup/${email}/${username}`,
      {fromHost}
    );

    dispatch({
      type: CREATE_USERNAME,
      payload: res.data,
    });


    let argu = {username,bio};
    let arguPlayer = {username,bio, cocTag};
    
    console.log('username succes');
    if(fromHost){
      dispatch(createHostProfile(argu))
      dispatch(loadUser());
    }else{
      dispatch(createProfile(arguPlayer));
      dispatch(loadUser());
    }

    dispatch(loading(false))
  } catch (err) {
    const errors = err.response.data.errors;
    // this errors are the errors send form the backend
    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    }
    dispatch(loading(false))
  }
}
// Register user
export const register = (name, email, password) => async (dispatch) => {
  dispatch(loading(true))
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post(
      `http://${ipAddress}/api/signup`,
      body,
      config
    );

    console.log('registering....');

    await AsyncStorage.setItem('token', res.data.token);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    console.log('register succes');

    
    dispatch(createProfile({name}))
    dispatch(loading(false))
  } catch (err) {
    const errors = err.response.data.errors;
    // this errors are the errors send form the backend
    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    }
    dispatch(loading(false))
  }
};

// Login user
export const login = (email, password) => async (dispatch) => {
  dispatch(loading(true))
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    // console.log('wait logging in......');
    const res = await axios.post(
      `http://${ipAddress}/api/login`,
      body,
      config
    );

    await AsyncStorage.setItem('token', res.data.token);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
    // Userloaded jaruri hai iske bina header mai token save nahi hongi isliye getmyprofile mai error aa rahi hai

    dispatch(getCurrentProfile());
    dispatch(loading(false))
    // console.log('logged in succesfull......');
  } catch (err) {
    const errors = err.response.data.errors; // This errors will come from backend
    // that we setted as errors.array
    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    }
    dispatch(loading(false))
  }
};

// Logout / Clear Profile
export const logout = () => async (dispatch) => {
  dispatch({ type: CLEAR_MYPROFILE });
  dispatch({ type: CLEAR_PROFILES });
  dispatch({ type: CLEARSEARCHEDEVENTS });
  dispatch({ type: CLEAR_EVENTS });
  dispatch({ type: CLEAR_GLOBAL_POSTS });
  dispatch({ type: LOGOUT });
  await AsyncStorage.removeItem('token');
};
