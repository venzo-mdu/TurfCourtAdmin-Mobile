import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  getFavGround,
  removefavGround,
} from "../../../firebase/firebaseFunction/groundDetails";
import { UpdateUserData, userData } from "../../../firebase/firebaseFunction/userDetails";
//import CardComponent from "../Common/CardComponent";
import { USERHOME, USERLOGIN } from "../..";
import { IMAGES } from "../../../assets/constants/global_images";
import UserHomeScreen from "../Home";

const { width: viewportWidth } = Dimensions.get('window');

const SLIDER_WIDTH = viewportWidth;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);

const MyFavourite = () => {
  const [Favarotedata, setFavarotedata] = useState([]);
  const [liked, setLiked] = useState(Array(Favarotedata.length).fill(false));
  const [loading, setLoading] = useState(Array(Favarotedata.length).fill(false));
  //const [loading, setLoading] = useState(false);
  // const uid = localStorage.getItem("uid");
  // let isowner = localStorage.getItem("isowner");
  const route = useRoute();
  const { uid } = route.params;
  const navigation = useNavigation();

  const Favarote = async () => {
    const favdata = await getFavGround(uid);
    setFavarotedata(favdata);
  };

  const toggleLike = async (index, data) => {
    let tempLoading = [...loading];
    tempLoading[index] = true;
    setLoading(tempLoading);

    let tempLiked = [...liked];
    tempLiked[index] = !tempLiked[index];
    setLiked(tempLiked);
    if (uid == null || uid == undefined) {
      navigation.navigate(USERLOGIN);
    }

    if (!data?.favarote) {
     // setLoading(true);
      const userDetails = await userData(uid);
      if (uid != null) {
        userDetails?.favarote
          ? userDetails?.favarote.push(data?.ground_id)
          : (userDetails.favarote = [data?.ground_id]);
        const updatedata = await UpdateUserData(userDetails, uid);
        if (updatedata?.status == "success") {
          console.log("update successfully");
          Favarote();
        } else {
          console.error("update data failed");
        }
      }
  //    setLoading(false);
    } else {
      const removedata = await removefavGround(uid, data?.ground_id);
      if (removedata?.status == "success") {
        Favarote();
      }
    }
    tempLoading[index] = false;
    setLoading(tempLoading);
  };

  const handlenavigate = () => {
    // if (isowner == "true") {
    //   navigation.navigate("CourtAdminDashboard");
    // } else {
    //   navigation.navigate("PlayersDashboard");
    // }
  };

  const handleHeartPress = (event, index, likedGroundIdView) => {
    event.stopPropagation();
    if (typeof toggleLike === 'function') {
      toggleLike(index, likedGroundIdView);
    }
  };

  useEffect(() => {
    Favarote();
  }, []);

  // const handleGoBack = () => {
  //   navigation.navigate(USERHOME, { refresh: true });
  // };

  // useEffect(() => {
  //   if (uid != null) {
  //     if (isowner == "true") {
  //       console.log("admin true");
  //       navigation.navigate("CourtAdminDashboard");
  //     }
  //   }
  // }, [isowner, uid, navigation]);
  //console.log("Favarotedata Fav Data", Favarotedata)

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.coverImage[0] }} style={styles.image} resizeMode='cover' />
      <View style={styles.overlay}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="green" />
          <Text style={styles.ratingText}>{item.overallRating}</Text>
        </View>
        <View style={styles.heartContainer}>
          <TouchableOpacity onPress={(event) => handleHeartPress(event, index, item)}>
          {loading[index] ? (
                <ActivityIndicator size="small" color="gray" />
              ) : (
            <Icon name={(item.favarote === true) ? 'heart' : 'heart-o'} size={24} color={(item.favarote === true) ? 'green' : 'gray'} />
        )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{paddingTop:20}}>
      <Text style={styles.title}>{item.groundname}</Text>
      <Text style={styles.text}>{item.overview}</Text>
      <View style={styles.iconContainer}>
        <Image source={IMAGES.LocationIcon} style={{ width: 20, height: 20 }} />
        <Text style={styles.address}>{`${item.street_address}, ${item.city}`}</Text>
      </View>
      </View>
    </View>
    // <CardComponent key={index} data={item} onClick={handleFav} type="user" />
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>My Favourite</Text>
       </View> */}
      <View>
        {Favarotedata.length !== 0 ? (
          <Carousel
            data={Favarotedata}
            renderItem={renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            loop={false}
            autoplay={true}
            autoplayDelay={1000}
            autoplayInterval={3000}
            layout="default"
          />
        ) : (
          <View style={styles.noDataView}>
            <Text>No Favourite is Available</Text>
          </View>
        )}
        {/* {loading && <ActivityIndicator size="large" color="#0000ff" />} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    fontFamily: "Outfit",
  },
  header: {
    backgroundColor: '#108257',
    height: 179,
   // justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    flexDirection:'row',
    paddingTop:25
  },
  headerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '500',
    paddingLeft:50,
  },
  navigateText: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
  },
  noDataView: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 450,
    padding: 16,
   // marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
    overflow: 'hidden', // Ensure the overlay stays within bounds
  },
  image: {
    width: '100%',
    height: 150,
    //borderRadius: 8,
    borderTopLeftRadius:8,
    borderTopRightRadius:8
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
   // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 20,
    fontWeight: '50',
 //   marginTop: 10,
    color: '#000000', // Ensure text is visible over the overlay
  //  position: 'absolute',
   // bottom: 16,
    //left: 16,
    paddingHorizontal:10
  },
  text: {
    fontSize: 16,
  //  marginVertical: 10,
    color: '#757C8D', // Ensure text is visible over the overlay
 //   position: 'absolute',
    top: 15,
   // left: 16,
    paddingHorizontal:10,
    lineHeight:20
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
   // marginTop: 10,
   // position: 'absolute',
  //  bottom: 16,
   // left: 16,
    paddingHorizontal:10
  },
  address: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight:"400",
    color: '#000000', // Ensure text is visible over the overlay
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 16,
    left: 16,
    backgroundColor:"#ffffff",
    borderRadius:22,
    width:60,
    padding:5
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#6B7385',
  },
  heartContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  noDataText: {
    fontSize: 18,
    color: 'red',
   // marginTop: 20
  }
});

export default MyFavourite;
