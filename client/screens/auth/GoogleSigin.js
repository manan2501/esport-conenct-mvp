import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { signInAsync, signInHostAsync } from '../../Redux/actions/googleAuth';
import { SocialIcon } from 'react-native-elements';
import { loading } from '../../Redux/actions/loading';

const GoogleSignin = ({ title, fromHost, navigation, googleBtnStyle }) => {
  
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if(fromHost){
      dispatch(signInHostAsync(navigation))
    }else{
      dispatch(signInAsync(navigation));
    }
  }

  return (
    <View>
      <SocialIcon
        title={title}
        button
        style={googleBtnStyle}
        type="google"
        onPress={handleLogin}
      />
    </View>
  );
}


export default GoogleSignin;
