import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  FlatList,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import {IMAGES} from '../../../assets/constants/global_images';
import {useNavigation} from '@react-navigation/native';
import {
  ADMINTOPTABNAVIGATION,
  USERALLGROUND,
  USERGROUNDBOOKING,
  USERGROUNDDETAILS,
  USERLOGIN,
} from '../..';
import {
  UpdateUserData,
  userData,
} from '../../../firebase/firebaseFunction/userDetails';
import {removefavGround} from '../../../firebase/firebaseFunction/groundDetails';
import {COLORS} from '../../../assets/constants/global_colors';
import {hS} from '../../../utils/metrics';
import IonIcons from 'react-native-vector-icons/Ionicons';

const {width: viewportWidth} = Dimensions.get('window');

const SLIDER_WIDTH = viewportWidth;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1.0);

const data = [
  {
    title: 'Card 1',
    text: 'This is card 1',
    image:
      'https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/groundImages%2F6Ip56SzHQycRTqwN6nOl7iMZd193%2Fgallery3.svg?alt=media&token=47840191-00a6-4d95-b3d6-6e8cf45638fa',
    icon: 'star',
    points: 5,
  },
  {
    title: 'Card 2',
    text: 'This is card 2',
    image:
      'https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/groundImages%2F6Ip56SzHQycRTqwN6nOl7iMZd193%2Fgallery3.svg?alt=media&token=47840191-00a6-4d95-b3d6-6e8cf45638fa',
    icon: 'star',
    points: 10,
  },
  {
    title: 'Card 3',
    text: 'This is card 3',
    image:
      'https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/groundImages%2F6Ip56SzHQycRTqwN6nOl7iMZd193%2Fgallery3.svg?alt=media&token=47840191-00a6-4d95-b3d6-6e8cf45638fa',
    icon: 'star',
    points: 8,
  },
];

