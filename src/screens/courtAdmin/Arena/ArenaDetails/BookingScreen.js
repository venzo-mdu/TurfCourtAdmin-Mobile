import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import moment from 'moment';
import { getEventdetailsByType } from '../../../../firebase/firebaseFunction/eventDetails';
import React, {useEffect, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {getTimeFormatted} from '../../../../utils/getHours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../../../assets/constants/global_colors';
import { data } from '../../../../testData/data';

const BookingScreen = (uidp) => {
  const sampleData = [
    {
      event_id: '8WLs8znlIUc3ffZqhg9D',
      user_name: 'Jadeja',
      court_id: '49fcUezuCwv9egxpScZ5',
      end: '2024-07-29T20:00',
      court_name: 'Tester court1',
      status: 'Awaiting',
      BookId: '1e31ab64-564f-4564-84e6-0ee6723f2e89-0',
      createdAt: {seconds: 1722236051, nanoseconds: 24000000},
      amount: '683',
      reason: '',
      ground_id: 'ZkBMZmjdlvff84hU7srJ',
      start: '2024-07-29T19:00',
      mapIndexx: 632129078,
      gametype: 'Cricket',
      ground_name: 'abc sport',
      user_id: 'B6UoArQdHlVhihPYHFbgq4BFvNA2',
      owner_id: '6Ip56SzHQycRTqwN6nOl7iMZd193',
    },
    {
      event_id: '8WLs8znlIUc3ffZqhg9u',
      user_name: 'Jadeja',
      court_id: '49fcUezuCwv9egxpScZ5',
      end: '2024-07-29T23:00',
      court_name: 'Tester court2',
      status: 'Completed',
      BookId: '1e31ab64-564f-4564-84e6-0ee6723f2e89-0',
      createdAt: {seconds: 1722236051, nanoseconds: 24000000},
      amount: '633',
      reason: '',
      ground_id: 'ZkBMZmjdlvff84hU7srJ',
      start: '2024-07-29T22:00',
      mapIndexx: 632129078,
      gametype: 'Cricket',
      ground_name: 'abc sports',
      user_id: 'B6UoArQdHlVhihPYHFbgq4BFvNA2',
      owner_id: '6Ip56SzHQycRTqwN6nOl7iMZd193',
    },
    {
      event_id: '8WLs8znlIUc3ffZqhg9u',
      user_name: 'Jadeja',
      court_id: '49fcUezuCwv9egxpScZ5',
      end: '2024-07-29T23:00',
      court_name: 'Tester court2',
      status: 'Cancelled',
      BookId: '1e31ab64-564f-4564-84e6-0ee6723f2e89-0',
      createdAt: {seconds: 1722236051, nanoseconds: 24000000},
      amount: '633',
      reason: '',
      ground_id: 'ZkBMZmjdlvff84hU7srJ',
      start: '2024-07-29T22:00',
      mapIndexx: 632129078,
      gametype: 'Cricket',
      ground_name: 'abc sports',
      user_id: 'B6UoArQdHlVhihPYHFbgq4BFvNA2',
      owner_id: '6Ip56SzHQycRTqwN6nOl7iMZd193',
    },
    {
      event_id: '8WLs8znlIUc3ffZqhg9u',
      user_name: 'Jadeja',
      court_id: '49fcUezuCwv9egxpScZ5',
      end: '2024-07-29T23:00',
      court_name: 'Tester court2',
      status: 'On-going',
      BookId: '1e31ab64-564f-4564-84e6-0ee6723f2e89-0',
      createdAt: {seconds: 1722236051, nanoseconds: 24000000},
      amount: '633',
      reason: '',
      ground_id: 'ZkBMZmjdlvff84hU7srJ',
      start: '2024-07-29T22:00',
      mapIndexx: 632129078,
      gametype: 'Cricket',
      ground_name: 'abcd sports',
      user_id: 'B6UoArQdHlVhihPYHFbgq4BFvNA2',
      owner_id: '6Ip56SzHQycRTqwN6nOl7iMZd193', //Accepted
    },
    {
      event_id: '8WLs8znlIUc3ffZqhg9u',
      user_name: 'Jadeja',
      court_id: '49fcUezuCwv9egxpScZ5',
      end: '2024-07-29T23:00',
      court_name: 'Tester court2',
      status: 'Accepted',
      BookId: '1e31ab64-564f-4564-84e6-0ee6723f2e89-0',
      createdAt: {seconds: 1722236051, nanoseconds: 24000000},
      amount: '633',
      reason: '',
      ground_id: 'ZkBMZmjdlvff84hU7srJ',
      start: '2024-07-29T22:00',
      mapIndexx: 632129078,
      gametype: 'Cricket',
      ground_name: 'abcd sports',
      user_id: 'B6UoArQdHlVhihPYHFbgq4BFvNA2',
      owner_id: '6Ip56SzHQycRTqwN6nOl7iMZd193', //Accepted

    },
  ];

  const [tab, setTab] = useState('Bookings');
  const [statusopen, setstatusopen] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState([]);
  const [noData, setNoData] = useState([]);
  const [finalData, setfinalData] = useState([]);
  const [selectedEventData, setSelectedEventData] = useState();

  useEffect(() => {
    const getUserData = async () => {
      try {
        // console.log('get user data');
        const value = await AsyncStorage.getItem('uid');
        // console.log('get user data',value);
        if (value) {
          setUid(JSON.parse(value));
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      }
    };

    getUserData();
  }, []);

 
  const eventData = async () => {
    // console.log('ttttt',uid);
    setLoading(true);
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

   
    const otherFilters = [
      { key: "status", operator: "in", value: statusValue },
      { key: "start", operator: ">=", value: startDate },
      { key: "end", operator: "<=", value: endOfMonth },
    ];
    if (
      otherFilters &&
      otherFilters.length > 0
    ) {
      // console.log('inside if',uid);
      const response = await getEventdetailsByType(
        uid,
        "owner",
        { key: "start", dir: "asc" },
        null,
        otherFilters,
      );
      Promise.resolve();

      // console.log('response----------------------',response);
      const events = response?.data;

      setdata(events);
      setNoData(events.length === 0);

      setfinalData(findElementsWithSameProp(response?.data));
    }

    setLoading(false);
  };

  useEffect(() => {
    setdata([]);
    eventData();
  }, [uid]);

  const findElementsWithSameProp = arr => {
    const prop1Map = new Map();

    arr.forEach(element => {
      const prop1Value = element.BookId;
      if (prop1Map.has(prop1Value)) {
        prop1Map.get(prop1Value).push(element);
      } else {
        prop1Map.set(prop1Value, [element]);
      }
    });
    // console.log("prop1Map", prop1Map)

    return Array.from(prop1Map.values());
  };

  useEffect(() => {
    if (tab === 'Bookings') {
      const tableData = sampleData?.filter(
        item => item.status === 'Accepted' || item.status === 'Awaiting',
      );
      const finalData = tableData;
      //console.log('tableData', finalData);
      setFilterData(finalData);
    }
  }, []);

  const handleChange = value => {
    
    setTab(value);
    if (value == 'Bookings') {
      const tableData = sampleData?.filter(
        item => item.status === 'Accepted' || item.status === 'Awaiting',
      );
      const finalData = tableData;
      setFilterData(finalData);
      // console.log('Bookings data length--------------', finalData.length);
    } else if (value == 'Completed') {
      const tableData = sampleData?.filter(item => item.status === 'Completed');
      const finalData = tableData;
      setFilterData(finalData);
      // console.log('Completed data length--------------', finalData.length);
    } else if (value == 'On-Going') {
      const tableData = sampleData?.filter(item => item.status === 'On-going');
      const finalData = tableData;
      setFilterData(finalData);
      // console.log('On-Going data length--------------', finalData.length);
    } else if (value == 'Cancelled') {
      const tableData = sampleData?.filter(
        item => item.status === 'Cancelled' || item.status === 'Canceled',
      );
      const finalData = tableData;
      setFilterData(finalData);
      // console.log('Cancelled data length--------------', finalData.length);
    }

  };

  const handlestatusEdit = data => {
    if (tab == 'Bookings') {
      // console.log('edit', data);
      setSelectedEventData((prevSelectedEventData = []) => {
        const isArray = Array.isArray(prevSelectedEventData);
        const safePrevSelectedEventData = isArray ? prevSelectedEventData : [];
        const isAlreadyPresent = safePrevSelectedEventData.some(
          event => event.BookId === data.BookId,
        );

        if (!isAlreadyPresent) {
          return [data];
        }

        return safePrevSelectedEventData;
      });
      setstatusopen(true);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Awaiting':
        return {backgroundColor: '#E4DDF4', color: '#7756C9', icon: 'clock'};
      case 'Cancelled':
        return {
          backgroundColor: '#F2DEDE',
          color: '#F50303',
          icon: 'closecircleo',
        };
      case 'On-going':
        return {backgroundColor: '#D9EDF7', color: '#45AEF4', icon: 'clock'};
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
        return {backgroundColor: '#FFFFFF', color: '#000000', icon: ''};
    }
  };

  const groupDataByGroundName = data => {
    return data.reduce((acc, item) => {
      const groundName = item.ground_name;
      if (!acc[groundName]) {
        acc[groundName] = [];
      }
      acc[groundName].push(item);
      return acc;
    }, {});
  };
  
  const renderItem = ({item}) => {
    
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
    
    // const sumOfPrice = item.reduce((sum, obj) => sum + parseInt(obj.amount), 0);
    // console.log('sumOfProp2-------',sumOfPrice);
    // const groupedData = groupDataByGroundName(item);
    // console.log('groupedData-------',groupedData);
    const {backgroundColor, color, icon} = getStatusColor(item.status);
    return (
      <View style={styles.slide}>

        <View style={styles.header}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              color,
              backgroundColor,
              borderRadius: 5,
              paddingHorizontal: 7,
              paddingVertical: 5,
              gap: 5,
            }}>
            {(item.status === 'Awaiting' || item.status === 'On-going') && (
              <Feather name={icon} size={15} color={color} />
            )}
            {(item.status === 'Cancelled' ||
              item.status === 'Completed' ||
              item.status === 'Accepted') && (
              <AntDesign name={icon} size={12} color={color} />

            )}
            <Text
              style={[
                {
                  color,
                  fontFamily: 'Outfit-Regular',
                  fontSize: 13,
                },
              ]}>
              {item.status}
            </Text>
          </View>
          {tab === 'Bookings' && (
            <TouchableOpacity onPress={() => handlestatusEdit(item)}>
              <Entypo name="dots-three-vertical" size={20} color= {COLORS.verticalDot} />
            </TouchableOpacity>
          )}
        </View>

        <Text
          style={[
            {
              color: '#097E52', //#097E52
              fontFamily: 'Outfit-Medium',
              fontSize: 16,
              paddingBottom: 10,
            },
          ]}>
          {item.user_name}
        </Text>
        <View style={styles.overallContainer}>
          <View style={styles.groundDetailContainer}>
            <Text
              style={[
                {
                  color: COLORS.buttonColor,
                  fontFamily: 'Outfit-Medium',
                  fontSize: 16,
                },
              ]}>
              {item.ground_name}
            </Text>

            <View style={styles.line}></View>
            <Text
              style={[
                {
                  color: '#097E52',
                  fontFamily: 'Outfit-Medium',
                  fontSize: 16,
                },
              ]}>
              {item.court_name}
            </Text>

          </View>

          <Text
            style={[
              {
                color: '#212529',
                fontFamily: 'Outfit-Medium',
                fontSize: 16,
                paddingBottom: 25,
              },
            ]}>
            ${item.amount}
          </Text>

        </View>
        <Text
          style={[
            styles.text,
            {fontFamily: 'Outfit-Regular', color:COLORS.buttonColor},

          ]}>
          {formatDateTime(item)}
        </Text>
      </View>
    );
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
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
                {fontFamily: 'Outfit-Regular', fontSize: 14},
              ]}>
              {tabName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    
      {filterData.length !== 0 ? (
        <>
          <FlatList
            data={filterData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          <Text style={{fontFamily: 'Outfit-Medium', color: COLORS.PRIMARY}}>
            No {tab} bookings found.
          </Text>
        </View>
      )}
      <Modal visible={statusopen} transparent={true}>

        <View style={styles.modalContainerCancelView}>
          <View style={styles.modalContentCancelView}>
            <TouchableOpacity
              onPress={() => {
                setstatusopen(false);
              }}>
              <Text style={styles.closeButtonCancelView}>x</Text>
            </TouchableOpacity>
            <Text style={styles.titleCancelView}>
              Select the event to change the status
            </Text>
            <View style={styles.statusContainer}>
              {selectedEventData?.map((item, index) => {
                let gttime = getTimeFormatted(item?.start);
                return (
                  <View key={index}>
                    <Text>{gttime.Time}</Text>
                    <Text>₹{item.amount}</Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.footerButtons}>
              <TouchableOpacity
                onPress={() => {
                  // action for Paid Button
                }}>
                <Text style={styles.paidButton}>Paid</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // action for cancel Button
                }}>
                <Text style={styles.cancelButton}>Canceled</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    height: Dimensions.get('window').height * 0.055,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: COLORS.BLACK,
  },
  tabText: {
    color: COLORS.BLACK,
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.WHITE,
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
  groundDetailContainer: {
    flexDirection: 'row',
  },
  overallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.verticalBar,
    marginHorizontal: 8,
  },

  text: {
    fontSize: 16,
    color: COLORS.BLACK,
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
  },
  titleCancelView: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.buttonColor,
    paddingBottom: 10,
  },
  closeButtonCancelView: {
    color: 'red',
    fontSize: 18,
    cursor: 'pointer',
    textAlign: 'right',
  },

  footerButtons: {
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
});

export default BookingScreen;
