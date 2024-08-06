
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { IMAGES } from '../../../../assets/constants/global_images';
import {
  PoppinsMedium,
  PoppinsRegular,
  OutfitRegular,
  OutfitMedium
} from '../../../../assets/constants/global_fonts';
import { COLORS } from '../../../../assets/constants/global_colors';

const GroundReviews = () => {  
  const overallRating = 2.5;
  const visibleReviews = [
    {
      review_id: 'IP4Z9AJG02W7p7wZpyjI',
      reviewImage: [],
      createdAt: { seconds: 1714368577, nanoseconds: 514000000 },
      reviewContent: 'it\'s was good ground to play around',
      userId: 'JBOmZO1JtyQl60nbFD2Jlig8ce22',
      ground_id: 'ZkBMZmjdlvff84hU7srJ',
      reviewTitle: 'very nice ground',
      rating: '4',
      adminreply: 'ok',
      user_name: 'Abitha',
      profileimg: 'https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/profileImages%2FB6UoArQdHlVhihPYHFbgq4BFvNA2%2FProfile_IMG_1714129683337?alt=media&token=a9b8b5e7-754e-47b2-9a7b-0768db3a2ece%22%7D,%7B%22review_id%22:%22oZZIzf3Q9uUdMWePBgjF%22,%22adminreply%22:%22ok%22,%22rating%22:%225%22,%22reviewTitle%22:%22Awesome',
    },
    {
      review_id: 'JP4Z9AJG02W7p7wZpyjI',
      reviewImage: ['https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/reviewImages%2F6Ip56SzHQycRTqwN6nOl7iMZd193%2FReview_IMG_1714384426641?alt=media&token=5b480293-d5c1-4c86-a618-7ea564e2a592%22,%22https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/reviewImages%2F6Ip56SzHQycRTqwN6nOl7iMZd193%2FReview_IMG_1714384433278?alt=media&token=3172e9a9-fa6c-423d-94a0-e51710ec082d%22],%22reviewContent%22:%22If'],
      createdAt: { seconds: 1714368577, nanoseconds: 514000000 },
      reviewContent: 'it\'s was good ground to play around',
      userId: 'JBOmZO1JtyQl60nbFD2Jlig8ce22',
      ground_id: 'ZkBMZmjdlvff84hU7srJ',
      reviewTitle: 'very nice ground',
      rating: '3',
      adminreply: '',
      user_name: 'Gowthama',
      profileimg: 'https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/profileImages%2FB6UoArQdHlVhihPYHFbgq4BFvNA2%2FProfile_IMG_1714129683337?alt=media&token=a9b8b5e7-754e-47b2-9a7b-0768db3a2ece%22%7D,%7B%22review_id%22:%22oZZIzf3Q9uUdMWePBgjF%22,%22adminreply%22:%22ok%22,%22rating%22:%225%22,%22reviewTitle%22:%22Awesome',
    },
    // {
    //   review_id: 'IP4Z9AJG02W7p7wZpyjI',
    //   reviewImage: [],
    //   createdAt: {seconds: 1714368577,nanoseconds: 514000000},
    //   reviewContent: 'it\'s was good ground to play around',
    //   userId:'JBOmZO1JtyQl60nbFD2Jlig8ce22',
    //   ground_id: 'ZkBMZmjdlvff84hU7srJ',
    //   reviewTitle: 'very nice ground',
    //   rating: '5',
    //   adminreply: '',
    //   user_name: 'test1',
    //   profileimg: 'https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/profileImages%2FB6UoArQdHlVhihPYHFbgq4BFvNA2%2FProfile_IMG_1714129683337?alt=media&token=a9b8b5e7-754e-47b2-9a7b-0768db3a2ece%22%7D,%7B%22review_id%22:%22oZZIzf3Q9uUdMWePBgjF%22,%22adminreply%22:%22ok%22,%22rating%22:%225%22,%22reviewTitle%22:%22Awesome',
    // },
  ];
  const [allReviewsVisible, setAllReviewsVisible] = useState(false);
  const [visible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const renderStars = rating => {
    const stars = [];
    for (let i = 0.5; i <= 5; i++) {
      let starName = 'star';
      if (i > Math.floor(rating)) {
        if (i - rating < 0.5) {
          starName = 'star-half-o';
        } else {
          starName = 'star-o';
        }
      }
      stars.push(
        <Icon
          key={i}
          name={starName}
          size={24}
          color={i <= rating ? '#FFAA00' : '#D9D9D9'}
        />,
      );
    }
    return stars;
  };


  const renderReviewItem = ({ item }) => {
    // console.log('item image-----', item.reviewImage);
    const rating = parseFloat(item.rating);
    const profileImageSource = item.profileimg
      ? { uri: item.profileimg }
      : IMAGES.DefaultProfileImage;
    const createdAt = item.createdAt;
    const milliseconds = createdAt.seconds * 1000 + Math.floor(createdAt.nanoseconds / 1000000);
    const reviewDate = new Date(milliseconds);
    const formattedDate = reviewDate.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    // console.log('reviewDate,formattedDate-----',formattedDate,reviewDate);
    return (
      <View style={styles.reviewContainer}>
        <View style={styles.header}>

          <View style={styles.profileImageContainer}>
            <Image source={profileImageSource} style={styles.profileImage} />
          </View>

          <View style={styles.headerText}>
            <View style={styles.nameWithDateContainer}>
              <Text style={styles.userName}>{item.user_name}</Text>
              <Text style={styles.date}> on {formattedDate}</Text>
            </View>
            <View style={styles.rating}>
              {renderStars(rating)}
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <View style={{ marginLeft: '20%' }}>
          <Text style={styles.title}>{item.reviewTitle}</Text>
          <Text style={styles.content}>{item.reviewContent}</Text>
          <View style={styles.imagesContainer}>

            {item.reviewImage &&
              item.reviewImage.map((image, index) => (

                <Image
                  key={index}
                  source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/reviewImages%2F6Ip56SzHQycRTqwN6nOl7iMZd193%2FReview_IMG_1714384426641?alt=media&token=5b480293-d5c1-4c86-a618-7ea564e2a592%22,%22https://firebasestorage.googleapis.com/v0/b/venzoturfbooking.appspot.com/o/reviewImages%2F6Ip56SzHQycRTqwN6nOl7iMZd193%2FReview_IMG_1714384433278?alt=media&token=3172e9a9-fa6c-423d-94a0-e51710ec082d%22],%22reviewContent%22:%22If' }}
                  style={styles.reviewImage}
                />
              ))}
          </View>
          <TouchableOpacity
            onPress={openModal}
          >
            <Text style={styles.replyTextColor}>Reply</Text>
          </TouchableOpacity>

        </View>


      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.overallRatingBox}>
        <Text style={styles.overallRatingText}>{overallRating.toFixed(1)}</Text>
        <Text style={styles.overallRatingValue}>Out Of 5</Text>
        <View style={styles.overallRatingStars}>
          {renderStars(overallRating)}
        </View>
      </View>
      <FlatList
        data={visibleReviews}
        renderItem={renderReviewItem}
        keyExtractor={item => item.review_id}
        contentContainerStyle={styles.listContent}
      />


      <View style={{ justifyContent: 'center', flexDirection: 'row', margin: 20 }}>
        {!allReviewsVisible && (
          <TouchableOpacity
            style={styles.loadMoreButton}
          >
            <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={styles.loadMoreText}>Load More</Text>
              <Icon
                name={'plus-square-o'}
                size={17}
                color="#200E32"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
      {/* <Modal

        transparent={true}
        visible={visible}
        onRequestClose={closeModal} >
        <View style={styles.modalContainer}>
        <Text style={styles.replyTextColor}>Title of your Reply</Text>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    margin: 15,
    height: '100%',
  },
  listContent: {
    paddingBottom: 10,
  },
  overallRatingBox: {
    backgroundColor: '#F9F9F6',
    padding: 15,
    width: '50%',
    borderRadius: 10,
    alignItems: 'center',
    margin: 15,
  },
  overallRatingText: {
    fontFamily: PoppinsMedium,
    fontSize: 20,
    color: '#192335',
  },
  overallRatingStars: {
    flexDirection: 'row',
    gap: 3,
  },
  overallRatingValue: {
    fontFamily: PoppinsRegular,
    fontSize: 12,
    color: '#757C8D',
    marginBottom: 10,
  },
  reviewContainer: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 57,
    height: 57,
    borderRadius: 50,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  replyTextColor: {
    fontSize: 14,
    color: COLORS.replyTextColor,
    fontFamily: OutfitMedium
  },
  headerText: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontFamily: OutfitRegular,
    color: COLORS.reviewNametext,
    textTransform: 'capitalize',
  },

  date: {
    fontSize: 16,
    fontFamily: OutfitRegular,
    color: COLORS.reviewNametext,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 10,
  },
  ratingText: {
    fontFamily: OutfitRegular,
    marginLeft: 5,
    fontSize: 16,
    color: COLORS.reviewNametext,
    lineHeight: 22,
  },
  title: {
    fontFamily: OutfitMedium,
    fontSize: 14,
    marginBottom: 5,
    color: COLORS.buttonColor,
  },
  content: {
    flex: 1,
    fontFamily: OutfitRegular,
    fontSize: 14,
    color: COLORS.reviewNametext,
    marginBottom: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  loadMoreButton: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#EAEDF0',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  loadMoreText: {
    fontFamily: PoppinsRegular,
    color: '#192335',
    fontSize: 14,
  },
  icon: {
    marginLeft: 5,
    // alignSelf: 'center',
  },
  nameWithDateContainer: {
    margin: 10,
    flexDirection: 'row',
  }
});

export default GroundReviews;