const CardSlider = ({filteredGrounds, userId, onGroundsUpdated}) => {
  const [liked, setLiked] = useState(Array(filteredGrounds.length).fill(false));
  const [loading, setLoading] = useState(
    Array(filteredGrounds.length).fill(false),
  );
  // console.log("userId card",userId)
  // console.log("filteredGrounds card",filteredGrounds)

  const navigation = useNavigation();

  const camelCaseLetter = string => {
    return string.replace(/\b\w/g, char => char.toUpperCase());
  };

  // const toggleLike = async(index, likedGroundId) => {
  //   let tempLoading = [...loading];
  //   tempLoading[index] = true;
  //   setLoading(tempLoading);

  //   let tempLiked = [...liked];
  //   tempLiked[index] = !tempLiked[index];
  //   setLiked(tempLiked);
  //   console.log("likedGroundId", likedGroundId, userId);
  //   if(userId == null || userId == undefined){
  //     navigation.navigate(USERLOGIN);
  //   }

  //   if (!likedGroundId?.favarote) {
  //   //  setLoading(true);
  //     const userDetails = await userData(userId);
  //     if (userId != null) {
  //       userDetails?.favarote
  //         ? userDetails?.favarote.push(likedGroundId?.ground_id)
  //         : (userDetails.favarote = [likedGroundId?.ground_id]);
  //       const updatedata = await UpdateUserData(userDetails, userId);
  //       if (updatedata?.status == "success") {
  //         //console.log("update successfully");
  //         ToastAndroid.showWithGravity(
  //           'Update successfully',
  //           ToastAndroid.SHORT,
  //           ToastAndroid.CENTER,
  //         );
  //       //  dashboard();
  //       onGroundsUpdated();
  //       } else {
  //         console.error("update data failed");
  //       }
  //     }
  //    // setLoading(false);
  //   } else {
  //     const removedata = await removefavGround(userId, likedGroundId?.ground_id);
  //     if (removedata?.status == "success") {
  //     //  dashboard();
  //     onGroundsUpdated();
  //     }
  //   }
  //   tempLoading[index] = false;
  //   setLoading(tempLoading);
  // };

  // const handleHeartPress = (event, index, likedGroundIdView) => {
  //   event.stopPropagation();
  //   if (typeof toggleLike === 'function') {
  //     toggleLike(index, likedGroundIdView);
  //   }
  // };

  // const selectGround = (groundId, index) =>{
  //   // console.log("index", index,groundId)
  //   // console.log("filteredGrounds Particular Data", filteredGrounds[index])
  //   // const selectedGround = filteredGrounds.find((ground_id, idx) => idx === index);
  //   // console.log("selectedGround",selectedGround)
  //   navigation.navigate(USERGROUNDDETAILS, { groundData: groundId, userId: userId });
  // }

  const handleAllGround = () => {
    navigation.navigate(USERALLGROUND, {userId: userId});
  };

  const handleCreateground = item => {
    //navigate("/courtadmin/myarena");
    console.log('hi', item);
    navigation.navigate(ADMINTOPTABNAVIGATION, {groundID: item});
    //navigation.navigate(ADMINTOPTABNAVIGATION);
  };

  // const handleBook = (groundId, index) => {
  //  // console.log("HandleBook Ids", groundId, index)
  //   // Navigate to BookingScreen with route parameters
  //   navigation.navigate(USERGROUNDBOOKING, { state: groundId, uid: index });
  // }

  // const renderItem = ({ item, index }) => (
  //   <View style={styles.card}>
  //     <View style={styles.ratingContainer}>
  //       <Icon name="star" size={20} color="gold" />
  //       <Text style={styles.ratingText}>{item.points}</Text>
  //     </View>
  //     <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/coverImage%2F6Ip56SzHQycRTqwN6nOl7iMZd193%2FCover_IMG_1715331013869?alt=media&token=7e776a85-15e8-433c-b50b-ccf3aeb7dc21'}} style={styles.image} />
  //     <Text style={styles.title}>{item.groundname}</Text>
  //     <Text style={styles.text}>{item.overview}</Text>
  //     <View style={styles.iconContainer}>
  //       <Image source={IMAGES.LocationIcon} style={{ width: 20, height: 20 }} />
  //       <Text style={styles.points}>{`${item.street_address}, ${item.city}`}</Text>
  //     </View>
  //     <TouchableOpacity style={styles.heartContainer} onPress={() => toggleLike(index)}>
  //       <Icon name={liked[index] ? 'heart' : 'heart-o'} size={24} color={liked[index] ? 'green' : 'gray'} />
  //     </TouchableOpacity>
  //   </View>
  // );
  const renderItem = ({item, index}) => (
    <TouchableOpacity>
      <View key={index} style={styles.card}>
        <Image
          source={{uri: item.coverImage[0]}}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#108257" />
            <Text style={styles.ratingText}>{item.overallRating}</Text>
          </View>
          {/* <View style={styles.heartContainer}>
          <TouchableOpacity onPress={(event) => handleHeartPress(event, index, item)}>
          {loading[index] ? (
                <ActivityIndicator size="small" color="gray" />
              ) : (
            <Icon name={(item.favarote === true) ? 'heart' : 'heart-o'} size={24} color={(item.favarote === true) ? 'green' : 'gray'} />
          )}
          </TouchableOpacity>
        </View> */}
        </View>
        <View style={{paddingHorizontal: 10, paddingVertical: 15}}>
          <Text style={styles.title}>{camelCaseLetter(item.groundname)}</Text>
          {/* <Text style={styles.text}>{item.overview}</Text> */}
          <View style={styles.iconContainer}>
            <IonIcons name="location-outline" size={20} color={'#757C8D'} />
            <Text style={styles.address}>
              {camelCaseLetter(`${item.street_address}, ${item.city}`)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handleCreateground(item.ground_id)}>
          <Text style={styles.bookButtonText}>View More</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Text style={styles.headerText}>Near By Court</Text>
        <TouchableOpacity style={styles.seeAllContainer} onPress={handleAllGround}>
          <Text style={styles.headerSeeAllText}>See All</Text>
          <Icon name="chevron-right" size={18} color="#4CA181" style={styles.rightArrowIcon} />
        </TouchableOpacity> */}
        </View>
        {filteredGrounds.length > 0 ? (
          <>
            {/* <Carousel
        data={filteredGrounds}
        renderItem={renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        loop={false}
        autoplay={true}
        autoplayDelay={1000}
        autoplayInterval={3000}
      /> */}
            <FlatList
              data={filteredGrounds}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        ) : (
          <Text style={styles.noDataText}>No Grounds In This City</Text>
        )}
      </View>
    </>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     height: 300,
//     padding: 16,
//     marginTop: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 2 },
//     position: 'relative', // Ensure absolute positioning works correctly
//   },
//   image: {
//     width: '100%',
//     height: 150,
//     borderRadius: 8,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   text: {
//     fontSize: 16,
//     marginVertical: 10,
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   points: {
//     fontSize: 16,
//     marginLeft: 5,
//   },
//   ratingContainer: {
//     position: 'absolute',
//     top: 16,
//     left: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 20,
//   },
//   ratingText: {
//     fontSize: 14,
//     marginLeft: 4,
//     fontWeight: 'bold',
//   },
//   heartContainer: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     borderRadius: 20,
//     padding: 8,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    //  paddingTop: 60,
    bottom: 0,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  headerSeeAllText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#4CA181',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightArrowIcon: {
    fontSize: 18,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    marginVertical: hS(10),
    width: Dimensions.get('window').width * 0.9, //Added
  },
  image: {
    width: '100%',
    height: 150,
    //borderRadius: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Outfit-Medium',
    color: '#372335',
  },
  text: {
    fontSize: 16,
    //  marginVertical: 10,
    color: '#757C8D', // Ensure text is visible over the overlay
    //   position: 'absolute',
    top: 15,
    // left: 16,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingTop: 30,
  },
  address: {
    fontSize: 15,
    marginLeft: 5,
    color: '#000000',
    fontFamily: 'Outfit-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 2,
    width: 60,
  },

  ratingText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
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
  },
  bookButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#4CA181',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    fontFamily: 'Outfit-Regular',
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CardSlider;
