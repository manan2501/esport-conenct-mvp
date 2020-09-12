// type snippet rnfs
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {useSelector, useDispatch } from 'react-redux';
import MyEventCard from './myEventCard';
import Loading from '../../../shared/loading';
import { getCurrentProfile, getProfile } from '../../../Redux/actions/profile';
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Button, ListItem, Card, Icon, Avatar } from 'react-native-elements';

const MyEventDetails = ({ navigation, route }) => {
  const {item} = route.params
  const dispatch = useDispatch();
  const [players, setPlayers] = useState([])
  const {userProfile, allEvents} = useSelector((state) =>({ 
    userProfile: state.profile.userProfile,
    allEvents: state.event.allEvents.map(event => ({eventId: event._id,registeredTeamInfo: event.registeredteaminfo})),
  }));

  const handleProfileSubmit = (username) =>{
    if(userProfile.username === username){
      navigation.navigate('Profile');
    }else{
      dispatch(getProfile(username));
      navigation.navigate('Userprofile', {isHostProfile: false});
    }
  }

   useEffect(() =>{
    navigation.setParams({title: item.title});
    
    if(item.teamsize === 1){
      setPlayers([{name: userProfile.name, username: userProfile.username, key: 1}]);
    } else{
      let username = userProfile.username
      let currentEvent = allEvents.filter((event) => event.eventId === item._id)
      let playersDetails = currentEvent[0].registeredTeamInfo.map(players => {
        let currentPlayer
        for(let player of players.teammembersinfo){
          if(player.username === username){
            currentPlayer = players.teammembersinfo
            break
          }
        }
        return currentPlayer
      }).filter(item => item !== undefined)

      let players = playersDetails[0].map((item, i) => ({name: item.name, username: item.username, key: i, teamLeader: item.teamLeader}))
      setPlayers(players);
    }
  },[])

  return (
    <View>
       <Card containerStyle={{margin: 0, borderWidth: 0}} >
        <Card.Title style={styles.mainTitle}>{item.teamsize !== 1 && 'TEAM MEMBERS'}</Card.Title>
        <View style={styles.card}>
          {
            players.map(({name, username, key, teamLeader}) => (
              <TouchableOpacity key={key} onPress={() => handleProfileSubmit(username)}>
                <ListItem containerStyle={styles.listContainer} bottomDivider>
                  <Avatar
                    size="medium"
                    rounded
                    icon={{name:"user", type:"font-awesome-5", color:'white'}}
                  />
                  <ListItem.Content>
                    <ListItem.Title>{name}</ListItem.Title>
                    <ListItem.Subtitle style={{color: '#95bdb5'}}>
                      {teamLeader ? `${username} (Teamleader)` : username}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            ))
          }
        </View>
      </Card>
    </View>
  )
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 2,
    marginBottom: 5,
    backgroundColor: '#232931',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#4ecca3',
  },
  listContainer: {
    backgroundColor: '#232931'
  },
  mainTitle: {
    color: '#eeeeee'
  }
})

export default MyEventDetails;

