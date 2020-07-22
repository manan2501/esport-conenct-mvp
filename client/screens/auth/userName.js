import React from 'react';
import { View, StyleSheet } from "react-native";
import { username } from '../../Redux/actions/auth';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Button, Input, Icon } from 'react-native-elements';

const userNameSchema = yup.object({
  userName: yup.string().required().min(3),
  bio: yup.string().required(),
});

const UserName = ({route}) => {

  const dispatch = useDispatch();
  const {name} = route.params
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          userName: '',
          bio: '',
        }}
        validationSchema={userNameSchema}
        onSubmit={(values) => {
          dispatch(username(values.userName, values.bio, name));
        }}
      >
        {(formikprops) => (
          <View>
            <Input
              leftIcon={<Icon name="face" size={24} color="#4ecca3" />}
              style={styles.input}
              placeholder={'Unique Username...'}
              onChangeText={formikprops.handleChange('userName')}
              value={formikprops.values.userName}
              onBlur={formikprops.handleBlur('userName')}
              errorMessage={
                formikprops.touched.userName && formikprops.errors.userName
              }
            />
            <Input
              style={styles.input}
              multiline
              placeholder={'Tell Us About You...'}
              onChangeText={formikprops.handleChange('bio')}
              value={formikprops.values.bio}
              onBlur={formikprops.handleBlur('bio')}
              errorMessage={formikprops.touched.bio && formikprops.errors.bio}
            />

            <Button buttonStyle={styles.button} onPress={formikprops.handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
  },
  button: {
    marginHorizontal: 40,
    marginVertical: 40,
    width: 100,
    alignSelf: 'center',
    marginTop: 5,
  },
});
 
export default UserName;