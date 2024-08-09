import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import SlotApprovalModal from '../components/molecules/slotApprovalModel';

const TestScreen = () => {
  const [statusopen, setstatusopen] = useState(false);

  // Dummy data
  const selectedEventData = [
    {
      start: new Date().toISOString(),
      amount: 100,
      status: 'Pending',
      event_id: '1',
    },
    {
      start: new Date().toISOString(),
      amount: 200,
      status: 'Pending',
      event_id: '2',
    },
    {
      start: new Date().toISOString(),
      amount: 300,
      status: 'Accepted',
      event_id: '3',
    },
    {
      start: new Date().toISOString(),
      amount: 100,
      status: 'Pending',
      event_id: '1',
    },
    {
      start: new Date().toISOString(),
      amount: 200,
      status: 'Pending',
      event_id: '2',
    },
    {
      start: new Date().toISOString(),
      amount: 300,
      status: 'Accepted',
      event_id: '3',
    },
    {
      start: new Date().toISOString(),
      amount: 100,
      status: 'Pending',
      event_id: '1',
    },
    {
      start: new Date().toISOString(),
      amount: 200,
      status: 'Pending',
      event_id: '2',
    },
  ];

  const handleEventDataUpdate = groundIds => {
    console.log('Event data updated with groundIds:', groundIds);
    // Handle event data update logic here
  };

  return (
    <View style={styles.container}>
      <Button title="Open Modal" onPress={() => setstatusopen(true)} />
      <SlotApprovalModal
        statusopen={statusopen}
        setstatusopen={setstatusopen}
        selectedEventData={selectedEventData}
        setSelectedEventData={() => {}}
        eventData={handleEventDataUpdate}
        groundIds={[]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default TestScreen;
