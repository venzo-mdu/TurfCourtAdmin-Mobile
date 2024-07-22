import React, {useState, useEffect} from 'react';
import { View, Text, Button, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USERBOOKINGVIEW, USERLOGIN, USERMYFAVOURITE, USERPROFILE } from '../..';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { userData } from '../../../firebase/firebaseFunction/userDetails';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IMAGES } from '../../../assets/constants/global_images';

const indexProfile = ({ navigation }) => {
  const [uid, setUid] = useState('');
  const [details, setDetails] = useState({});
  const [tempdetails, setTempDetails] = useState({});
  const route = useRoute();
  const { refreshProfiles } = route.params  || {};
  //const navigation = useNavigation();

  console.log("uid Values", uid)
  console.log("details123", details)
  useEffect(() => {
    const getUserData = async () => {
      try {
        const value = await AsyncStorage.getItem('uid');
        if (value) {
          setUid(JSON.parse(value));
        }
      } catch (error) {
        console.error("Error retrieving user data", error);
      }
    };

    getUserData();
  }, []);

  async function profileDetail() {
    const userProfile = await userData(uid);
    setDetails(userProfile);
    setTempDetails(userProfile);
  }

  useEffect(() => {
    profileDetail();
  }, [uid]);

  useEffect(() => {
    profileDetail();
  }, [refreshProfiles]);


  const handleBooking = () => {
    navigation.navigate(USERBOOKINGVIEW);
  }

  const handleFav = () => {
    navigation.navigate(USERMYFAVOURITE, { uid: uid});
  }

  const handleProfile = () => {
    navigation.navigate(USERPROFILE, { uid: uid, userDetails: details});
  }


  const handleLogout = async () => {
    await AsyncStorage.removeItem('res-data');
    navigation.replace(USERLOGIN);
  };

  return (
    <View style={styles.container}>
      {/* <Text>Profile Screen</Text> */}
      {
        details && 
        <View style={styles.profileContainer}>
        <Image
          source={{ uri: details.profileimg }}
          style={styles.profileImage}
        />
        <Text style={styles.nameText}>{details.username}</Text>
        <Text style={styles.phoneText}>{details.phonenumber}</Text>
      </View>
      }
      

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleProfile}>
          {/* <Icon name="user" size={20} color="#108257" /> */}
          <Image source={IMAGES.MyProfileIcons} style={styles.profileMenuIcons} />
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleBooking}>
          {/* <Icon name="book" size={20} color="#108257" /> */}
          <Image source={IMAGES.MyBookingIcons} style={styles.profileMenuIcons} />
          <Text style={styles.menuText}>My Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleFav}>
          {/* <Icon name="heart" size={20} color="#108257" /> */}
          <Image source={IMAGES.MyFavoriteIcons} style={styles.profileMenuIcons} />
          <Text style={styles.menuText}>My Favorite</Text>
        </TouchableOpacity>
      </View>
      <View style={{paddingTop:30}}>
      <TouchableOpacity onPress={handleLogout}>
          {/* <Icon name="heart" size={20} color="#108257" /> */}
          <Text style={styles.logoutStyle}>Logout</Text>
        </TouchableOpacity>
        </View>
      {/* <Button title="Logout" style={styles.logoutStyle} onPress={handleLogout} /> */}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  phoneText: {
    fontSize: 16,
    color: '#555',
  },
  menuContainer: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 18,
    color:'#252525',
    fontWeight:'400'
  },
  logoutStyle:{
      backgroundColor:'#3A3A3A',
      width: Dimensions.get('window').width * 0.9,
      height:50,
      justifyContent:'center',
      textAlign:'center',
      color:'#ffffff',
      borderRadius:22,
     // alignSelf:'center'
     paddingTop:10,
     fontSize:20
      // padding:20
  },
  profileMenuIcons:{
    width:40,
    height:40,
    resizeMode:'cover'
  }
});

export default indexProfile;