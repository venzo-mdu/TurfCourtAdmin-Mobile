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
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SearchBar} from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {WD, mS, hS} = require('../../../utils/metrics');
import DropDownPicker from 'react-native-dropdown-picker';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import CardSlider from '../Arena/CardSlider';
import ApprovalWaitingEventsSlider from '../Arena/approvalWaitingEventsSlider';
import {StatusBarCommon} from '../../../components';
import {COLORS} from '../../../assets/constants/global_colors';
import UpcomingEventsSlider from '../Arena/UpcomingEventsSlider';
import {IMAGES} from '../../../assets/constants/global_images';
import {ADMINTOPTABNAVIGATION} from '../..';
import {
  getEventdetailsByArenas,
  getgroundData,
  getgroundDataForOwner,
} from '../../../firebase/firebaseFunction/groundDetails';
import GroundEventsSlider from '../Arena/groundEventSlider';
import moment from 'moment';
import {findElementsWithSameProp} from '../../../utils/helpers';
import _ from 'lodash';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import SlotModal from '../Arena/slotModal';
import {HomePageEventSlider} from '../../../components/homePageEventSlider';
import Feather from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get('window').width;
const responsivePadding = screenWidth * 0.03;

const IndexHome = () => {
  const [userId, setUserId] = useState('');
  const [groundData, setGroundData] = useState([]);
  const [groundData1, setGrounddata1] = useState([]);
  const [groundRefresh, groundRefreshViews] = useState([]);
  const [uniqueCities, setUniqueCities] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loader, setLoader] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openDropList, setOpenDropList] = useState(false);
  const [value, setValue] = useState(null);
  const [uniqueGameTypes, setUniqueGameTypes] = useState([]);
  const [items, setItems] = useState([]);
  const navigation = useNavigation();

  const route = useRoute();
  const {refresh} = route.params || {};
  const {refreshUpcoming} = route.params || {};

  //New Changes from WEB
  const [newGroundData, setNewGroundData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [waitingBookings, setWaitingBookings] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeWaitIndex, setActiveWaitIndex] = useState(0);

  const groundDetailsView = groundData.filter(
    ground =>
      ground.city.slice(1).toLowerCase() ===
      selectedCity.slice(1).toLowerCase(),
  );
  //console.log("salemGrounds", groundDetailsView);

  const filteredGrounds = groundDetailsView.filter(ground =>
    ground.game_type.map(game => game.toLowerCase()).includes(value),
  );
  // console.log("filteredGrounds", filteredGrounds);

  // const getgroundDetails = async () => {
  //   let response = await getgroundData(userId);
  //   setGrounddata1(response);
  // };

  const getgroundDetails = async () => {
    try {
      if (!loading && _.isEmpty(groundData) && !noData && userId != null) {
        setLoading(true);

        let response = await getgroundDataForOwner(userId);
        setNoData(response?.length === 0);
        setLoading(false);
        const groundIds = response?.map(r => r.ground_id);
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

  useEffect(() => {
    if (groundRefresh || groundRefreshViews) {
      getgroundDetails();
    }
  }, [groundRefresh, groundRefreshViews]);

  useFocusEffect(
    useCallback(() => {
      if (groundRefresh) {
        getgroundDetails();
      }
    }, [groundRefresh]),
  );

  useFocusEffect(
    useCallback(() => {
      if (groundRefreshViews) {
        getgroundDetails();
      }
    }, [groundRefreshViews]),
  );

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

  const refreshGrounds = () => {
    groundViewDatas();
  };

  useFocusEffect(
    useCallback(() => {
      if (refresh) {
        groundViewDatas();
      }
    }, [refresh]),
  );

  const groundViewDatas = useCallback(async () => {
    if (userId) {
      const groundDatas = await getallgroundData(userId);
      setGroundData(groundDatas);
    }
  }, [userId]);

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
    getLocation();
  }, []);

  useEffect(() => {
    groundViewDatas();
  }, [userId, groundViewDatas]);

  useEffect(() => {
    uniqueCitiesData();
  }, [groundData, uniqueCitiesData]);

  useEffect(() => {
    if (currentLocation) {
      setSearch(currentLocation);
      setSelectedCity(currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    // Map uniqueGameTypes to the format required by DropDownPicker
    const mappedItems = uniqueGameTypes.map(game => ({
      label: game,
      value: game.toLowerCase(),
    }));
    setItems(mappedItems);
  }, [uniqueGameTypes]);

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

  const getLocation = async () => {
    const result = await requestLocationPermission();
    if (result) {
      setLoader(true);
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          //fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`)
          fetch(
            `https://geocode.maps.co/reverse?lat=${9.9287126}&lon=${78.1609953}`,
          )
            .then(response => response.json())
            .then(data => {
              const city = data.address.city;
              setCurrentLocation(city);
              setLoader(false);
            })
            .catch(error => {
              console.error('Error fetching reverse geolocation:', error);
              setLoader(false);
            });
        },
        error => {
          console.log('Geolocation error:', error.code, error.message);
          setLoader(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return true; // Assume iOS permission is handled separately
      }
    } catch (err) {
      console.warn('Permission error:', err);
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

      const data = _.uniqBy(
        [...response1?.data, ...response2?.data],
        'event_id',
      );

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

  const handleOpenModal = item => {
    setSelectedSlot(item);
    setModalVisible(true);
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
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBarCommon color={COLORS.PRIMARY} />
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <View style={styles.searchWrapper}>
            <FontAwesome6
              name="location-dot"
              size={30}
              color="#108257"
              // style={styles.locationIcon}
            />
            <SearchBar
              placeholder="Search Cities..."
              onChangeText={updateSearch}
              value={search}
              lightTheme
              round
              autoCorrect={false}
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.searchInputContainer}
              inputStyle={styles.searchInput}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              rightIconContainerStyle={styles.rightIconContainerStyle}
              clearIcon={
                search
                  ? {
                      name: 'close',
                      type: 'font-awesome',
                      color: 'red',
                      onPress: () => setSearch(''),
                      style: styles.rightIconStyle,
                    }
                  : null
              }
              searchIcon={
                !search
                  ? {
                      name: 'search',
                      type: 'font-awesome',
                      color: 'black',
                      style: styles.rightIconStyle,
                    }
                  : null
              }
            />
          </View>
          {filteredCities.length > 0 && search && (
            <FlatList
              data={filteredCities}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => selectCity(item)}>
                  <View style={styles.searchItem}>
                    <FontAwesome6
                      name="location-dot"
                      size={30}
                      color="#108257"
                      // style={styles.locationIcon}
                    />
                    <Text style={styles.item}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
          {/* {selectedCity ? <Text style={styles.selected}>Selected City: {selectedCity}</Text> : null} */}
        </View>

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
              />
            </View>
            <View style={styles.pagination}>
              <Text style={styles.paginationText}>
                {activeWaitIndex + 1} / {waitingBookings.length}
              </Text>
            </View>
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
        ) : null}
        <TouchableOpacity
          onPress={handleCreateground}
          style={styles.addArenaButton}>
          <Image source={IMAGES.AddArenaButton} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
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