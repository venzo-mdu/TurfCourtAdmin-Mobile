import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SearchBar} from 'react-native-elements';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import {StatusBarCommon} from '../../../components';
import {COLORS} from '../../../assets/constants/global_colors';
import {IMAGES} from '../../../assets/constants/global_images';
import {ADMINTOPTABNAVIGATION} from '../..';
import {
  getEventdetailsByArenas,
  getgroundDataForOwner,
} from '../../../firebase/firebaseFunction/groundDetails';
import GroundEventsSlider from '../Arena/groundEventSlider';
import moment from 'moment';
import {findElementsWithSameProp} from '../../../utils/helpers';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
import {HomePageEventSlider} from '../../../components/homePageEventSlider';
import SlotApprovalModal from '../../../components/molecules/slotApprovalModel';

const screenWidth = Dimensions.get('window').width;
const responsivePadding = screenWidth * 0.03;

const IndexHome = () => {
  const [userId, setUserId] = useState('');
  const [groundData, setGroundData] = useState([]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loader, setLoader] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [uniqueGameTypes, setUniqueGameTypes] = useState([]);
  const navigation = useNavigation();

  const route = useRoute();

  //New Changes from WEB
  const [newGroundData, setNewGroundData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [waitingBookings, setWaitingBookings] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeWaitIndex, setActiveWaitIndex] = useState(0);
  const [selectedEventData, setSelectedEventData] = useState();
  const [statusopen, setstatusopen] = useState(false);
  const [groundIds, setGroundIds] = useState();

  const getgroundDetails = async () => {
    try {
      if (!loading && _.isEmpty(groundData) && !noData && userId) {
        setLoading(true);

        let response = await getgroundDataForOwner(userId);
        console.log('Response: ', response);
        console.log('userId: ', userId);

        setNoData(response?.length === 0);
        setLoading(false);
        const groundIds = response?.map(r => r.ground_id);
        console.log('groundIds: ', groundIds);
        setGroundIds(groundIds);
        // usedispatch(groundIds)
        if (!_.isEmpty(groundIds)) {
          await eventData(groundIds);
        }
        setNewGroundData(response);
      }
    } catch (err) {
      console.log('Error: ', err);
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Unable to load data. Please contact TurfMama',
          ToastAndroid.SHORT,
        );
      } else {
        AlertIOS.alert('Unable to load data. Please contact TurfMama');
      }
    }
  };

  useEffect(() => {
    if (userId !== null) {
      getgroundDetails();
    }
  }, [userId]);

  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('uid');
      if (value) {
        setUserId(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error retrieving user data', error);
    }
  };

  const uniqueCitiesData = useCallback(() => {
    const lowerCaseCities = groundData.map(item => item.city.toLowerCase());
    //console.log("groundTypesView", groundTypesView.flat())
    const citiesSet = new Set(lowerCaseCities);
    const uniqueCitiesArray = Array.from(citiesSet);
    setUniqueCities(uniqueCitiesArray);

    /* Game Types List  */
    const groundTypesView = groundData.map(item => item.game_type);
    const gameTypeSet = new Set(groundTypesView.flat());
    const gameTypesArray = Array.from(gameTypeSet);
    // console.log("gameTypesArray", gameTypesArray)
    setUniqueGameTypes(gameTypesArray);
    // setFilteredCities(uniqueCitiesArray); // Set initial filtered cities
  }, [groundData]);

  useEffect(() => {
    getUserData();
    // getLocation();
    requestMessagingPermission();
  }, []);

  useEffect(() => {
    uniqueCitiesData();
  }, [groundData, uniqueCitiesData]);

  // useEffect(() => {
  //   if (currentLocation) {
  //     setSearch(currentLocation);
  //     setSelectedCity(currentLocation);
  //   }
  // }, [currentLocation]);

  const updateSearch = searchText => {
    setSearch(searchText);
    if (searchText) {
      const filtered = uniqueCities.filter(city =>
        city.includes(searchText.toLowerCase()),
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(uniqueCities);
    }
  };

  const selectCity = city => {
    setSelectedCity(city);
    setSearch(city);
    setFilteredCities([]);
  };

  const handleCreateground = () => {
    navigation.navigate(ADMINTOPTABNAVIGATION);
  };

  const requestMessagingPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const enabled = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'Need Permission to update your Bookings',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return enabled === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return true;
      }
    } catch (error) {
      console.log('Error requesting messaging permission:', error);
      return false;
    }
  };

  const eventData = async groundIds => {
    setLoading(true);

    let startDate = moment().format('YYYY-MM-DDTHH:mm');
    let endOfMonth = moment().endOf('month').format('YYYY-MM-DDTHH:mm');

    let statusValue = ['Accepted', 'Awaiting'];

    const otherFilters = [
      {key: 'status', operator: 'in', value: statusValue},
      {key: 'start', operator: '>=', value: startDate},
      {key: 'end', operator: '<=', value: endOfMonth},
    ];
    if (otherFilters && otherFilters.length > 0) {
      let data;
      if (groundIds.length > 15) {
        const response1 = await getEventdetailsByArenas({
          groundIds: groundIds?.slice(0, 15),
          otherFilters,
          order: {key: 'start', dir: 'asc'},
        });

        const response2 = await getEventdetailsByArenas({
          groundIds: groundIds?.slice(15, groundIds?.length),
          otherFilters,
          order: {key: 'start', dir: 'asc'},
        });
        console.log('from here', response2);
        data = _.uniqBy([...response1?.data, ...response2?.data], 'event_id');
      } else {
        const response1 = await getEventdetailsByArenas({
          groundIds: groundIds?.slice(0, 15),
          otherFilters,
          order: {key: 'start', dir: 'asc'},
        });
        data = response1.data;
      }

      if (data) {
        setApprovedBookings(
          findElementsWithSameProp(
            data.filter(item => item.status === 'Accepted'),
          ),
        );
        setWaitingBookings(
          findElementsWithSameProp(
            data.filter(item => item.status === 'Awaiting'),
          ),
        );
      }
    }

    setLoading(false);
  };

  const handleBookingClick = (index, item, status) => {
    if (status === 'Accepted') {
      setSelectedEventData(approvedBookings[index]);
    } else if (status === 'Awaiting') {
      setSelectedEventData(waitingBookings[index]);
    }
    setstatusopen(true);
  };

  const renderItem = ({item, index}) => (
    <View style={{backgroundColor: '#', borderRadius: 8}}>
      <HomePageEventSlider
        key={index}
        bookingItem={item}
        type={'Accepted'}
        showShort={true}
      />
    </View>
  );

  const renderItem1 = ({item, index}) => (
    <View style={{backgroundColor: '#', borderRadius: 8}}>
      <HomePageEventSlider
        key={index}
        bookingItem={item}
        type={'Awaiting'}
        showShort={true}
        // eventData={() => eventData(groundIds)}
        groundIds={groundIds}
        eventData={eventData}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBarCommon color={COLORS.PRIMARY} />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size={50}
              color={COLORS.PRIMARY}
              animating={loading}
            />
            <Text>Loading...</Text>
          </View>
        ) : (
          <>
            {approvedBookings.length !== 0 ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 10,
                    paddingTop: 20,
                  }}>
                  <Text style={styles.title}>Upcoming Booking</Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  }}>
                  <Carousel
                    loop={true}
                    data={approvedBookings}
                    renderItem={renderItem}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth * 0.9}
                    onSnapToItem={index => setActiveIndex(index)}
                  />
                </View>
                <View style={styles.pagination}>
                  <Text style={styles.paginationText}>
                    {activeIndex + 1} / {approvedBookings.length}
                  </Text>
                </View>
              </View>
            ) : null}

            {waitingBookings.length !== 0 ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 10,
                    paddingTop: 20,
                  }}>
                  <Text style={styles.title}>Awaiting Booking</Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                  }}>
                  <Carousel
                    loop={true}
                    data={waitingBookings}
                    renderItem={renderItem1}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth * 0.9}
                    onSnapToItem={index => setActiveWaitIndex(index)}
                    onPress={(index, item) =>
                      handleBookingClick(index, item, 'Awaiting')
                    }
                  />
                </View>
                <View style={styles.pagination}>
                  <Text style={styles.paginationText}>
                    {activeWaitIndex + 1} / {waitingBookings.length}
                  </Text>
                </View>
                {selectedEventData && (
                  <SlotApprovalModal
                    statusopen={statusopen}
                    selectedEventData={selectedEventData}
                    setSelectedEventData={setSelectedEventData}
                    groundIds={newGroundData.map(g => g.ground_id)}
                    eventData={eventData}
                    setstatusopen={setstatusopen}
                  />
                )}
              </View>
            ) : null}

            {/* My Arena */}
            {newGroundData.length > 0 ? (
              <>
                <GroundEventsSlider
                  filteredGrounds={newGroundData}
                  userId={userId}
                />
              </>
            ) : (
              <Text
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}>
                No Ground Data
              </Text>
            )}
            <TouchableOpacity
              onPress={handleCreateground}
              style={styles.addArenaButton}>
              <Image source={IMAGES.AddArenaButton} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    marginTop: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    flex: 1,
  },
  searchInputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    // flexDirection: 'row',
    // justifyContent: 'center',
  },
  searchInput: {
    fontFamily: 'Outfit-Light',
    color: '#000000',
    flex: 1,
    fontSize: 16,
  },
  leftIconContainerStyle: {
    paddingLeft: 0,
  },
  rightIconContainerStyle: {
    paddingRight: 10,
  },
  leftIconStyle: {
    marginRight: 10,
  },
  rightIconStyle: {
    marginLeft: 10,
  },
  rightIconStyleHide: {
    display: 'none',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    paddingLeft: responsivePadding,
  },
  item: {
    padding: responsivePadding,
    fontSize: 18,
    fontWeight: '700px',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  // selected: {
  //   padding: 10,
  //   fontSize: 18,
  //   color: 'green',
  // },
  dropDownHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // paddingLeft: responsivePadding,
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: COLORS.PrimaryColor,
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  buttonText: {
    fontFamily: 'Outfit-Light',
    fontSize: 16,
    color: '#fff',
  },
  dropdown: {
    backgroundColor: 'black',
    borderColor: 'black',
    height: 50,
    width: 150,
    borderRadius: 38,
  },
  dropdownContainer: {
    backgroundColor: 'black',
    borderColor: 'black',
    width: 150,
    borderRadius: 38,
  },
  text: {
    fontFamily: 'Outfit-Light',
    fontSize: 16,
    color: '#ffffff',
  },
  placeholder: {
    fontFamily: 'Outfit-Light',
    fontSize: 16,
    color: '#ffffff',
  },
  label: {
    fontFamily: 'Outfit-Light',
    fontSize: 16,
    color: '#ffffff',
  },
  listItem: {
    backgroundColor: '#000',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 5,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  statusText: {
    color: '#fff',
  },
  dateTimeText: {
    color: '#fff',
  },
  locationText: {
    color: '#fff',
  },
  courtView: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  courtText: {
    color: '#fff',
  },
  viewText: {
    color: '#fff',
    marginLeft: 10,
  },
  addArenaButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 20,
    right: 0,
    width: 80,
    height: 80,
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
  title: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#000',
  },
});

export default IndexHome;
