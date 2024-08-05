import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import {COLORS} from '../../../assets/constants/global_colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SlotModal = ({visible, slot, onClose}) => {
  const [isSelected, setIsSelected] = useState(false);

  const toggleSlotSelection = () => {
    setIsSelected(prevIsSelected => !prevIsSelected);
  };

  if (!slot) return null; // Ensure slot is defined

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{position: 'absolute', top: 10, right: 10}}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons
                name="close-circle-outline"
                size={24}
                color={COLORS.PrimaryColor}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Select slots to Approve or Reject</Text>
          <TouchableOpacity onPress={toggleSlotSelection}>
            <View
              style={[
                styles.slotContainer,
                isSelected && styles.selectedSlotContainer,
              ]}>
              <Text
                style={[
                  styles.slotTime,
                  isSelected && styles.selectedSlotTime,
                ]}>
                {new Date(slot.starttime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text style={styles.slotAmount}>Rs {slot.amount}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: COLORS.PrimaryColor}]}
              onPress={() => console.log('Approve', slot)}>
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'red'}]}
              onPress={() => console.log('Reject', slot)}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    marginBottom: 20,
  },
  slotContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.PrimaryColor,
    borderRadius: 5,
  },
  selectedSlotContainer: {
    backgroundColor: COLORS.PrimaryColor,
  },
  slotTime: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    color: COLORS.PrimaryColor,
  },
  selectedSlotTime: {
    color: 'white',
  },
  slotAmount: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 15,
    color: 'white',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: 'blue',
  },
});

export default SlotModal;
