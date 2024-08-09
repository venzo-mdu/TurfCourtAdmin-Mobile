import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {changeEventStatus} from '../../firebase/firebaseFunction/eventDetails';
import {getTimeFormatted} from '../../utils/getHours';
import CustomButton from './customButtom';
import {COLORS} from '../../assets/constants/global_colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

function checkSamePropertyValue(array) {
  return array.reduce((acc, obj) => acc && obj.status !== 'Accepted', true);
}

const SlotApprovalModal = ({
  statusopen,
  setstatusopen,
  selectedEventData,
  setSelectedEventData,
  eventData,
  groundIds,
}) => {
  const [cancelEventind, setCancelEventind] = useState([]);
  const [canBePaid, setCanBePaid] = useState(false);
  const [selectedCancelEventData, setselectedCancelEventData] = useState([]);

  const handleCancelbooking = item => {
    setselectedCancelEventData(prev => [...prev, item]);
    if (item.status === 'Accepted') {
      setCanBePaid(true);
    }
  };

  const handleUpdateStatus = async props => {
    console.log('Approve/Reject working');
    if (checkSamePropertyValue(selectedCancelEventData)) {
      await Promise.all(
        selectedCancelEventData.map(async selectedCancelEventDatum => {
          await updateBooking(selectedCancelEventDatum, props);
        }),
      );
      setstatusopen(false);
      setSelectedEventData(null);
      setCancelEventind([]);
      setselectedCancelEventData([]);
      await eventData(groundIds);
    } else {
      setCanBePaid(true);
    }
  };

  const updateBooking = async (selectedEventDatum, props) => {
    await changeEventStatus(selectedEventDatum?.event_id, props);
  };

  return (
    <Modal
      visible={statusopen}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setCancelEventind([]);
        setselectedCancelEventData([]);
        setstatusopen(false);
        setCanBePaid(false);
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}>
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
              />
            </TouchableOpacity>
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>Select slots to approve or reject</Text>
          </View>
          <FlatList
            data={selectedEventData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              const gttime = getTimeFormatted(item?.start);
              return (
                <TouchableOpacity
                  style={[
                    styles.button,
                    cancelEventind.includes(index) && styles.buttonSelected,
                  ]}
                  onPress={() => {
                    setCancelEventind(prev =>
                      prev.includes(index)
                        ? prev.filter(i => i !== index)
                        : [...prev, index],
                    );
                    handleCancelbooking(item);
                  }}>
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                      style={[
                        {
                          fontFamily: 'Outfit-Regular',
                          fontSize: 15,
                          color: COLORS.PrimaryColor,
                        },
                        cancelEventind.includes(index) && styles.textSelected,
                      ]}>
                      {gttime.Time}
                    </Text>
                    {item?.amount && (
                      <Text
                        style={[
                          styles.amount,
                          cancelEventind.includes(index) && styles.textSelected,
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
              A selected slot has already been accepted
            </Text>
          )}
          <View style={styles.buttonContainer}>
            <CustomButton
              text={'Approve'}
              disabled={cancelEventind.length === 0}
              onPress={() => handleUpdateStatus('Accepted')}
              style={styles.approveButton}
            />
            <CustomButton
              text={'Reject'}
              onPress={() => handleUpdateStatus('Cancelled')}
              disabled={cancelEventind.length === 0}
              style={styles.rejectButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#192335',
  },
  closeButton: {
    fontSize: 18,
    color: 'red',
  },
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
  buttonSelected: {
    backgroundColor: COLORS.PrimaryColor,
  },
  textSelected: {
    fontFamily: 'Outfit-Regular',
    fontSize: 15,
    color: COLORS.WHITE,
  },
  amount: {
    fontSize: 15,
    fontFamily: 'Outfit-Regular',
    color: 'black',
  },
  warningText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 15,
    color: 'red',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  approveButton: {
    backgroundColor: COLORS.PrimaryColor,
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
  },
  rejectButton: {
    backgroundColor: '#000',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
  },
});

export default SlotApprovalModal;
