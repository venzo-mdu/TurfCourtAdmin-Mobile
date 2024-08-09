import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import React, { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { getTimeFormatted } from '../../../../utils/getHours';
import { COLORS } from '../../../../assets/constants/global_colors';
import { getEventdetailsByType, changeEventStatus } from '../../../../firebase/firebaseFunction/eventDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const BookingScreen = ({ route }) => {
  const { groundID } = route?.params || {};

  const [tab, setTab] = useState('Bookings');
  const [statusopen, setstatusopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [uid, setUid] = useState('');
  const [selectedEventData, setSelectedEventData] = useState([]);
  const [data, setdata] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [nonfilter, setNonFilter] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [canBePaid, setCanBePaid] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [filterItems, setFilterItems] = useState([]);
  const [items, setItems] = useState([
    {label: 'Last Month', value: 'Last Month'},
    {label: 'This Month', value: 'This Month'},
    {label: 'Next Month', value: 'Next Month'},
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
    eventData();
  }, []);

  const eventData = async () => {
    if (uid == null) {
      navigate("/login");
    }
    let startDate = moment().startOf("month").format("YYYY-MM-DDTHH:mm");
    let endOfMonth = moment().endOf("month").format("YYYY-MM-DDTHH:mm");
    let statusValue = ["Accepted", "Awaiting", "Cancelled", "Canceled", "Completed", "On-going"];
    console.log(tab, 'tab-----');

    // if (tab === "Cancelled") {
    //   statusValue = ["Cancelled", "Canceled"];
    //   startDate = moment().startOf("month").format("YYYY-MM-DDTHH:mm");
    // } else if (tab === "Completed") {
    //   statusValue = [tab];
    //   startDate = moment().startOf("month").format("YYYY-MM-DDTHH:mm");
    //   endOfMonth = moment().format("YYYY-MM-DDTHH:mm");
    // } else 
    // if (tab == "Bookings") {
    //   startDate = moment().format("YYYY-MM-DDTHH:mm");
    //   endOfMonth = moment().endOf("month").format("YYYY-MM-DDTHH:mm");
    // }

    const otherFilters = [
      { key: "status", operator: "in", value: statusValue },
      { key: "start", operator: ">=", value: startDate },
      { key: "end", operator: "<=", value: endOfMonth },
    ];
    if (otherFilters && otherFilters.length > 0) {
      const response = await getEventdetailsByType(
        uid,
        "owner",
        { key: "start", dir: "asc" },
        null,
        otherFilters,
      );

      // console.log('response----------------------', response?.data);
      const events = response?.data;
      setdata(events);
      let bookingsData;
      // if (tab === 'Bookings') {
      //   bookingsData = events.filter(item => ((item.status === 'Accepted' || item.status === 'Awaiting')));
      //   const groupedData = Object.values(groupByBookId(bookingsData));
      //   setFilterData(groupedData);
      //   setLoading(true);
      // }
      // console.log('bookingsData',bookingsData);
      if (groundID) {
        const filteredEvents = events.filter(item => item.ground_id === groundID);
        setdata(filteredEvents);
        const groupedData = Object.values(groupByBookId(filteredEvents));
        setFilterData(groupedData);
        setLoading(true);
      }
      else {
        console.log('hi');

        let bookingsData = events.filter(item => {
          const eventStartDate = moment(item.start); 
          return (eventStartDate.isSameOrAfter(today) && 
                  (item.status === 'Accepted' || item.status === 'Awaiting'));
        });
        
        console.log('bookingsDataaaaa',bookingsData);

        const groupedData = Object.values(groupByBookId(bookingsData));
        setFilterData(groupedData);
        setLoading(true);
      }

    }
  };

  const handleActiveColorChange = () => {
    setIsSelected(!isSelected);
  };

  function checkSamePropertyValue(array) {
    return array.reduce((acc, obj) => acc && obj.status !== "Accepted", true);
  }

  const handleUpdateStatus = async (props) => {
    if (checkSamePropertyValue(selectedEventData)) {
      const mapcosnt = selectedEventData.map(
        async (selectedEventData) => {
          await updateBooking(selectedEventData, props);
        }
      );
      console.log('updateBooking',updateBooking);
      setstatusopen(false);
      // setCancelEventind([]);
      selectedEventData([]);
      // await eventData(groundIds);
    } else {
      setCanBePaid(true);
    }
  };

  const updateBooking = async (selectedEventDatum, props) => {
    await changeEventStatus(selectedEventDatum?.event_id, props);
  };

  const handleChange = value => {
    setTab(value);
    console.log('value', value);

    if (value == 'Bookings') {
      console.log('hi');
      const tableData = data.filter(item => {
        const eventStartDate = moment(item.start); 
        return (eventStartDate.isSameOrAfter(today) && 
                (item.status === 'Accepted' || item.status === 'Awaiting'));
      });
      const finalData = tableData;
      console.log('Bookings data length--------------', tableData.length);

      const groupedData = Object.values(groupByBookId(finalData));
      setFilterData(groupedData);
      //console.log('Bookings data length--------------', finalData.length);
    }
    else if (value == 'Completed') {
      const tableData = data?.filter(item => item.status === 'Completed');

      const finalData = tableData;
      console.log('Completed data length--------------', tableData.length);
      const groupedData = Object.values(groupByBookId(finalData));
      setFilterData(groupedData);
      //console.log('Completed data length--------------', finalData.length);
    }
    else if (value == 'On-Going') {
      const tableData = data?.filter(item => item.status === 'On-going');
      const finalData = tableData;
      // console.log('tableData', finalData);
      const groupedData = Object.values(groupByBookId(finalData));
      setFilterData(groupedData);
      //console.log('On-Going data length--------------', finalData.length);
    }
    else if (value == 'Cancelled') {
      const tableData = data?.filter(
        item => item.status === 'Cancelled' || item.status === 'Canceled',
      );
      const finalData = tableData;
      const groupedData = Object.values(groupByBookId(finalData));
      setFilterData(groupedData);
      // console.log('Cancelled data length--------------', finalData.length);
    }
  };

  const handlestatusEdit = data => {
    if (tab == 'Bookings') {
      console.log('Hi');
      console.log('edit', data);
      setSelectedEventData(data);
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

  const groupByBookId = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.BookId]) {
        acc[item.BookId] = [];
      }
      acc[item.BookId].push(item);

      return acc;
    }, {});
  };

  const renderItem = ({ item }) => {
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
    const { backgroundColor, color, icon } = getStatusColor(item[0].status);
    const { BookId, user_name, ground_name, court_name, amount } = item[0];
    const timings = item.map(i => formatDateTime(i));
    const groupedTimings = groupTimingsByDate(timings);
    const total = item.reduce((acc, curr) => acc + (parseInt(curr.amount) || 0), 0); // Calculate total amount

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
            {(item[0].status === 'Awaiting' || item[0].status === 'On-going') && (
              <Feather name={icon} size={15} color={color} />
            )}
            {(item[0].status === 'Cancelled' ||
              item[0].status === 'Completed' ||
              item[0].status === 'Accepted') && (
                <AntDesign name={icon} size={12} color={color} />
              )}
            <Text
              style={{
                color,
                fontFamily: 'Outfit-Regular',
                fontSize: 13,
              }}>
              {item[0].status}
            </Text>
          </View>
          {tab === 'Bookings' && (
            <TouchableOpacity onPress={() => handlestatusEdit(item)}>
              <Entypo name="dots-three-vertical" size={20} color="#A8A8A8" />
            </TouchableOpacity>
          )}
        </View>
        <Text
          style={{
            color: '#097E52',
            fontFamily: 'Outfit-Medium',
            fontSize: 16,
            paddingBottom: 10,
          }}>
          {user_name}
        </Text>
        <View style={styles.overallContainer}>
          <View style={styles.groundDetailContainer}>
            <Text
              style={{
                color: '#192335',
                fontFamily: 'Outfit-Medium',
                fontSize: 16,
              }}>
              {ground_name}
            </Text>
            <View style={styles.line}></View>
            <Text
              style={{
                color: '#097E52',
                fontFamily: 'Outfit-Medium',
                fontSize: 16,
              }}>
              {court_name}
            </Text>
          </View>
          <Text
            style={{
              color: '#212529',
              fontFamily: 'Outfit-Medium',
              fontSize: 16,
              paddingBottom: 25,
            }}>
            {'₹' + total}
          </Text>
        </View>
        {Object.keys(groupedTimings).map((date, index) => (
          <View key={index}>
            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: '#192335',
              }}>
              {date}
            </Text>
            {groupedTimings[date].map((time, idx) => (
              <Text
                key={idx}
                style={{
                  fontFamily: 'Outfit-Regular',
                  color: '#192335',
                }}>
                {time}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
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
                { fontFamily: 'Outfit-Regular', fontSize: 14 },
              ]}>
              {tabName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* <DropDownPicker
                    open={open}
                    value={value}
                    items={filterItems}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder={'This Month'}
                /> */}
      
      {!loading ? (
        <ActivityIndicator style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}size="large"/>
      ) : (
        filterData.length !== 0 ? (
          <FlatList
            data={filterData}
            renderItem={renderItem}
            keyExtractor={(item) => item[0]?.BookId.toString()}
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
        )
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
              Select slots to Approve or reject
            </Text>
          
              <View style={styles.itemContainer}>
                {selectedEventData?.map((item, index) => {
                  let gttime = getTimeFormatted(item?.start);
                  return (
                    <TouchableOpacity onPress={handleActiveColorChange}>
                    <View key={index} style={styles.statusContainer}>
                    <Text>{gttime.Time}</Text>
                    <Text>₹{item.amount}</Text>
                  </View>
                  </TouchableOpacity>
                  );
                })}
              </View>
            <View style={styles.footerButtons}>
              <TouchableOpacity
                onPress={() => {
                  handleUpdateStatus("Accepted")
                }}>
                <Text style={styles.paidButton}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleUpdateStatus("Cancelled")
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
    color: 'red',
    fontSize: 18,
    cursor: 'pointer',
    textAlign: 'right',
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
    gap:5,
  },
});


export default BookingScreen;
