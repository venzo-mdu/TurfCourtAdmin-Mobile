import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
//import { useNavigate } from 'react-router-native';
//import CardComponent from './CardComponent'; // Adjust the path as needed
import { getgroundData } from '../../../firebase/firebaseFunction/groundDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardComponent from '../../../components/molecules/CardComponent';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CardSlider from './CardSlider';
import { IMAGES } from '../../../assets/constants/global_images';
import { ADDARENA, ADMINTOPTABNAVIGATION } from '../..';
import AdminTopTabNavigation from '../../../routing/AdminTopTabNavigation';

const indexArena = () => {
 // const uid = AsyncStorage.getItem("uid");
  //const isowner = localStorage.getItem("isowner");
  const [groundData, setGrounddata] = useState([]);
  const [uid, setUid] = useState([]);
  const route = useRoute();
  const { refresh, refreshViews } = route.params || {};
  const navigation = useNavigation();
console.log("uid", uid);
//console.log("groundData", groundData)

const getUserData = async () => {
  try {
    const value = await AsyncStorage.getItem('uid');
    console.log("value", value)
    if (value) {
      //const user = await userData(parsedValue?.user_id);
      setUid(JSON.parse(value));
    }
  } catch (error) {
    console.error("Error retrieving user data", error);
  }
};

useEffect(() => {
  getUserData();
 // getLocation();
}, []);

  const getgroundDetails = async () => {
    let response = await getgroundData(uid);
    setGrounddata(response);
  };

  const handleCreateground = () => {
    //navigate("/courtadmin/myarena");
    navigation.navigate(ADMINTOPTABNAVIGATION)
  };

  // useEffect(() => {
  //   if (uid != null) {
  //     if (isowner == "false") {
  //       navigate("/players/dashboard");
  //     }
  //   } else {
  //     navigate("/players/dashboard");
  //   }
  // }, [isowner, uid, navigate]);

  useEffect(() => {
    getgroundDetails();
  }, [uid]);

  useEffect(() => {
    if (refresh || refreshViews) {
    getgroundDetails();
    }
  }, [refresh, refreshViews]);

  // useEffect(() => {
  //   if (refreshViews) {
  //   getgroundDetails();
  //   }
  // }, [refreshViews]);
  useFocusEffect(
    useCallback(() => {
      if (refresh) {
        getgroundDetails();
      }
    }, [refresh])
  );


  useFocusEffect(
    useCallback(() => {
      if (refreshViews) {
        getgroundDetails();
      }
    }, [refreshViews])
  );

  

  const selectGround = (ground_id, index) => {
    // Handle ground selection logic
  };

  const handleHeartPress = (event, index, item) => {
    // Handle heart press logic
  };

  const handleBook = (ground_id, userId) => {
    // Handle booking logic
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Near By Court</Text>
        <TouchableOpacity style={styles.seeAllContainer} onPress={handleCreateground}>
          <Text style={styles.headerSeeAllText}>See All</Text>
          <Icon name="chevron-right" size={18} color="#4CA181" style={styles.rightArrowIcon} />
        </TouchableOpacity>
      </View> */}
      {groundData.length > 0 ? (
        <>
        <CardSlider filteredGrounds={groundData} userId={uid} />
        <TouchableOpacity onPress={handleCreateground} style={styles.addArenaButton}>
        <Image source={IMAGES.AddArenaButton} />
        </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.noDataButton} onPress={handleCreateground}>
        <View>
        <Image source={IMAGES.AddArenaGround} style={styles.addArenaImage} resizeMode='cover' />
        </View>
        <View style={styles.addArenaNonUser}>
          <Text style={styles.noDataButtonText}>Add Arena</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    position: 'relative',
  },
  // header: {
  //   width: '100%',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingHorizontal: 8,
  //  // paddingTop: 60,
  //   bottom: 0,
  //   top:0
  // },
  // headerText: {
  //   fontSize: 18,
  //   fontWeight: '500',
  //   color: '#000000',
  // },
  // headerSeeAllText: {
  //   fontSize: 17,
  //   fontWeight: '500',
  //   color: '#4CA181',
  // },
  // seeAllContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // rightArrowIcon: {
  //   fontSize: 18,
  //   paddingLeft: 4,
  // },
  addArenaImage:{
    resizeMode:'cover'
  },
  noDataButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: '#192335',
    padding: 16,
    borderRadius: 8,
    //width: 120,
    paddingHorizontal:35,
  },
  addArenaButton: {
    position: 'absolute',
    alignSelf:'flex-end',
    bottom: 30,  // Adjust this value to move the button higher or lower
    right: 0,    // Adjust this value to move the button more to the left or right
    width: 80,   // Adjust the size of the button as needed
    height: 80,  // Adjust the size of the button as needed
    //justifyContent:'flex-end'
  },
  noDataButton: {
    alignItems: 'center',
    padding: 30,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    width: Dimensions.get('window').width * 0.8,
    borderStyle:'dashed',
  },
  addArenaNonUser:{
    paddingTop:20
  }
});

export default indexArena;
