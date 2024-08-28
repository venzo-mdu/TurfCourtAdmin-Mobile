import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  FlatList,
  ToastAndroid,
  Linking
} from 'react-native';
import _ from 'lodash';
import { statusMap } from '../utils/statusMap';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../assets/constants/global_colors';
import { changeEventStatus } from '../firebase/firebaseFunction/eventDetails';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from './molecules/customButtom';
import { userData } from '../firebase/firebaseFunction/userDetails';


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

function checkSamePropertyValue(array) {
  return array.reduce((acc, obj) => acc && obj.status !== 'Accepted', true);
}

export const HomePageEventSlider = ({
  bookingItem,
  index,
  groundIds,
  eventData,
  type,
  isAdmin = true,
  width,
  showShort = false,
}) => {
  const [selectedEventData, setSelectedEventData] = useState();
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedCancelEventData, setSelectedCancelEventData] = useState([]);
  const [cancelEventInd, setCancelEventInd] = useState([]);
  const [canBePaid, setCanBePaid] = useState(false);
  const [phonenumber, setPhonenumber] = useState([]);

  useEffect(() => {
    getUserPhone(bookingItem[0].user_id);
  });
  const handleUpdateStatus = async props => {

    var sat;
    if (props === 'Accepted') {
      sat = 'Approved';
    } else {
      sat = 'Rejected';
    }
    if (checkSamePropertyValue(selectedCancelEventData)) {
      await Promise.all(
        selectedCancelEventData.map(async selectedCancelEventDatum => {
          await updateBooking(selectedCancelEventDatum, props);
        }),
      );
      setStatusOpen(false);
      setCancelEventInd([]);
      setSelectedCancelEventData([]);
      await eventData(groundIds);
      ToastAndroid.showWithGravity(
        'You have ' + sat + ' the Slots.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      setCanBePaid(true);
    }
  };

  const updateBooking = async (selectedEventDatum, props) => {
    await changeEventStatus(selectedEventDatum?.event_id, props);
  };

  const handleCancelBooking = item => {
    setSelectedCancelEventData(prev => [...prev, item]);
    if (item.status === 'Accepted') {
      setCanBePaid(true);
    }
  };

  const flattenedArray = bookingItem.flat();
  const sumOfProp2 = flattenedArray.reduce(
    (sum, obj) => sum + parseInt(obj.amount),
    0,
  );

  const handleStatusEdit = data => {
    setSelectedEventData(data);
    setStatusOpen(true);
  };

  async function getUserPhone(user_id) {

    userData(user_id).then(user => {
      if (user && user.phonenumber) {
        //  let phonenumber = user.phonenumber.replace(/^\+91/, '');
        setPhonenumber(user.phonenumber);
      } else {
        console.log('Phone number not found for this user.');
        return null;
      }
    })
      .catch(error => {
        console.error('Error fetching user data:', error);
        return null;
      });
  }


  const firstSlot = new Date(bookingItem[0].start);
  const lastSlot = new Date(_.last(bookingItem).end);
  const day = daysOfWeek[firstSlot.getDay()];
  const month = months[firstSlot.getMonth()];
  const date = firstSlot.getDate();

  const renderSlots = () => {
    if (showShort) {
      const status = bookingItem[0]?.status;
      const startdateTime = new Date(firstSlot);
      const enddateTime = new Date(lastSlot);
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
      const statusObj = statusMap[status];
      const { icon, bgColor, color } = statusObj || {};
      return (
        <View style={styles.flexRow}>
          <Text style={styles.timeText}>
            {`${hours}:${minutes
              .toString()
              .padStart(2, '0')} ${ampm} - ${hours2}:${minutes2
                .toString()
                .padStart(2, '0')} ${ampm2}`}
          </Text>
          {statusObj && (
            <View style={[styles.statusContainer, { backgroundColor: bgColor }]}>
              <Text style={[styles.statusText, { color }]}>
                {icon} {status}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return bookingItem.map(({ start, end, status }, index) => {
      const startdateTime = new Date(start);
      const enddateTime = new Date(end);
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
      const statusObj = statusMap[status];
      const { icon, bgColor, color } = statusObj || {};
      return (
        <View key={index} style={styles.flexRow}>
          <Text style={styles.timeText}>
            {`${hours}:${minutes
              .toString()
              .padStart(2, '0')} ${ampm} - ${hours2}:${minutes2
                .toString()
                .padStart(2, '0')} ${ampm2}`}
          </Text>
          {statusObj && (
            <View style={[styles.statusContainer, { backgroundColor: bgColor }]}>
              <Text style={[styles.statusText, { color }]}>
                {icon} {status}
              </Text>
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <View
      style={[
        styles.card,
        type === 'Accepted'
          ? { backgroundColor: COLORS.BLACK }
          : { backgroundColor: COLORS.PrimaryColor },
      ]}>
      <View style={styles.header}>
        <View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          ><Text style={styles.heading}>
              {_.startCase(bookingItem[0].ground_name)}
            </Text>
            <Text style={styles.text}>
              {`${bookingItem[0].user_name.length > 10
                  ? bookingItem[0].user_name.includes(' ')
                    ? _.startCase(bookingItem[0].user_name.split(' ')[0]) + '...'
                    : _.startCase(bookingItem[0].user_name.substring(0, 10)) + '...'
                  : _.startCase(bookingItem[0].user_name)
                }`}
            </Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.text}>
              {_.startCase(bookingItem[0].court_name)}
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${phonenumber}`)}>
            <Text style={styles.text}>
              {phonenumber}
            </Text>
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.text}>Amount : {sumOfProp2}</Text> */}
        </View>
      </View>
      {/* {isAdmin && ( */}
      <View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {`${day}, ${month} ${date.toString().padStart(2, '0')}`}
          </Text>
          {renderSlots()}
        </View>
        {/* <View style={styles.userContainer}>
       <Text style={styles.text}>
        {bookingItem[0].user_name}
          </Text>
        <Text style={styles.text}>
        {phonenumber}
          </Text>
       </View> */}
        {type === 'Awaiting' ? (
          <View>
            <View
              style={{
                backgroundColor: '#fff',
                height: 0.5,
              }}
            />

            <TouchableOpacity onPress={() => handleStatusEdit(bookingItem)}>
              {/* <Image source={EditIcon} style={styles.editIcon} /> */}
              <View style={styles.footer}>
                <Text style={styles.text}>View</Text>
                <Icon name="eye" size={20} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* )} */}
      {statusOpen && (
        <Modal
          visible={statusOpen}
          transparent={true}
          onRequestClose={() => {
            setCancelEventInd([]);
            setSelectedCancelEventData([]);
            setStatusOpen(false);
            setCanBePaid(false);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setCancelEventInd([]);
                    setSelectedCancelEventData([]);
                    setStatusOpen(false);
                    setCanBePaid(false);
                  }}>
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color={COLORS.PrimaryColor}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Select slots to approve or reject
                </Text>
              </View>
              <FlatList
                data={selectedEventData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  const gttime = getTimeFormatted(item?.start);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.button,
                        cancelEventInd.includes(index) && styles.buttonSelected,
                      ]}
                      onPress={() => {
                        setCancelEventInd(prev =>
                          prev.includes(index)
                            ? prev.filter(i => i !== index)
                            : [...prev, index],
                        );
                        handleCancelBooking(item);
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={[
                            {
                              fontFamily: 'Outfit-Regular',
                              fontSize: 15,
                              color: COLORS.PrimaryColor,
                            },
                            cancelEventInd.includes(index) &&
                            styles.textSelected,
                          ]}>
                          {gttime.Time}
                        </Text>
                        {item?.amount && (
                          <Text
                            style={[
                              styles.amount,
                              cancelEventInd.includes(index) &&
                              styles.textSelected,
                            ]}>
                            ₹ {item.amount}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
                numColumns={3}
              />
              {canBePaid && (
                <Text style={styles.warningText}>
                  An selected slot has already been accepted
                </Text>
              )}
              <View style={styles.buttonContainer}>
                <CustomButton
                  text={'Approve'}
                  disabled={cancelEventInd.length === 0}
                  onPress={() => handleUpdateStatus('Accepted')}
                  style={styles.approveButton}
                />
                <CustomButton
                  text={'Reject'}
                  onPress={() => handleUpdateStatus('Cancelled')}
                  disabled={cancelEventInd.length === 0}
                  style={styles.rejectButton}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: COLORS.PrimaryColor,
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 8,
    padding: 10,
    height: 175,
    justifyContent: 'space-between',
    // backgroundColor: COLORS.PrimaryColor,
  },
  header: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // marginBottom: 8,
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
  editIcon: {
    width: 20,
    height: 20,
  },
  dateContainer: {
    // paddingTop: 10,
    paddingBottom: 10,
  },
  dateText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Outfit-Light',
    marginBottom: 4,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Outfit-Light',
    paddingRight: 8,
  },
  statusContainer: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    // fontSize: 14,
    fontFamily: 'Outfit-Light',
    fontSize: 12,
  },
  footer: {
    paddingTop: '3%',
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Outfit-Light',
    paddingRight: 8,
  },
  gameIcon: {
    width: 20,
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#192335',
  },
  closeText: {
    fontSize: 16,
    color: '#f00',
  },
  slotContainer: {
    paddingVertical: 8,
  },
  slotButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 4,
    flexDirection: 'row',
    gap: 20,
    // justifyContent: 'space-between',
  },
  slotSelected: {
    borderColor: 'blue',
  },
  slotUnselected: {
    borderColor: 'gray',
  },
  warningText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  approveButton: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 4,
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
  },
  buttonSelected: {
    backgroundColor: COLORS.PrimaryColor,
  },
  textSelected: {
    fontFamily: 'Outfit-Regular',
    fontSize: 15,
    color: COLORS.WHITE,
  },
});

function getTimeFormatted(date) {
  const time = new Date(date);
  let hours = time.getHours();
  const minutes = time.getMinutes();
  let ampm = 'AM';
  if (hours >= 12) {
    ampm = 'PM';
    hours %= 12;
  }
  if (hours === 0) {
    hours = 12;
  }
  return {
    Time: `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`,
  };
}
