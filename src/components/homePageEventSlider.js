import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import _ from 'lodash';
import {statusMap} from '../utils/statusMap';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../assets/constants/global_colors';

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

  const handleUpdateStatus = async props => {
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
    } else {
      setCanBePaid(true);
    }
  };

  const updateBooking = async (selectedEventDatum, props) => {
    await changeEventStatus(selectedEventDatum?.event_id, props);
  };

  const handleCancelBooking = value => {
    setSelectedCancelEventData(prev => [...prev, value]);
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
      const {icon, bgColor, color} = statusObj || {};
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
            <View style={[styles.statusContainer, {backgroundColor: bgColor}]}>
              <Text style={[styles.statusText, {color}]}>
                {icon} {status}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return bookingItem.map(({start, end, status}, index) => {
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
      const {icon, bgColor, color} = statusObj || {};
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
            <View style={[styles.statusContainer, {backgroundColor: bgColor}]}>
              <Text style={[styles.statusText, {color}]}>
                {icon} {status}
              </Text>
            </View>
          )}
        </View>
      );
    });
  };

  return (
    <View style={[styles.card]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            {_.startCase(bookingItem[0].ground_name)}
          </Text>
          <Text style={styles.text}>
            {_.startCase(bookingItem[0].court_name)}
          </Text>
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
        <View
          style={{
            backgroundColor: '#fff',
            height: 0.5,
          }}></View>
        <TouchableOpacity onPress={() => handleStatusEdit(bookingItem)}>
          {/* <Image source={EditIcon} style={styles.editIcon} /> */}
          <View style={styles.footer}>
            <Text style={styles.text}>View</Text>
            <Icon name="eye" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>
      </View>
      {/* )} */}
      {statusOpen && (
        <Modal
          visible={statusOpen}
          transparent
          onRequestClose={() => {
            setCancelEventInd([]);
            setSelectedCancelEventData([]);
            setStatusOpen(false);
            setCanBePaid(false);
          }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Select slots to approve or reject
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setCancelEventInd([]);
                    setSelectedCancelEventData([]);
                    setStatusOpen(false);
                    setCanBePaid(false);
                  }}>
                  <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.slotContainer}>
                {selectedEventData?.map((item, index) => {
                  let gttime = getTimeFormatted(item?.start);
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.slotButton,
                        cancelEventInd.includes(index)
                          ? styles.slotSelected
                          : styles.slotUnselected,
                      ]}
                      onPress={() => {
                        setCancelEventInd(prev => [...prev, index]);
                        handleCancelBooking(item);
                      }}>
                      <Text>{gttime.Time}</Text>
                      {item?.amount && <Text>&#8377; {item.amount}</Text>}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {canBePaid && (
                <Text style={styles.warningText}>
                  An selected slot has already been accepted
                </Text>
              )}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {backgroundColor: COLORS.PrimaryColor},
                  ]}
                  onPress={() => handleUpdateStatus('Accepted')}>
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: 'red'}]}
                  onPress={() => handleUpdateStatus('Rejected')}>
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
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
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
  card: {
    borderRadius: 8,
    padding: 10,
    height: 175,
    justifyContent: 'space-between',
    backgroundColor: COLORS.PrimaryColor,
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
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
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
    justifyContent: 'space-between',
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
