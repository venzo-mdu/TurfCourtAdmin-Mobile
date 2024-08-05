
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const GroundReviews = ({groundContent, overallRating}) => {
  const [visibleReviews, setVisibleReviews] = useState(
    // groundContent.slice(0, 3),
  );
  const [allReviewsVisible, setAllReviewsVisible] = useState(false);

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

  const renderReviewItem = ({item}) => {
    const rating = parseFloat(item.rating);
    const profileImageSource = item.profileimg
      ? {uri: item.profileimg}
      : IMAGES.DefaultProfileImage;
    return (
      <View style={styles.reviewContainer}>
        <View style={styles.header}>
          <Image source={profileImageSource} style={styles.profileImage} />
          <View style={styles.headerText}>
            <Text style={styles.userName}>{item.user_name}</Text>
            <View style={styles.rating}>
              {renderStars(rating)}
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        <View style={{marginLeft: '20%'}}>
          <Text style={styles.title}>{item.reviewTitle}</Text>
          <Text style={styles.content}>{item.reviewContent}</Text>
          <View style={styles.imagesContainer}>
            {item.reviewImage &&
              item.reviewImage.map((image, index) => (
                <Image
                  key={index}
                  source={{uri: image}}
                  style={styles.reviewImage}
                />
              ))}
          </View>
        </View>
      </View>
    );
  };

  const handleLoadMore = () => {
    setVisibleReviews(groundContent);
    setAllReviewsVisible(true);
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

      <View style={{justifyContent: 'center', flexDirection: 'row'}}>
        {!allReviewsVisible && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            >
            <View style={{justifyContent: 'center', flexDirection: 'row'}}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
    marginBottom: 15,
  },
  overallRatingText: {
    // fontFamily: PoppinsMedium,
    fontSize: 20,
    color: '#192335',
  },
  overallRatingStars: {
    flexDirection: 'row',
    gap: 3,
  },
  overallRatingValue: {
    // fontFamily: PoppinsRegular,
    fontSize: 12,
    color: '#757C8D',
    marginBottom: 10,
  },
  reviewContainer: {
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerText: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    // fontFamily: PoppinsRegular,
    color: '#757C8D',
    textTransform: 'capitalize',
  },
  date: {
    color: '#777',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    // fontFamily: PoppinsRegular,
    marginLeft: 5,
    fontSize: 16,
    color: '#757c8d',
    lineHeight: 22,
  },
  title: {
    // fontFamily: PoppinsMedium,
    fontSize: 16,
    marginBottom: 5,
    color: '#192335',
  },
  content: {
    flex: 1,
    // fontFamily: PoppinsRegular,
    fontSize: 14,
    color: '#757C8D',
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
    // fontFamily: PoppinsRegular,
    color: '#192335',
    fontSize: 14,
  },
  icon: {
    marginLeft: 5,
    // alignSelf: 'center',
  },
});

export default GroundReviews;
