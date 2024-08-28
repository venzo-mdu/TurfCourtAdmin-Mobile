import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ToastAndroid,
  SafeAreaView,
  Linking
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { getTimeFormatted } from '../../../../utils/getHours';
import { COLORS } from '../../../../assets/constants/global_colors';
import {
  getEventdetailsByType,
  changeEventStatus,
} from '../../../../firebase/firebaseFunction/eventDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import { useRoute } from '@react-navigation/native';
import { getEventdetailsByArenas, getgroundDataForOwner } from '../../../../firebase/firebaseFunction/groundDetails';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { userData } from '../../../../firebase/firebaseFunction/userDetails';



const BookingScreen = () => {
  const route = useRoute();
  const { groundID } = route?.params || {};
  const containerStyle = groundID ? styles.insideGroundContainer : styles.tabContainer;
  const [tab, setTab] = useState('Bookings');
  const [statusopen, setstatusopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [uid, setUid] = useState('');
  const [selectedEventData, setSelectedEventData] = useState([]);
  const [data, setdata] = useState([]);
  const [canBePaid, setCanBePaid] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('This Month');
  const [cancelEventind, setCancelEventind] = useState([]);
  const [phonenumber, setPhonenumber] = useState([]);


  const [selectedCancelEventData, setselectedCancelEventData] = useState([]);
  const [trigger, setTrigger] = useState([false]);
  const [userPhoneMap, setUserPhoneMap] = useState({});



  const [dropdownItems, setDropdownItems] = useState([
    { label: 'Last Month', value: 'Last Month' },
    { label: 'This Month', value: 'This Month' },
    { label: 'Next Month', value: 'Next Month' },
  ]);
  const today = moment().startOf('day');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const value = await AsyncStorage.getItem('uid');
        if (value) {
          setUid(JSON.parse(value));
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    eventData();
  }, [tab, value]);

  useEffect(() => {
    eventData();
  }, [trigger]);

  useEffect(() => {
    eventData();
  }, [uid]);

  const eventData = async () => {
    setLoading(false);
    if (uid) {
      let response1 = await getgroundDataForOwner(uid);
      let groundIds = response1?.map(r => r.ground_id);
      if (uid == null) {
        navigate("/login");
      }
      let startDate = moment().format("YYYY-MM-DDTHH:mm");
      let endOfMonth = moment().endOf("month").format("YYYY-MM-DDTHH:mm");
      let statusValue = ["Accepted", "Awaiting"];

      if (tab === "Cancelled") {
        statusValue = ["Cancelled", "Canceled"];
        startDate = moment().startOf("month").format("YYYY-MM-DDTHH:mm");
      } else if (tab === "Completed") {
        statusValue = [tab];
        startDate = moment().startOf("month").format("YYYY-MM-DDTHH:mm");
        endOfMonth = moment().format("YYYY-MM-DDTHH:mm");
      } else if (tab !== "Bookings" && tab !== "Cancelled") {
        statusValue = [tab];
      }
      if (value === "Last Month") {
        startDate = moment()
          .subtract(1, "months")
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm");
        endOfMonth = moment()
          .subtract(1, "months")
          .endOf("month")
          .format("YYYY-MM-DDTHH:mm");
      } else if (value === "Next Month") {
        startDate = moment()
          .add(1, "months")
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm");
        endOfMonth = moment()
          .add(1, "months")
          .endOf("month")
          .format("YYYY-MM-DDTHH:mm");
      }

      const otherFilters = [
        { key: "status", operator: "in", value: statusValue },
        { key: "start", operator: ">=", value: startDate },
        { key: "end", operator: "<=", value: endOfMonth },
      ];
      // console.log('otherFilters',otherFilters)
      if (
        otherFilters &&
        otherFilters.length > 0
      ) {
        let events;
        if (groundID) {
          groundIds = [groundID];
        }

        if (groundIds.length != 0) {
          if (groundIds.length > 15) {
            const response1 = await getEventdetailsByArenas({
              groundIds: groundIds.slice(0, 15),
              otherFilters,
              order: { key: 'start', dir: 'asc' },
            });

            const response2 = await getEventdetailsByArenas({
              groundIds: groundIds.slice(15),
              otherFilters,
              order: { key: 'start', dir: 'asc' },
            });
            const data = _.uniqBy([...response1.data, ...response2.data], 'event_id');
            events = data;
            const userIds = events.map(event => event.user_id).filter(id => id);

            const userDataList = await Promise.all(userIds.map(async (user_id) => {
              try {
                const user = await userData(user_id);
                return { user_id, user };
              } catch (error) {
                console.error(`Error fetching user data for user_id: ${user_id}`, error);
                return null;
              }
            }));
            const userPhoneMap = userDataList.reduce((acc, userObj) => {
              if (userObj && userObj.user) {
                acc[userObj.user_id] = userObj.user.phonenumber;
              }
              return acc;
            }, {});

            setUserPhoneMap(userPhoneMap);
          } else {
            const response = await getEventdetailsByArenas({
              groundIds: groundIds,
              otherFilters,
              order: { key: 'start', dir: 'asc' },
            });
            events = response.data;
            const userIds = events.map(event => event.user_id).filter(id => id);

            const userDataList = await Promise.all(userIds.map(async (user_id) => {
              try {
                const user = await userData(user_id);
                return { user_id, user };
              } catch (error) {
                console.error(`Error fetching user data for user_id: ${user_id}`, error);
                return null;
              }
            }));
            const userPhoneMap = userDataList.reduce((acc, userObj) => {
              if (userObj && userObj.user) {
                acc[userObj.user_id] = userObj.user.phonenumber;
              }
              return acc;
            }, {});

            setUserPhoneMap(userPhoneMap);
          }
        }
        else {
          ToastAndroid.showWithGravity(
            'No Ground Data',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
        setdata(events);
        const groupedData = Object.values(groupByBookId(events));
        setFilterData(groupedData);
        setLoading(true);
      }
    }
  };

  function checkSamePropertyValue(array) {
    return array.reduce((acc, obj) => acc && obj.status !== 'Accepted', true);
  }

  const handleUpdateStatus = async props => {
    if (checkSamePropertyValue(selectedCancelEventData)) {
      await Promise.all(
        selectedCancelEventData.map(async selectedCancelEventDatum => {
          await updateBooking(selectedCancelEventDatum, props);
        }),
      );
      setstatusopen(false);
      setCancelEventind([]);
      setselectedCancelEventData([]);
      setTrigger(!trigger);
    } else {
      setCanBePaid(true);
    }
  };

  const updateBooking = async (selectedEventDatum, props) => {
    await changeEventStatus(selectedEventDatum?.event_id, props);
    // let response = await changeEventStatus(selectedEventDatum?.event_id, props);
    // console.log('response-----',response,selectedEventDatum?.ground_name);
    // if(response.status == 'success'){
    //   ToastAndroid.show(`${selectedEventDatum?.ground_name} Booking Accepted`, ToastAndroid.SHORT);
    // }
  };

  const handleCancelbooking = value => {
    setselectedCancelEventData(prev => [...prev, value]);
  };

  const handleChange = value => {
    setTab(value);
  };

  const handlestatusEdit = data => {
    if (tab == 'Bookings') {
      const awaitedSlots = data?.filter(item => item.status === 'Awaiting');
      setSelectedEventData(awaitedSlots);
      setstatusopen(true);
    }
  };

  const formatDateTime = date => {
    const startdateTime = new Date(date.start);
    const enddateTime = new Date(date.end);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dayOfWeek = daysOfWeek[startdateTime.getDay()];
    const month = months[startdateTime.getMonth()];
    const day = startdateTime.getDate();

    let hours = startdateTime.getHours();
    const minutes = startdateTime.getMinutes();
    let ampm = 'AM';
    if (hours >= 12) {
      ampm = 'PM';
      hours %= 12;
    }
    if (hours === 0) {
      hours = 12;
    }

    let hours2 = enddateTime.getHours();
    const minutes2 = enddateTime.getMinutes();
    let ampm2 = 'AM';
    if (hours2 >= 12) {
      ampm2 = 'PM';
      hours2 %= 12;
    }
    if (hours2 === 0) {
      hours2 = 12;
    }

    return `${dayOfWeek}, ${month} ${day
      .toString()
      .padStart(2, '0')} | ${hours}:${minutes
        .toString()
        .padStart(2, '0')} ${ampm} - ${hours2}:${minutes2
          .toString()
          .padStart(2, '0')} ${ampm2}`;
  };

  const groupTimingsByDate = timings => {
    const grouped = timings.reduce((acc, timing) => {
      const dateKey = timing.split(' | ')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(timing.split(' | ')[1]);
      return acc;
    }, {});
    return grouped;
  };

  const groupByBookId = data => {
    return data.reduce((acc, item) => {
      if (!acc[item.BookId]) {
        acc[item.BookId] = [];
      }
      acc[item.BookId].push(item);

      return acc;
    }, {});
  };

  const renderItem = ({ item, index }) => {
    const getStatusColor = status => {
      switch (status) {
        case 'Awaiting':
          return { backgroundColor: '#E4DDF4', color: '#7756C9', icon: 'clock' };
        case 'Cancelled':
          return {
            backgroundColor: '#F2DEDE',
            color: '#F50303',
            icon: 'closecircleo',
          };
        case 'On-going':
          return { backgroundColor: '#D9EDF7', color: '#45AEF4', icon: 'clock' };
        case 'Completed':
          return {
            backgroundColor: '#D1F0D6',
            color: '#097E52',
            icon: 'checkcircleo',
          };
        case 'Accepted':
          return {
            backgroundColor: '#D1F0D6',
            color: '#097E52',
            icon: 'checkcircleo',
          };
        default:
          return { backgroundColor: '#FFFFFF', color: '#000000', icon: '' };
      }
    };

    const { BookId, user_name, ground_name, court_name, amount, user_id } = item[0];
    const timings = item.map(i => formatDateTime(i));
    const groupedTimings = groupTimingsByDate(timings);
    const total = item.reduce(
      (acc, curr) => acc + (parseInt(curr.amount) || 0),
      0,
    );
    const hasAwaitingStatus = item.some(i => i.status === 'Awaiting');
    const userPhoneNumber = userPhoneMap[user_id] || '';

    return (
      <View style={styles.slide} key={index}>
        <View style={styles.header}>
          <View style={styles.userDetailContainer}>
            <Text
              style={{
                color: '#097E52',
                fontFamily: 'Outfit-Medium',
                fontSize: 16,
              }}>
              {`${user_name.length > 10
                ? user_name.includes(' ')
                  ? _.startCase(user_name.split(' ')[0]) + '...'
                  : _.startCase(user_name.substring(0, 10)) + '...'
                : _.startCase(user_name)
                }`}
            </Text>
            <View style={styles.line}></View>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${userPhoneNumber}`)}>
              <Text
                style={{
                  color: '#097E52',
                  fontFamily: 'Outfit-Medium',
                  fontSize: 16,
                }}>
                {userPhoneNumber}
              </Text>
            </TouchableOpacity>
          </View>
          {tab === 'Bookings' && hasAwaitingStatus && (
            <TouchableOpacity onPress={() => handlestatusEdit(item)}>
              <Entypo name="dots-three-vertical" size={20} color="#A8A8A8" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.overallContainer}>
          <View style={styles.groundDetailContainer}>
            <Text
              style={{
                color: '#192335',
                fontFamily: 'Outfit-Medium',
                fontSize: 16,
              }}>
              {`${_.startCase(ground_name)}`}
            </Text>

          </View>
          <Text
            style={{
              color: '#212529',
              fontFamily: 'Outfit-Medium',
              fontSize: 16,
              paddingBottom: 10,
            }}>
            {'₹' + total}
          </Text>
        </View>
        <Text
          style={{
            color: '#097E52',
            fontFamily: 'Outfit-Medium',
            fontSize: 16,
            paddingBottom: 10,
          }}>
          {`${_.startCase(court_name)}`}
        </Text>

        {Object.keys(groupedTimings).map((date, index) => (
          <View key={index}>
            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: '#192335',
              }}>
              {date}
            </Text>
            <View>
              {groupedTimings[date].map((time, idx) => {
                const statusItem = item[idx];
                const { backgroundColor, color, icon } = getStatusColor(
                  statusItem.status,
                );

                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 5,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Outfit-Regular',
                        color: '#192335',
                      }}>
                      {time}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        color,
                        backgroundColor,
                        borderRadius: 5,
                        paddingHorizontal: 7,
                        paddingVertical: 5,
                      }}>
                      {(statusItem.status === 'Awaiting' ||
                        statusItem.status === 'On-going') && (
                          <Feather name={icon} size={15} color={color} />
                        )}
                      {(statusItem.status === 'Cancelled' ||
                        statusItem.status === 'Completed' ||
                        statusItem.status === 'Accepted') && (
                          <AntDesign name={icon} size={12} color={color} />
                        )}
                      <Text
                        style={{
                          color,
                          fontFamily: 'Outfit-Regular',
                          fontSize: 13,
                          marginLeft: 3,
                        }}>
                        {statusItem.status}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}>
      <View style={containerStyle}>
        {['Bookings', 'Completed', 'On-Going', 'Cancelled'].map(tabName => (
          <TouchableOpacity
            key={tabName}
            style={[
              styles.tabButton,
              tab === tabName && styles.activeTabButton,
            ]}
            onPress={() => handleChange(tabName)}>
            <Text
              style={[
                styles.tabText,
                tab === tabName && styles.activeTabText,
              ]}>
              {tabName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginTop: 8 }}>
        <DropDownPicker
          open={open}
          value={value}
          items={dropdownItems}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setDropdownItems}
          placeholder={'This Month'}
          style={{
            backgroundColor: '#FAFAFA', marginHorizontal: 10, width: '95%',
            borderColor: COLORS.fieldBorderColor, height: 60
          }}
          dropDownContainerStyle={{ borderColor: COLORS.fieldBorderColor, backgroundColor: '#FAFAFA', marginHorizontal: 10, width: '95%', }}
          textStyle={{ fontFamily: 'Outfit-Regular', fontSize: 16 }}
        />
      </View>
      {!loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size={50}
            color={COLORS.PrimaryColor}
            animating={!loading}
          />
          <Text>Loading...</Text>
        </View>
      ) : filterData.length !== 0 ? (
        <FlatList
          data={filterData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          <Text style={{ fontFamily: 'Outfit-Medium', color: COLORS.PRIMARY }}>
            No {tab} bookings found.
          </Text>
        </View>
      )}
      <Modal visible={statusopen} transparent={true}>
        <View style={styles.modalContainerCancelView}>
          <View style={styles.modalContentCancelView}>
            <TouchableOpacity
              onPress={() => {
                setCancelEventind([]);
                setselectedCancelEventData([]);
                setstatusopen(false);
                setCanBePaid(false);
              }}>
              <Ionicons
                name="close-circle-outline"
                size={24}
                color={COLORS.PrimaryColor}
                style={styles.closeButtonCancelView}
              />
              {/* <Text style={styles.closeButtonCancelView}>x</Text> */}
            </TouchableOpacity>
            <Text style={styles.titleCancelView}>
              Select slots to Approve or reject
            </Text>

            <View style={styles.itemContainer}>
              {selectedEventData?.map((item, index) => {
                let gttime = getTimeFormatted(item?.start);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setCancelEventind(prev => [...prev, index]);
                      handleCancelbooking(item);
                    }}>
                    <View
                      key={index}
                      style={[
                        styles.statusContainer,
                        {
                          backgroundColor: cancelEventind?.includes(index)
                            ? 'green'
                            : 'white',
                        },
                      ]}>
                      <Text
                        style={{
                          color: cancelEventind?.includes(index)
                            ? 'white'
                            : 'green',
                        }}>
                        {gttime.Time}
                      </Text>
                      <Text
                        style={{
                          color: cancelEventind?.includes(index)
                            ? 'white'
                            : 'green',
                        }}>
                        &#8377; {item.amount}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.footerButtons}>
              <TouchableOpacity
                onPress={() => {
                  handleUpdateStatus('Accepted');
                }}>
                <Text style={styles.paidButton}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleUpdateStatus('Cancelled');
                }}>
                <Text style={styles.cancelButton}>Cancelled</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  insideGroundContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    alignItems: 'center',
    // height: Dimensions.get('window').height * 0.05,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    // height: Dimensions.get('window').height * 0.055,
    marginTop: 30,
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: COLORS.fieldBorderColor,
    borderWidth: 1,
  },
  activeTabButton: {
    backgroundColor: COLORS.BLACK,
  },
  tabText: {
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: 'Outfit-Regular'
  },
  activeTabText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontFamily: 'Outfit-Regular'
  },

  slide: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
    padding: 15,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  userDetailContainer: {
    flexDirection: 'row',
  },

  groundDetailContainer: {
    flexDirection: 'row',
  },
  overallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    width: 1,
    height: '90%',
    backgroundColor: COLORS.verticalBar,
    marginHorizontal: 10,
  },
  loaderContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000000',
    padding: 5,
  },

  /* Modal Content For Cancel View */

  statusContainer: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.25,
    padding: 12,
  },
  modalContainerCancelView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentCancelView: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    paddingTop: 5,
  },
  titleCancelView: {
    fontSize: 18,
    fontWeight: '500',
    color: '#192335',
    paddingBottom: 10,
  },
  closeButtonCancelView: {
    textAlign: 'right',
    left: 8,
  },

  footerButtons: {
    width: Dimensions.get('window').width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 80,
  },
  paidButton: {
    backgroundColor: 'green',
    color: '#FFFFFF',
    borderRadius: 8,
    fontSize: 14,
    padding: 10,
    paddingHorizontal: 15,
  },
  cancelButton: {
    backgroundColor: '#E50000',
    color: '#FFFFFF',
    borderRadius: 8,
    fontSize: 14,
    padding: 10,
  },
  selectedContainer: {
    backgroundColor: 'green',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
});

export default BookingScreen;

