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
import Feather from 'react-native-vector-icons/Feather';

const {width: viewportWidth} = Dimensions.get('window');

const SLIDER_WIDTH = viewportWidth;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);

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

const GroungEventSlider = ({filteredGrounds, userId, onGroundsUpdated}) => {
  const [liked, setLiked] = useState(Array(filteredGrounds.length).fill(false));
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(
    Array(filteredGrounds.length).fill(false),
  );
  // console.log("userId card",userId)
  // console.log("filteredGrounds card",filteredGrounds)

  const navigation = useNavigation();

  const camelCaseLetter = string => {
    return string.replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleAllGround = () => {
    navigation.navigate(USERALLGROUND, {userId: userId});
  };

  const handleCreateground = item => {
    console.log('hi', item);
    navigation.navigate(ADMINTOPTABNAVIGATION, {groundID: item});
  };

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
    <View style={styles.container}>
      {filteredGrounds.length > 0 ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 5,
            }}>
            <Text style={styles.HeadingTitle}>My Arena</Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Carousel
              data={filteredGrounds}
              renderItem={renderItem}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              loop={true}
              onSnapToItem={index => setActiveIndex(index)}
            />
          </View>

          <View style={styles.pagination}>
            <Text style={styles.paginationText}>
              {activeIndex + 1} / {filteredGrounds.length}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>No Grounds In This City</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
    color: '#372335',
  },
  HeadingTitle: {
    fontSize: 16,
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
  pagination: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#000',
    borderRadius: 14,
    marginTop: 10,
  },
  paginationText: {
    color: '#ffffff',
    fontSize: 12,
  },
});

export default GroungEventSlider;
