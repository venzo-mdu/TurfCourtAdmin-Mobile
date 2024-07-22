import {ActivityIndicator, Modal, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import { COLORS } from '../../assets/constants/global_colors';

const LoaderActivity = props => {
  return (
    <Modal 
      animationType="slide"
      transparent={true}
      visible={props.loader} 
      onRequestClose={props.close}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.IndicatorBox}>
          <ActivityIndicator size="large" color={props.theme} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LoaderActivity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  IndicatorBox: {
    backgroundColor: COLORS.WHITE,
    width: 36,
    height: 36,
    alignSelf: 'center',
    borderRadius: 36,
  },
});
