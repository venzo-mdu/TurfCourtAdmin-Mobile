// App.js
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getEventdetailsByType} from '../../../firebase/firebaseFunction/eventDetails';
import {USERBOOKINGVIEW} from '../..';
import {TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS} from '../../../assets/constants/global_colors';
import SlotModal from './slotModal';

const {width: screenWidth} = Dimensions.get('window');

const datas = [
  {title: 'VS Sports Academy', date: 'June 2024'},
  {title: 'Abc Sports', date: 'July 2024'},
  // Add more items as needed
];

export default function ApprovalWaitingEventsSlider({uid, refreshUpcoming}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [statusopen, setstatusopen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState();
  const [cancelEventind, setCancelEventind] = useState([]);
  const [selectedCancelEventData, setselectedCancelEventData] = useState([]);
  const [tab, setTab] = useState('Upcoming');
  const [filterData, setfilterData] = useState([]);
  const prop1Map = new Map();
  const navigation = useNavigation();

  const [filter, setFilter] = useState({
    id: 'This Month',
    value: 'This Month',
    label: 'This Month',
  });
  const [data, setdata] = useState([]);
  const [detaildata, setdetaildata] = useState([]);

  const [loading, setLoading] = useState(false);
  const [cardloading, setCardLoading] = useState(false);
  const [nonfilter, setNonFilter] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  /* Event Data Method */
  const eventData = async () => {
    setLoading(true);
    if (uid == null) {
      navigate('/login');
    }
    const response = await getEventdetailsByType(uid, 'owners');

    setdata(response?.data);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const thismonthdata = response?.data?.filter(item => {
      const dateObj = new Date(item?.starttime);
      const dateonbj = dateObj.getMonth() + 1;
      return dateonbj == currentMonth;
    });

    setNonFilter(thismonthdata);
    const tableData2 = thismonthdata?.filter(
      item => item.status === 'Awaiting',
    );

    const currentTimeData = tableData2.filter(
      item => new Date(item.starttime) >= currentDate,
    );
    const finalData = findElementsWithSameProp(currentTimeData);
    setfilterData(finalData);
    setLoading(false);
  };

  useEffect(() => {
    // eventData();
  }, []);

  useEffect(() => {
    // eventData();
  }, [refreshUpcoming]);

  function findElementsWithSameProp(arr) {
    // Create a map to store the occurrences of each prop1 value
    const prop1Map = new Map();

    // Iterate through the array to populate the map
    arr.forEach(element => {
      const prop1Value = element.BookId;
      if (prop1Map.has(prop1Value)) {
        prop1Map.get(prop1Value).push(element);
      } else {
        prop1Map.set(prop1Value, [element]);
      }
    });

    // Get the values of the map
    const result = Array.from(prop1Map.values());

    return result;
  }

  // const handleViewBooking = () => {
  //   navigation.navigate(USERBOOKINGVIEW);
  // };

  const handleOpenModal = item => {
    console.log('working');
    setSelectedSlot(item);
    setModalVisible(true);
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>{item[0].ground_name}</Text>
            <Text style={styles.text}>{item[0].court_name}</Text>
            {/* <Text style={styles.text}>Amount : {sumOfProp2}</Text> */}
          </View>
        </View>
        <View>
          {item.map(item2 => {
            const startdateTime = new Date(item2.starttime);
            const enddateTime = new Date(item2.endtime);

            const daysOfWeek = [
              'Sun',
              'Mon',
              'Tue',
              'Wed',
              'Thu',
              'Fri',
              'Sat',
            ];
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
            const year = startdateTime.getFullYear();

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
            return (
              <View style={{paddingBottom: 10}}>
                <Text style={styles.text}>{`${dayOfWeek}, ${month} ${day
                  .toString()
                  .padStart(2, '0')} | ${hours}:${minutes
                  .toString()
                  .padStart(2, '0')} ${ampm} - ${hours2}:${minutes2
                  .toString()
                  .padStart(2, '0')} ${ampm2}`}</Text>
              </View>
            );
          })}
          <View
            style={{
              backgroundColor: '#fff',
              height: 0.5,
            }}></View>
          <View>
            <TouchableOpacity
              onPress={
                () => handleOpenModal(item[index])
                // console.log('ItemData: ', item[index])
              }>
              <View style={styles.footer}>
                <Text style={styles.text}>View</Text>
                <Icon name="eye" size={20} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <SlotModal
              visible={modalVisible}
              slot={selectedSlot}
              onClose={() => setModalVisible(false)}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {filterData.length !== 0 ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 10,
            }}>
            <Text style={styles.title}>Waiting for Approval</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  lineHeight: 20.16,
                  color: COLORS.PrimaryColor,
                }}>
                See All
              </Text>
              <Feather
                name="chevron-right"
                size={24}
                color={COLORS.PrimaryColor}
              />
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Carousel
              loop={true}
              data={filterData}
              renderItem={renderItem}
              sliderWidth={screenWidth}
              itemWidth={screenWidth * 0.9}
              onSnapToItem={index => setActiveIndex(index)}
            />
          </View>

          <View style={styles.pagination}>
            <Text style={styles.paginationText}>
              {activeIndex + 1} / {filterData.length}
            </Text>
          </View>
        </>
      ) : (
        <View style={{paddingBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 10,
            }}>
            <Text style={styles.title}>Waiting for Approval</Text>
          </View>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyContainerText}>
              There is no pending approval
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#000',
  },
  slide: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 175,
    padding: 10,
    justifyContent: 'space-between',
  },
  header: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // height: '50%',
  },
  heading: {
    fontFamily: 'Outfit-Medium',
    color: 'white',
    fontSize: 18,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Outfit-Light',
    paddingRight: 8,
  },
  footer: {
    paddingTop: '3%',
    flexDirection: 'row',
    alignSelf: 'flex-end',
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
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  icon: {
    width: 20,
    height: 20,
  },
  greenText: {
    color: '#097E52',
  },
  dateText: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: '400',
  },
  emptyContainer: {
    height: 140,
    backgroundColor: COLORS.BLACK,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainerText: {
    color: '#fff',
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
  },
});
