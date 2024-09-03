import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CommonTextInput from '../../../../components/molecules/CommonTextInput';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { IMAGES } from '../../../../assets/constants/global_images';
import {
  createCity,
  createGroundData,
  getgroundDataById,
  UpdateGroundData,
  uploadFile,
} from '../../../../firebase/firebaseFunction/groundDetails';
import { launchImageLibrary } from 'react-native-image-picker';
import CommonTextArea from '../../../../components/molecules/CommonTextArea';
import CheckBox from '@react-native-community/checkbox';
import { userData } from '../../../../firebase/firebaseFunction/userDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ADDARENA, ADMINARENA, ADMINHOME } from '../../..';
import Collapsible from 'react-native-collapsible';
import { COLORS } from '../../../../assets/constants/global_colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const ArenaScreen = () => {
  const [tab, setTab] = useState('Basic Details');
  const route = useRoute();
  const { groundID } = route.params || null;
  //const [review, setGroundData] = useState({});
  //console.log("groundID", groundID);
  const [groundData, setGroundData] = useState({
    groundname: '',
    phonenumber: '',
    email: '',
    groundtype: '',
    coverImage: [],
    game_type: [],
    includes: [],
    rules: [],
    amenities: [],
    gallery: [],
    city: '',
    state: '',
    street_address: '',
    pincode: '',
    latitude: '',
    longitude: '',
    start_time: '',
    end_time: '',
    active: '',
  });
  const navigation = useNavigation();
  const [details, setDetails] = useState({});
  //console.log("Ground Data", groundData)
  const [tempstate, settempstate] = useState();
  //let uid = localStorage.getItem("uid");
  // const navigate = useNavigate();
  const [game_type, setgame_type] = useState([
    'Cricket',
    'Badminton',
    'Table Tennis',
    'Football',
    'Volleyball',
    'Hockey',
    'Basketball',
    'Archery',
    'Softball',
    'Baseball',
  ]);
  const [uid, setUid] = useState([]);
  const [valData, setvalData] = useState(true);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ]);
  const [textAreas, setTextAreas] = useState(
    groundData ? groundData?.rules : [''],
  );
  const [basicDetailsOpen, setBasicDetailsOpen] = useState(true);
  const [coverImageOpen, setCoverImageOpen] = useState(true);
  const [sportsAvailableOpen, setSportsAvailableOpen] = useState(true);
  const [inclueOpen, setInclueOpen] = useState(true);
  const [ruleOpen, setRuleOpen] = useState(true);
  const [amenitiesOpen, setAmenitiesOpen] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(true);
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [loader, setLoader] = useState(false);
  const [isChecked, setIsChecked] = useState(false);


  //console.log("details", details);
  //console.log("value12345",groundData?.active)

  const tabs = [
    'Basic Details',
    'Cover Image',
    'Sports Available',
    'Include',
    'Rules',
    'Amenities',
    'Gallery',
    'Location',
  ];
  const includes = [
    'Badminton Racket Unlimited',
    'Bats',
    'Hitting Machines',
    'Multiple Courts',
    'Spare Players',
    'Instant Racket',
    'Green Turfs',
  ];
  const amenities = [
    'Parking',
    'Drinking Water',
    'First Aid',
    'Change Room',
    'Shower',
  ];

  const createtempgroundData = {
    groundname: '',
    phonenumber: '',
    email: '',
    groundtype: '',
    coverImage: [],
    game_type: [],
    includes: [],
    rules: [],
    amenities: [],
    gallery: [],
    city: '',
    state: '',
    street_address: '',
    pincode: '',
    latitude: '',
    longitude: '',
    start_time: '',
    end_time: '',
    active: '',
  };

  const iconsss = {
    Cricket: IMAGES.Cricket,
    Badminton: IMAGES.Badmiton,
    'Table Tennis': IMAGES.TableTennis,
    Football: IMAGES.Football,
    Volleyball: IMAGES.Volleyball,
    Hockey: IMAGES.Hockey,
    Basketball: IMAGES.Basketball,
    Archery: IMAGES.Archery,
    Baseball: IMAGES.Baseball,
    Softball: IMAGES.Softball,
  };

  const handleInputChange = (key, value) => {
    setGroundData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleCheckbox = () => {
    console.log('jiii');
    setIsChecked(prevState => {
      if (!prevState) {
        setGroundData({
          start_time: '00:00',
          end_time: '23:59',
        });
      } else {
        setGroundData({
          ...groundData,
          start_time: '',
          end_time: '',
        });
      }
      return !prevState;
    });
  };


  /* UID */
  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('uid');
      console.log('value', value);
      if (value) {
        //const user = await userData(parsedValue?.user_id);
        setUid(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error retrieving user data', error);
    }
  };

  useEffect(() => {
    getUserData();
    // getLocation();
  }, []);
  //console.log("uid value123", uid)
  //console.log("uid value1233444", details)

  //   const grndData = async () => {
  //    console.log("uid values", uid)
  //       //let groundres = await getgroundDataById(data);
  //       let user = await userData(uid);
  // console.log("user", user)
  //       // setGroundData(groundres);
  //       // setArenaDetails(groundres);
  //       setDetails(user);

  //       // settempstate(groundres);
  //       // setTextAreas(groundres?.rules);
  //       // setLoader(false);

  //       // setGroundData(createtempgroundData);

  //   };

  const grndData = async () => {
    // console.log("Update groundID123", groundID)
    if (groundID != null) {
      // console.log("Update groundID", groundID)
      let groundres = await getgroundDataById(groundID);
      let user = await userData(uid);

      setGroundData(groundres);
      //setArenaDetails(groundres);
      setDetails(user);

      settempstate(groundres);
      setTextAreas(groundres?.rules);
      setLoader(false);
    } else {
      let user = await userData(uid);

      setDetails(user);
      setGroundData(createtempgroundData);
    }
  };

  useEffect(() => {
    grndData();
    // getLocation();
  }, [uid]);

  // useEffect(() => {
  //   // Update the value of the dropdown when groundData?.active changes
  //   if (groundData?.active !== null) {
  //     setValue(groundData?.active);
  //   }
  // }, [groundData?.active]);

  /* Sports Available  */
  const handleGameclick = value => {
    const availablegame = groundData?.game_type;
    if (availablegame?.includes(value)) {
      const subarr = availablegame.filter(item => item !== value);
      setGroundData({ ...groundData, game_type: subarr });
    } else {
      setGroundData(prevData => ({
        ...prevData,
        game_type: [...(prevData.game_type || []), value],
      }));
    }
  };

  /* Include Views Handle Click */
  const handleincludeclick = value => {
    let availableinclude = groundData?.includes;
    if (availableinclude?.includes(value)) {
      let subarr = availableinclude.filter(item => item != value);
      setGroundData({ ...groundData, includes: subarr });
    } else {
      setGroundData(prevData => ({
        ...prevData,
        includes: [...(prevData.includes || []), value],
      }));
    }
  };

  /* Rules Available Sections */

  const handleAddTextArea = () => {
    // setTextAreas([...textAreas, ""]);
    const updatedTextAreas = [...textAreas, ''];
    setTextAreas(updatedTextAreas);
    setGroundData({ ...groundData, rules: updatedTextAreas });
  };

  const handleDeleteTextArea = index => {
    const updatedTextAreas = textAreas.filter((_, i) => i !== index);
    setTextAreas(updatedTextAreas);
    setGroundData({ ...groundData, rules: updatedTextAreas });
  };

  const handleTextAreaChange = (index, value) => {
    const updatedTextAreas = [...textAreas];
    updatedTextAreas[index] = value;
    setTextAreas(updatedTextAreas);
    setGroundData({ ...groundData, rules: updatedTextAreas });
  };

  /* Handle Amenities Sections */
  const handleAmenitiesClick = value => {
    let availableAmenities = groundData?.amenities;
    if (availableAmenities?.includes(value)) {
      let subarr = availableAmenities.filter(item => item !== value);
      setGroundData({ ...groundData, amenities: subarr });
    } else {
      setGroundData(prevData => ({
        ...prevData,
        amenities: [...(prevData.amenities || []), value],
      }));
    }
  };

  /* Gallery Image Upload Function Start */
  const handleGalleryClick = async () => {
    //setLoader(true);
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 0, // Allows multiple image selection
    };

    launchImageLibrary(options, async response => {
      //console.log("response111", response)
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const images = response.assets;
        const newImages = [];
        for (let image of images) {
          const fileType = image.type;
          if (fileType !== 'image/svg+xml') {
            //console.log("Hi")
            const fileUri = image.uri;
            const fileName = 'Gallery_IMG_' + new Date().getTime();
            const imageUrl = await uploadFile(
              uid,
              fileName,
              fileUri,
              'galleryImage',
            );
            console.log('imageUrl', imageUrl);
            newImages.push(imageUrl);
          } else {
            Alert.alert('SVG files are not allowed.');
          }
        }
        setGroundData(prevReview => ({
          ...prevReview,
          gallery: [...prevReview.gallery, ...newImages],
        }));
      }
    });
    setLoader(false);
  };

  const handleImageGalleryDelete = index => {
    setGroundData(prevReview => {
      const updatedImages = prevReview.gallery.filter((_, i) => i !== index);
      return { ...prevReview, gallery: updatedImages };
    });
  };
  /* Cover Image Upload Function End */

  /* Handle Cover IMAGE Sections Views */
  const handleClick = async () => {
    // setLoader(true);
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 0, // Allows multiple image selection
    };

    launchImageLibrary(options, async response => {
      // console.log("response111", response)
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const images = response.assets;
        const newImages = [];
        for (let image of images) {
          const fileType = image.type;
          if (fileType !== 'image/svg+xml') {
            console.log('Hi');
            const fileUri = image.uri;
            const fileName = 'Cover_IMG_' + new Date().getTime();
            const imageUrl = await uploadFile(
              uid,
              fileName,
              fileUri,
              'coverImage',
            );
            console.log('imageUrl', imageUrl);
            newImages.push(imageUrl);
          } else {
            Alert.alert('SVG files are not allowed.');
          }
        }
        setGroundData(prevReview => ({
          ...prevReview,
          coverImage: [...prevReview.coverImage, ...newImages],
        }));
      }
    });
    setLoader(false);
  };

  const handleImageDelete = index => {
    setGroundData(prevReview => {
      const updatedImages = prevReview.coverImage.filter((_, i) => i !== index);
      return { ...prevReview, coverImage: updatedImages };
    });
  };

  /* Data Input Locations Values */
  const capitalize = str => {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const startCase = str => {
    if (typeof str !== 'string') return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  /* Final Create Data Functions */
  const createground = async groundData => {
    let create;
    let createcity;
    let tempval = {
      groundname: false,
      phonenumber: false,
      email: false,
      groundtype: false,
      coverImage: false,
      game_type: false,
      includes: false,
      rules: false,
      amenities: false,
      gallery: false,
      city: false,
      state: false,
      street_address: false,
      pincode: false,
      start_time: false,
      end_time: false,
      // active: false,
    };
console.log('fff',groundData);
    if (groundData?.groundname != '') {
      tempval.groundname = true;
    }
    if (groundData?.groundtype != '') {
      tempval.groundtype = true;
    }
    if (groundData?.email != '') {
      tempval.email = true;
    }
    if (groundData?.phonenumber != '') {
      tempval.phonenumber = true;
    }
    if (groundData?.coverImage != []) {
      tempval.coverImage = true;
    }
    if (groundData?.street_address != '') {
      tempval.street_address = true;
    }
    if (groundData?.pincode != '') {
      tempval.pincode = true;
    }
    if (groundData?.state != '') {
      tempval.state = true;
    }
    if (groundData?.city != '') {
      tempval.city = true;
    }
    if (groundData?.game_type != []) {
      tempval.game_type = true;
    }
    if (groundData?.includes != []) {
      tempval.includes = true;
    }
    if (groundData?.rules != []) {
      tempval.rules = true;
    }
    if (groundData?.amenities != []) {
      tempval.amenities = true;
    }
    if (groundData?.gallery != []) {
      tempval.gallery = true;
    }
    if (groundData?.start_time != '') {
      tempval.start_time = true;
    }
    if (groundData?.end_time != '') {
      tempval.end_time = true;
    }
    // if (groundData?.active != "") {
    //   tempval.active = true;
    // }
    //  setLoader(true);
    setvalData(Object.values(tempval).every(Boolean));
    if (Object.values(tempval).every(Boolean)) {
      // console.log("detailOwner", details.owner)
      if (details.owner) {
        setLoader(true);
        groundData.owner = uid;
        groundData.latitude = '9.92872166589861';
        groundData.longitude = '78.16099437904265';
        groundData.city = groundData?.city.toLowerCase();
        //  console.log(groundData, "setGroundData");

        create = await createGroundData(groundData);
        createcity = await createCity({ cityName: groundData?.city });

        setLoader(false);
        console.log(create, 'create', 'check ', createcity);
        setGroundData(create);
        // navigate("/courtadmin/dashboard");
        navigation.navigate(ADMINHOME, { refreshViews: true });
        ToastAndroid.show('Ground Added Successfully', ToastAndroid.SHORT);
        // grndData();
      } else {
        console.log('not a owner');
      }
    }
  };

  /* Update Ground Details Sections */
  const updateground = async groundData => {
    if (uid == null) {
      navigate('/login');
      return;
    }
    setLoader(true);
    let createcity;
    let tempval = {
      groundname: false,
      phonenumber: false,
      email: false,
      groundtype: false,
      coverImage: false,
      game_type: false,
      includes: false,
      rules: false,
      amenities: false,
      gallery: false,
      city: false,
      state: false,
      street_address: false,
      pincode: false,
      start_time: false,
      end_time: false,
      // active: false,
    };
    if (groundData?.groundname != '') {
      tempval.groundname = true;
    } else {
    }
    if (groundData?.groundtype != '') {
      tempval.groundtype = true;
    }
    if (groundData?.email != '') {
      tempval.email = true;
    }
    if (groundData?.phonenumber != '') {
      tempval.phonenumber = true;
    }
    if (groundData?.coverImage != []) {
      tempval.coverImage = true;
    }
    if (groundData?.street_address != '') {
      tempval.street_address = true;
    }
    if (groundData?.pincode != '') {
      tempval.pincode = true;
    }
    if (groundData?.state != '') {
      tempval.state = true;
    }
    if (groundData?.city != '') {
      tempval.city = true;
    }
    if (groundData?.game_type != []) {
      tempval.game_type = true;
    }
    if (groundData?.includes != []) {
      tempval.includes = true;
    }
    if (groundData?.rules != []) {
      tempval.rules = true;
    }
    if (groundData?.amenities != []) {
      tempval.amenities = true;
    }
    if (groundData?.gallery != []) {
      tempval.gallery = true;
    }
    if (groundData?.start_time != '') {
      tempval.start_time = true;
    }
    if (groundData?.end_time != '') {
      tempval.end_time = true;
    }
    //console.log("groundData?.active", groundData?.active)
    // if (groundData?.active != "") {
    //   tempval.active = true;
    // }

    console.log(tempval, 'tempval', Object.values(tempval).every(Boolean));
    setvalData(Object.values(tempval).every(Boolean));
    if (Object.values(tempval).every(Boolean)) {
      console.log('tempval', '2');
      if (details.owner) {
        let update = '';
        groundData.rules = textAreas;
        groundData.city = groundData?.city.toLowerCase();
        // console.log("Update Values", groundID)
        update = await UpdateGroundData(groundData, groundID);
        createcity = await createCity({ cityName: groundData?.city });
        console.log('update', update);
        setLoader(false);
        if (update.status === 'success') {
          // toast.success("Update Success", {
          //   position: "top-right",
          //   autoClose: 2000,
          // });
          navigation.navigate(ADMINHOME, { refreshViews: true });
          ToastAndroid.show('Ground Updated Successfully', ToastAndroid.SHORT);
        } else {
          // toast.error("Update Failed", {
          //   position: "top-right",
          //   autoClose: 2000,
          // });
          ToastAndroid.show('Ground Updated Failed', ToastAndroid.SHORT);
        }
        // console.log(update, data, "check ");
        //console.log("update values", update)
        setGroundData(update);
        console.log(typeof update, 'check ');
        grndData();
      } else {
        console.log('not a owner');
      }
    }
  };

  /* Time Format Views */
  const formatTime = date => {
    if (!date) return 'Select Time';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainerIncludes}>
      <CheckBox
        value={groundData?.includes?.includes(item)}
        onValueChange={() => handleincludeclick(item)}
        tintColors={{ true: '#097E52', false: '#878787' }}
      />
      <Text style={styles.labelIncludes}>{item}</Text>
    </View>
  );

  const renderAmenities = ({ item }) => (
    <View style={styles.itemContainerIncludes}>
      <CheckBox
        value={groundData?.amenities?.includes(item)}
        onValueChange={() => handleAmenitiesClick(item)}
        tintColors={{ true: '#097E52', false: '#878787' }}
      />
      <Text style={styles.labelIncludes}>{item}</Text>
    </View>
  );

  const renderItemRules = ({ item, index }) => (
    <View key={index} style={styles.itemContainerRule}>
      <View>
        <CommonTextArea
          value={item}
          onChangeText={value => handleTextAreaChange(index, value)}
          placeholder="Enter your Rules"
        />
      </View>
      <View>
        <TouchableOpacity
          style={styles.deleteButtonRule}
          onPress={() => handleDeleteTextArea(index)}>
          <View
            style={{
              backgroundColor: '#FFDEDE',
              padding: 5,
              borderRadius: 9,
              width: 26,
            }}>
            <MaterialCommunityIcons
              name="delete-outline"
              size={15}
              color="#E50000"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      {loader ? (<View style={styles.loaderContainer}>
        <ActivityIndicator
          size={50}
          color={COLORS.PrimaryColor}
          animating={loader}
        />
        <Text>Loading...</Text>
      </View>) :
        (<View style={styles.container}>
          {/* Basic Info         */}
          <View style={{ zIndex: 5000, paddingBottom: 24 }}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !basicDetailsOpen ? styles.openHeader : styles.closedHeader,
              ]}
              onPress={() => setBasicDetailsOpen(!basicDetailsOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Basic Info</Text>
              <Ionicons
                name={!basicDetailsOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={basicDetailsOpen}>
              <View
                style={{ paddingHorizontal: 20, backgroundColor: COLORS.WHITE }}>
                <View
                  style={{
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <View
                style={[
                  {
                    paddingTop: 20,
                    zIndex: 2000,
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                ]}>
                <CommonTextInput
                  label="Arena Name"
                  value={groundData?.groundname}
                  onChangeText={text => handleInputChange('groundname', text)}
                  keyboardType="default"
                />
                <CommonTextInput
                  label="Mobile Number"
                  value={groundData?.phonenumber}
                  onChangeText={text => handleInputChange('phonenumber', text)}
                  keyboardType="phone-pad"
                />
                <CommonTextInput
                  label="Email"
                  value={groundData?.email}
                  onChangeText={text => handleInputChange('email', text)}
                  keyboardType="email-address"
                />
                <CommonTextInput
                  label="Court Type"
                  value={groundData?.groundtype}
                  onChangeText={text => handleInputChange('groundtype', text)}
                  keyboardType="default"
                />
                <View style={styles.inputContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <Text style={styles.label}>Opens At</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' ,}}
                    >
                      <CheckBox
                        value={isChecked}
                        onValueChange={handleCheckbox}
                        tintColors={{ true: '#097E52', false: '#878787' }}
                        style={{marginBottom:5}}
                      />
                      <Text style={styles.checkboxLabel}>Set 24hour Option</Text></View>
                  </View>
                  <TouchableOpacity
                    style={styles.inputDateView}
                    onPress={() => setOpenStartPicker(true)}>
                    <Text style={styles.inputText}>
                      {groundData?.start_time || 'Select Time'}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    open={openStartPicker}
                    date={new Date()}
                    mode="time"
                    onConfirm={date => {
                      setOpenStartPicker(false);
                      //handleInputChange('start_time', date);
                      setGroundData(prevState => ({
                        ...prevState,
                        ['start_time']: formatTime(date),
                      }));
                    }}
                    onCancel={() => {
                      setOpenStartPicker(false);
                    }}
                  />
                  {!groundData?.start_time && !valData && (
                    <Text style={styles.errorText}>*Enter start time</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Closes At</Text>
                  <TouchableOpacity
                    style={styles.inputDateView}
                    onPress={() => setOpenEndPicker(true)}>
                    <Text style={styles.inputText}>
                      {groundData?.end_time || 'Select Time'}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    style={{ fontFamily: 'Outfit-Regular' }}
                    modal
                    open={openEndPicker}
                    date={new Date()}
                    mode="time"
                    onConfirm={date => {
                      setOpenEndPicker(false);
                      //handleInputChange('end_time', date);
                      setGroundData(prevState => ({
                        ...prevState,
                        ['end_time']: formatTime(date),
                      }));
                    }}
                    onCancel={() => {
                      setOpenEndPicker(false);
                    }}
                  />
                  {!groundData?.end_time && !valData && (
                    <Text style={styles.errorText}>*Enter end time</Text>
                  )}
                </View>
              </View>
            </Collapsible>
          </View>

          {/* CoverImage */}
          <View style={{ zIndex: 5000, paddingBottom: 24 }}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !coverImageOpen ? styles.openHeader : styles.closedHeader,
              ]}
              onPress={() => setCoverImageOpen(!coverImageOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Cover Image</Text>
              <Ionicons
                name={!coverImageOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={coverImageOpen}>
              <View
                style={{
                  paddingHorizontal: 20,
                  backgroundColor: COLORS.WHITE,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}>
                <View
                  style={{
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: 1,
                  }}
                />
                <View
                  style={[
                    {
                      paddingTop: 20,
                      zIndex: 2000,
                      paddingHorizontal: 10,
                      backgroundColor: '#fff',
                    },
                  ]}>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleClick}>
                    <Image source={IMAGES.UploadImages} />
                    <Text style={styles.uploadText}>Upload Image</Text>
                  </TouchableOpacity>

                  <View style={styles.imageContainerUpload}>
                    {groundData?.coverImage?.map((image, index) => (
                      <View key={index} style={styles.imageWrapperUpload}>
                        <Image source={{ uri: image }} style={styles.imageUpload} />
                        <TouchableOpacity
                          onPress={() => handleImageDelete(index)}
                          style={styles.deleteButton}>
                          <MaterialCommunityIcons
                            name="delete-outline"
                            size={13}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {groundData?.coverImage?.length === 0 && (
                      <Text style={styles.errorText}>* Select cover image</Text>
                    )}

                    <Text style={styles.infoContainer}>
                      The supported image file formats are JPG, PNG, JPEG, and
                      WEBP
                    </Text>
                  </View>
                </View>
              </View>
            </Collapsible>
          </View>

          {/* Sports Available */}
          <View style={{ zIndex: 5000, paddingBottom: 24 }}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !sportsAvailableOpen ? styles.openHeader : styles.closedHeader,
              ]}
              onPress={() => setSportsAvailableOpen(!sportsAvailableOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Sports Available</Text>
              <Ionicons
                name={!sportsAvailableOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={sportsAvailableOpen}>
              <View
                style={{ paddingHorizontal: 20, backgroundColor: COLORS.WHITE }}>
                <View
                  style={{
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <View
                style={[
                  {
                    paddingVertical: 20,
                    zIndex: 2000,
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                ]}>
                <View>
                  <FlatList
                    data={game_type}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.itemContainerSports,
                          {
                            borderColor: groundData?.game_type?.includes(item)
                              ? '#000'
                              : '#F9F9F6',
                          },
                        ]}
                        onPress={() => handleGameclick(item)}>
                        <Image
                          source={iconsss[item]}
                          style={styles.iconSports}
                          resizeMode="contain"
                        />
                        <Text style={styles.itemTextSports}>
                          {item.replace('_', ' ')}
                        </Text>
                        {groundData?.game_type?.includes(item) && (
                          <Ionicons
                            style={styles.tickIconSports}
                            name="checkmark-circle"
                            size={15}
                            color="#4CA181"
                          />
                        )}
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item}
                    numColumns={3}
                    columnWrapperStyle={styles.rowSports}
                  />
                </View>
              </View>
            </Collapsible>
          </View>

          {/* Includes */}
          <View style={{ zIndex: 5000, paddingBottom: 24 }}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !inclueOpen ? styles.openHeader : styles.closedHeader,
              ]}
              onPress={() => setInclueOpen(!inclueOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Includes</Text>
              <Ionicons
                name={!inclueOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={inclueOpen}>
              <View
                style={{ paddingHorizontal: 20, backgroundColor: COLORS.WHITE }}>
                <View
                  style={{
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <View
                style={[
                  {
                    paddingVertical: 20,
                    zIndex: 2000,
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                ]}>
                <View>
                  <FlatList
                    data={includes}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                    extraData={groundData?.includes}
                  />
                </View>
              </View>
            </Collapsible>
          </View>

          {/* Rules */}
          <View style={{ zIndex: 5000, paddingBottom: 24 }}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !ruleOpen ? styles.openHeader : styles.closedHeader,
              ]}
              onPress={() => setRuleOpen(!ruleOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Rules</Text>
              <Ionicons
                name={!ruleOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={ruleOpen}>
              <View
                style={{ paddingHorizontal: 20, backgroundColor: COLORS.WHITE }}>
                <View
                  style={{
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <View
                style={[
                  {
                    paddingVertical: 20,
                    zIndex: 2000,
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                ]}>
                <View>
                  <FlatList
                    data={textAreas}
                    renderItem={renderItemRules}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainerRule}
                  />
                  <TouchableOpacity
                    style={styles.addButtonRule}
                    onPress={handleAddTextArea}>
                    <Text style={styles.addButtonTextRule}>Add Rule</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Collapsible>
          </View>

          {/* Amenities */}
          <View style={{ zIndex: 5000, paddingBottom: 24 }}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !amenitiesOpen ? styles.openHeader : styles.closedHeader,
              ]}
              onPress={() => setAmenitiesOpen(!amenitiesOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Amenities</Text>
              <Ionicons
                name={!amenitiesOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={amenitiesOpen}>
              <View
                style={{ paddingHorizontal: 20, backgroundColor: COLORS.WHITE }}>
                <View
                  style={{
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <View
                style={[
                  {
                    paddingVertical: 20,
                    zIndex: 2000,
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                ]}>
                <FlatList
                  data={amenities}
                  renderItem={renderAmenities}
                  keyExtractor={item => item}
                  extraData={groundData?.includes} // Ensures FlatList updates when state changes
                />
              </View>
            </Collapsible>
          </View>

          {/* Gallery */}
          <View style={{ zIndex: 5000, paddingBottom: 24 }}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !galleryOpen ? styles.openHeader : styles.closedHeader,
              ]}
              onPress={() => setGalleryOpen(!galleryOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Gallery</Text>
              <Ionicons
                name={!galleryOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={galleryOpen}>
              <View
                style={{ paddingHorizontal: 20, backgroundColor: COLORS.WHITE }}>
                <View
                  style={{
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <View
                style={[
                  {
                    paddingVertical: 20,
                    zIndex: 2000,
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                ]}>
                <View>
                  <View style={styles.uploadContainer}>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleGalleryClick}>
                      <Image
                        source={IMAGES.UploadImages}
                        style={styles.uploadIcon}
                      />
                      <Text style={styles.uploadText}>Upload Image</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.imageContainerUpload}>
                    {groundData?.gallery?.map((image, index) => (
                      <View key={index} style={styles.imageWrapperUpload}>
                        <Image source={{ uri: image }} style={styles.imageUpload} />
                        <TouchableOpacity
                          onPress={() => handleImageGalleryDelete(index)}
                          style={styles.deleteButton}>
                          <MaterialCommunityIcons
                            name="delete-outline"
                            size={13}
                            color="#fff"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {groundData?.gallery?.length === 0 && (
                    <Text style={styles.errorText}>*Select Gallery Image</Text>
                  )}
                </View>
              </View>
            </Collapsible>
          </View>

          {/* Location */}
          <View style={{ zIndex: 5000, paddingBottom: 24 }}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !locationOpen ? styles.openHeader : styles.closedHeader,
              ]}
              onPress={() => setLocationOpen(!locationOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Location</Text>
              <Ionicons
                name={!locationOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={locationOpen}>
              <View
                style={{ paddingHorizontal: 20, backgroundColor: COLORS.WHITE }}>
                <View
                  style={{
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <View
                style={[
                  {
                    paddingVertical: 20,
                    zIndex: 2000,
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                ]}>
                <View>
                  {/* <Text style={styles.label}>Locations</Text> */}
                  <View style={styles.stack}>
                    <CommonTextInput
                      label="State"
                      value={startCase(groundData?.state)}
                      onChangeText={value => handleInputChange('state', value)}
                    //widthStyle={true}
                    />
                    {!groundData?.state && !valData && (
                      <Text style={styles.errorText}>*Enter state</Text>
                    )}
                  </View>

                  <View style={styles.stack}>
                    <CommonTextInput
                      label="City"
                      value={capitalize(groundData?.city)}
                      onChangeText={value => handleInputChange('city', value)}
                    //widthStyle={true}
                    />
                    {!groundData?.city && !valData && (
                      <Text style={styles.errorText}>*Enter city</Text>
                    )}
                  </View>

                  <View style={styles.stack}>
                    <CommonTextInput
                      label="Street Address"
                      value={startCase(groundData?.street_address)}
                      onChangeText={value =>
                        handleInputChange('street_address', value)
                      }
                    //widthStyle={true}
                    />
                    {!groundData?.street_address && !valData && (
                      <Text style={styles.errorText}>*Enter street address</Text>
                    )}
                  </View>

                  <View style={styles.stack}>
                    <CommonTextInput
                      label="Pincode"
                      value={groundData?.pincode}
                      onChangeText={value => handleInputChange('pincode', value)}
                    // widthStyle={true}
                    />
                    {!groundData?.pincode && !valData && (
                      <Text style={styles.errorText}>*Enter pincode</Text>
                    )}
                  </View>
                </View>
              </View>
            </Collapsible>
          </View>

          {/* Overview */}
          <View style={{ zIndex: 5000, paddingBottom: 24 }}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !overviewOpen ? styles.openHeader : styles.closedHeader,
              ]}
              onPress={() => setOverviewOpen(!overviewOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Overview</Text>
              <Ionicons
                name={!overviewOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>
            <Collapsible collapsed={overviewOpen}>
              <View
                style={{ paddingHorizontal: 20, backgroundColor: COLORS.WHITE }}>
                <View
                  style={{
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: 1,
                  }}
                />
              </View>
              <View
                style={[
                  {
                    paddingVertical: 20,
                    zIndex: 2000,
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                ]}>
                <View>
                  <CommonTextArea
                    value={groundData?.overview}
                    onChangeText={text => handleInputChange('overview', text)}
                  // placeholderTextColor="#666"
                  // numberOfLines={4}
                  />
                  {!groundData?.overview && !valData && (
                    <Text style={styles.errorText}>*Enter overview</Text>
                  )}
                </View>
              </View>
            </Collapsible>
          </View>

          {/* Active/Inactive */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Arena - Active/Inactive</Text>
            <DropDownPicker
              open={open}
              value={groundID != null ? groundData?.active : value}
              items={items}
              setOpen={setOpen}
              setValue={callback => {
                const newValue = callback(value);
                setValue(newValue);
                setGroundData({
                  ...groundData,
                  active: newValue,
                });
              }}
              setItems={setItems}
              style={[styles.dropdown]}
              textStyle={styles.dropdownText}
              placeholder="Select Active/Inactive"
            />
            {!groundData?.active && !valData && (
              <Text style={styles.errorText}>
                *Select whether ground active or not
              </Text>
            )}
          </View>

          {groundID != null ? (
            <View style={styles.buttonContainerArena}>
              <TouchableOpacity
                style={[styles.buttonArena, { backgroundColor: '#097E52' }]}
                onPress={() => {
                  setGroundData(createtempgroundData);
                  setTextAreas([]);
                }}>
                <Text style={styles.buttonTextArena}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonArena, { backgroundColor: '#192335' }]}
                onPress={() => updateground(groundData)}>
                <Text style={styles.buttonTextArena}>Update</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainerArena}>
              <TouchableOpacity
                style={[styles.buttonArena, { backgroundColor: '#097E52' }]}
                onPress={() => {
                  setGroundData(createtempgroundData);
                  setTextAreas([]);
                }}>
                <Text style={styles.buttonTextArena}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonArena, { backgroundColor: '#192335' }]}
                onPress={() => createground(groundData)}>
                <Text style={styles.buttonTextArena}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>)
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    //alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    marginVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 5,
    color: '#1B1B1B',
  },
  checkboxLabel: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: '#1B1B1B',
    marginBottom: 5,
  },
  inputDateView: {
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 10,
    fontFamily: 'Outfit-Regular',
    fontSize: 20,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },

  dropdown: {
    backgroundColor: '#FAFAFA',
    borderColor: 'transperent',
    borderRadius: 8,
    height: 60,

  },
  dropdownText: {
    fontFamily: 'Outfit-Regular',
    color: '#000',
    fontSize: 14,
  },
  errorText: {
    fontSize: 13,
    color: 'red',
    fontFamily: 'Outfit-Regular',
  },

  /* Upload Image Container */
  uploadButton: {
    marginBottom: 10,
    alignItems: 'center',
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#878787',
    borderStyle: 'dashed',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 12,
    color: '#707889',
    paddingTop: 5,
    fontFamily: 'Outfit-Regular',
    lineHeight: 22,
  },
  imageContainerUpload: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapperUpload: {
    position: 'relative',
  },
  imageUpload: {
    width: 100,
    height: 100,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  deleteButton: {
    width: 18,
    height: 18,
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#CA0D0D',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  infoContainer: {
    fontFamily: 'Outfit-Regular',
    marginBottom: 20,
    color: '#757C8D',
    fontSize: 14,
  },

  /* Sports Available */
  itemContainerSports: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.fieldColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSports: {
    // width: 52,
    // height: 35,
    marginBottom: 10,
  },
  itemTextSports: {
    color: '#192335',
    fontSize: 12,
    lineHeight: 22,
    fontFamily: 'Outfit-Medium',
  },
  tickIconSports: {
    width: 15,
    height: 15,
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 15,
  },
  rowSports: {
    justifyContent: 'space-between',
  },

  /* Includes Available */
  itemContainerIncludes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelIncludes: {
    fontFamily: 'Outfit-Regular',
    color: COLORS.fontColor,
    fontSize: 16,
    marginLeft: 10,
  },

  /* Rules Sections */
  itemContainerRule: {
    width: '100%',
    flexDirection: 'row',
  },
  deleteButtonRule: {
    // backgroundColor: '#E57373',
    // borderRadius: 5,
    // padding: 10,
    marginLeft: 10,
  },
  deleteTextRule: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainerRule: {
    flexGrow: 1,
  },
  addButtonRule: {
    backgroundColor: '#097E52',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    alignSelf: 'center',
  },
  addButtonTextRule: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteIcon: {
    width: 24, // Adjust the size as needed
    height: 24, // Adjust the size as needed
  },

  /* Amenities Sections */
  checkboxContainerAmenities: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelAmenities: {
    marginLeft: 8,
    fontSize: 16,
    color: '#757C8D',
  },

  stack: {
    marginBottom: 20,
  },

  /* Button */
  buttonContainerArena: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buttonArena: {
    borderRadius: 12,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    // width: Dimensions.get('window').width * 0.4, // Adjust width as needed
  },
  buttonTextArena: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    lineHeight: 20.16,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#F3F4F6',
  },
  accordionHeaderText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    color: '#192335',
  },
  openHeader: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  closedHeader: {
    borderRadius: 12,
  },
});

export default ArenaScreen;
