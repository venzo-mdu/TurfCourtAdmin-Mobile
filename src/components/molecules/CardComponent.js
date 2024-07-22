import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CardComponent = ({ item, index, selectGround, handleHeartPress, loading, handleBook, userId }) => (
  <TouchableOpacity onPress={() => selectGround(item?.ground_id, index)}>
    <View style={styles.card}>
      <Image source={{ uri: item.coverImage[0] }} style={styles.image} resizeMode='cover' />
      <View style={styles.overlay}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="green" />
          <Text style={styles.ratingText}>{item.overallRating}</Text>
        </View>
        <View style={styles.heartContainer}>
          <TouchableOpacity onPress={(event) => handleHeartPress(event, index, item)}>
            {loading[index] ? (
              <ActivityIndicator size="small" color="gray" />
            ) : (
              <Icon name={(item.favarote === true) ? 'heart' : 'heart-o'} size={24} color={(item.favarote === true) ? 'green' : 'gray'} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingTop: 20 }}>
        <Text style={styles.title}>{item.groundname}</Text>
        <View style={styles.iconContainer}>
          {/* <Image source={require('path/to/LocationIcon.png')} style={{ width: 20, height: 20 }} /> */}
          <Text style={styles.address}>{`${item.street_address}, ${item.city}`}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookButton} onPress={() => handleBook(item.ground_id, userId)}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 380,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
    paddingHorizontal: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  address: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '400',
    color: '#000000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 16,
    left: 16,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    width: 60,
    padding: 5,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#6B7385',
  },
  heartContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  bookButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#4CA181',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CardComponent;
