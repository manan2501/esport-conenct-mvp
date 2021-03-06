import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import * as yup from 'yup';
import { View, Platform,  StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const eventSchema = yup.object({
  description: yup.string().required(),
  game: yup.string().required(),
  time: yup.string(),
  contact: yup.string().required(),
  title: yup.string().required(),
  prizepool: yup.number().required(),
  entryFee: yup.number(),
});

const AddEvent = ({ setModalOpen }) => {
  const hostProfile = useSelector((state) => state.profile.userProfile);

  const navigation = useNavigation();

  const [typeTourn, setTypeTourn] = useState('');

  //  For the current date
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [therealtime, setTheRealTime] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let hour = currentDate.getHours();
    let min = currentDate.getMinutes();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let day = currentDate.getDate();
    setTheRealTime(`${day}-${month + 1}-${year} ${hour}:${min}:00`);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View
      style={{
        padding: 10,
      }}
    >
      <Formik
        initialValues={{
          description: '',
          game: '',
          time: '',
          entryFee: '',
          prizepool: '',
          teamsize: '',
          title: '',
          contact: '',
          hostedBy: '',
          hostedById: '',
        }}
        validationSchema={eventSchema}
        onSubmit={(values, actions) => {
          let currentDatetime = moment(therealtime, 'DD-MM-YYYY hh:mm:ss');
          values.time = currentDatetime;
          values.hostedBy = hostProfile.username;
          values.hostedById = hostProfile.user;
          if (!values.entryFee) {
            values.entryFee = 'FREE';
          }

          navigation.navigate('Confirm Event', { info: values });
          setModalOpen();
        }}
      >
        {(formikprops) => (
          <View>
            <RNPickerSelect
              onValueChange={(value) =>
                formikprops.setFieldValue('game', value)
              }
              items={[
                { label: 'PUBG', value: 'PUBG'},
                { label: 'COD', value: 'COD' },
                { label: 'Clash Royale', value: 'Clash Royale' },
                { label: 'Clash of Clans', value: 'Clash of Clans' },
              ]}
              style={{...pickerSelectStyles}}
              placeholder={{
                label: 'Select a Game...',
                value: null,
                color: '#bec2bf',
              }}
            />
            <Input
              placeholder="Tournament Name"
              onChangeText={formikprops.handleChange('title')}
              value={formikprops.values.title}
              onBlur={formikprops.handleBlur('title')}
              errorMessage={
                formikprops.touched.title && formikprops.errors.title
              }
            />
            <Input
              multiline
              placeholder="Game Description"
              onChangeText={formikprops.handleChange('description')}
              value={formikprops.values.description}
              onBlur={formikprops.handleBlur('description')}
              errorMessage={
                formikprops.touched.description &&
                formikprops.errors.description
              }
            />
            <View style={styles.timeBtnView}>
              <Button
                buttonStyle={styles.btnStyle}
                onPress={showDatepicker}
                title="Add date of event"
              />
              <Button
                buttonStyle={styles.btnStyle}
                onPress={showTimepicker}
                title="Add time of event"
              />
            </View>
            {!show && therealtime !== '' && (
              <Text style={styles.time}>
                {moment(therealtime, 'DD-MM-YYYY hh:mm:ss').toString()}
              </Text>
            )}
            <RNPickerSelect
              onValueChange={(value) => setTypeTourn(value)}
              items={[
                { label: 'FREE', value: 'FREE' },
                { label: 'PAID', value: 'Paid' },
              ]}
              style={{...pickerSelectStyles}}
              placeholder={{
                label: 'Type of Tournament...',
                value: null,
                color: '#bec2bf',
              }}
            />
            {typeTourn == 'Paid' ? (
              <Input
                placeholder="Entry Fees..."
                onChangeText={formikprops.handleChange('entryFee')}
                value={`${formikprops.values.entryFee}`}
                onBlur={formikprops.handleBlur('entryFee')}
                errorMessage={
                  formikprops.touched.entryFee && formikprops.errors.entryFee
                }
              />
            ) : null}
            <Input
              placeholder="Prizepool.."
              onChangeText={formikprops.handleChange('prizepool')}
              value={`${formikprops.values.prizepool}`}
              onBlur={formikprops.handleBlur('prizepool')}
              errorMessage={
                formikprops.touched.prizepool && formikprops.errors.prizepool
              }
            />
            <RNPickerSelect
              onValueChange={(value) =>
                formikprops.setFieldValue('teamsize', value)
              }
              items={[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
                { label: '6', value: '6' },
                { label: '7', value: '7' },
                { label: '8', value: '8' },
                { label: '9', value: '9' },
                { label: '10', value: '10' },
              ]}
              style={{...pickerSelectStyles}}
              placeholder={{
                label: 'Team Size...',
                value: null,
                color: '#bec2bf',
              }}
            />
            <Input
              multiline
              placeholder="Contact Number"
              onChangeText={formikprops.handleChange('contact')}
              value={formikprops.values.contact}
              onBlur={formikprops.handleBlur('contact')}
              errorMessage={
                formikprops.touched.contact && formikprops.errors.contact
              }
            />
              <Button
                onPress={formikprops.handleSubmit}
                title="Submit For Verification"
              />
          </View>
        )}
      </Formik>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
        {/* <View>
          <Text>
            Seems like you haven't set the date correctly,set it and then you
            can submit for verification
          </Text>
        </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  time: {
    marginHorizontal: 7,
    marginVertical: 15,
    fontSize: 17,
  },
  timeBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btnStyle: {
    backgroundColor: 'grey',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: '#eeeeee',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: '#eeeeee',
    paddingRight: 30,
     // to ensure the text is never behind the icon
  },
});

export default AddEvent;
