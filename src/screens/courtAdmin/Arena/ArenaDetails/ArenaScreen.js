import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, FlatList, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonTextInput from '../../../../components/molecules/CommonTextInput';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { IMAGES } from '../../../../assets/constants/global_images';
import { createCity, createGroundData, getgroundDataById, UpdateGroundData, uploadFile } from '../../../../firebase/firebaseFunction/groundDetails';
import { launchImageLibrary } from 'react-native-image-picker';
import CommonTextArea from '../../../../components/molecules/CommonTextArea';
import CheckBox from '@react-native-community/checkbox'; 
import { userData } from '../../../../firebase/firebaseFunction/userDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ADDARENA, ADMINARENA } from '../../..';

const ArenaScreen = () => {
  const [tab, setTab] = useState("Basic Details");
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
  const [loader, setLoading] = useState(false);
  const [tempstate, settempstate] = useState();
  //let uid = localStorage.getItem("uid");
 // const navigate = useNavigate();
  const [game_type, setgame_type] = useState([
    "Cricket",
    "Badminton",
    "Table Tennis",
    "Football",
    "Volleyball",
    "Hockey",
    "Basketball",
    "Archery",
    "Softball",
    "Baseball",
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
    groundData ? groundData?.rules : [""]
  );

  //console.log("details", details);
  //console.log("value12345",groundData?.active)

  const tabs = [
    "Basic Details",
    "Cover Image",
    "Sports Available",
    "Include",
    "Rules",
    "Amenities",
    "Gallery",
    "Location",
  ];
  const includes = [
    "Badminton Racket Unlimited",
    "Bats",
    "Hitting Machines",
    "Multiple Courts",
    "Spare Players",
    "Instant Racket",
    "Green Turfs",
  ];
  const amenities = [
    "Parking",
    "Drinking Water",
    "First Aid",
    "Change Room",
    "Shower",
  ];

  const createtempgroundData = {
    groundname: "",
    phonenumber: "",
    email: "",
    groundtype: "",
    coverImage: [],
    game_type: [],
    includes: [],
    rules: [],
    amenities: [],
    gallery: [],
    city: "",
    state: "",
    street_address: "",
    pincode: "",
    latitude: "",
    longitude: "",
    start_time: "",
    end_time: "",
    active: "",
  };

  const iconsss = {
    Cricket: IMAGES.Cricket,
    Badminton: IMAGES.Badmiton,
    "Table Tennis": IMAGES.TableTennis,
    Football: IMAGES.Football,
    Volleyball: IMAGES.Cricket,
    Hockey: IMAGES.Badmiton,
    Basketball: IMAGES.Cricket,
    Archery: IMAGES.Badmiton,
    Baseball: IMAGES.Cricket,
    Softball: IMAGES.Badmiton,
  };

  const handleInputChange = (key, value) => {
    setGroundData(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  /* UID */
  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('uid');
      console.log("value", value)
      if (value) {
        //const user = await userData(parsedValue?.user_id);
        setUid(JSON.parse(value));
      }
    } catch (error) {
      console.error("Error retrieving user data", error);
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
//       // setLoading(false);
   
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
    setLoading(false);
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
  const handleGameclick = (value) => {
    const availablegame = groundData?.game_type;
    if (availablegame?.includes(value)) {
      const subarr = availablegame.filter((item) => item !== value);
      setGroundData({ ...groundData, game_type: subarr });
    } else {
      setGroundData((prevData) => ({
        ...prevData,
        game_type: [...(prevData.game_type || []), value],
      }));
    }
  };

  /* Include Views Handle Click */
  const handleincludeclick = (value) => {
    let availableinclude = groundData?.includes;
    if (availableinclude?.includes(value)) {
      let subarr = availableinclude.filter((item) => item != value);
      setGroundData({ ...groundData, includes: subarr });
    } else {
      setGroundData((prevData) => ({
        ...prevData,
        includes: [...(prevData.includes || []), value],
      }));
    }
  };

 /* Rules Available Sections */

const handleAddTextArea = () => {
 // setTextAreas([...textAreas, ""]);
 const updatedTextAreas = [...textAreas, ""];
 setTextAreas(updatedTextAreas);
 setGroundData({ ...groundData, rules: updatedTextAreas });
};


 const handleDeleteTextArea = (index) => {
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
const handleAmenitiesClick = (value) => {
  let availableAmenities = groundData?.amenities;
  if (availableAmenities?.includes(value)) {
    let subarr = availableAmenities.filter((item) => item !== value);
    setGroundData({ ...groundData, amenities: subarr });
  } else {
    setGroundData((prevData) => ({
      ...prevData,
      amenities: [...(prevData.amenities || []), value],
    }));
  }
};

/* Gallery Image Upload Function Start */
  const handleGalleryClick = async () => {
    setLoading(true);
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 0, // Allows multiple image selection
    };

    launchImageLibrary(options, async (response) => {
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
            const fileName = "Gallery_IMG_" + new Date().getTime();
            const imageUrl = await uploadFile(uid, fileName, fileUri, 'galleryImage');
            console.log("imageUrl", imageUrl)
            newImages.push(imageUrl);
          } else {
            Alert.alert('SVG files are not allowed.');
          }
        }
        setGroundData((prevReview) => ({
          ...prevReview,
          gallery: [...prevReview.gallery, ...newImages],
        }));
      }
    });
    setLoading(false);
  };

  const handleImageGalleryDelete = (index) => {
    setGroundData((prevReview) => {
      const updatedImages = prevReview.gallery.filter((_, i) => i !== index);
      return { ...prevReview, gallery: updatedImages };
    });
  };
  /* Cover Image Upload Function End */

  /* Handle Cover IMAGE Sections Views */
  const handleClick = async () => {
    setLoading(true);
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 0, // Allows multiple image selection
    };

    launchImageLibrary(options, async (response) => {
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
            console.log("Hi")
            const fileUri = image.uri;
            const fileName = "Cover_IMG_" + new Date().getTime();
            const imageUrl = await uploadFile(uid, fileName, fileUri, 'coverImage');
            console.log("imageUrl", imageUrl)
            newImages.push(imageUrl);
          } else {
            Alert.alert('SVG files are not allowed.');
          }
        }
        setGroundData((prevReview) => ({
          ...prevReview,
          coverImage: [...prevReview.coverImage, ...newImages],
        }));
      }
    });
    setLoading(false);
  };

  const handleImageDelete = (index) => {
    setGroundData((prevReview) => {
      const updatedImages = prevReview.coverImage.filter((_, i) => i !== index);
      return { ...prevReview, coverImage: updatedImages };
    });
  };

  /* Data Input Locations Values */
  const capitalize = (str) => {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const startCase = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  /* Final Create Data Functions */
  const createground = async (groundData) => {
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
    if (groundData?.groundname != "") {
      tempval.groundname = true;
    }
    if (groundData?.groundtype != "") {
      tempval.groundtype = true;
    }
    if (groundData?.email != "") {
      tempval.email = true;
    }
    if (groundData?.phonenumber != "") {
      tempval.phonenumber = true;
    }
    if (groundData?.coverImage != []) {
      tempval.coverImage = true;
    }
    if (groundData?.street_address != "") {
      tempval.street_address = true;
    }
    if (groundData?.pincode != "") {
      tempval.pincode = true;
    }
    if (groundData?.state != "") {
      tempval.state = true;
    }
    if (groundData?.city != "") {
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
    if (groundData?.start_time != "") {
      tempval.start_time = true;
    }
    if (groundData?.end_time != "") {
      tempval.end_time = true;
    }
    // if (groundData?.active != "") {
    //   tempval.active = true;
    // }

    setvalData(Object.values(tempval).every(Boolean));
    if (Object.values(tempval).every(Boolean)) {
     // console.log("detailOwner", details.owner)
      if (details.owner) {
        groundData.owner = uid;
        groundData.latitude = "9.92872166589861";
        groundData.longitude = "78.16099437904265";
        groundData.city = groundData?.city.toLowerCase();
      //  console.log(groundData, "setGroundData");
        setLoading(true);
        create = await createGroundData(groundData);
        createcity = await createCity({ cityName: groundData?.city });
        

        setLoading(false);
        console.log(create, "create", "check ", createcity);
        setGroundData(create);
       // navigate("/courtadmin/dashboard");
       navigation.navigate(ADMINARENA, { refreshViews : true })
       ToastAndroid.show('Ground Added Successfully', ToastAndroid.SHORT);
       // grndData();
      } else {
        console.log("not a owner");
      }
    }
  };


  /* Update Ground Details Sections */
  const updateground = async (groundData) => {
    if (uid == null) {
      navigate("/login");
      return;
    }
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
    if (groundData?.groundname != "") {
      tempval.groundname = true;
    } else {
    }
    if (groundData?.groundtype != "") {
      tempval.groundtype = true;
    }
    if (groundData?.email != "") {
      tempval.email = true;
    }
    if (groundData?.phonenumber != "") {
      tempval.phonenumber = true;
    }
    if (groundData?.coverImage != []) {
      tempval.coverImage = true;
    }
    if (groundData?.street_address != "") {
      tempval.street_address = true;
    }
    if (groundData?.pincode != "") {
      tempval.pincode = true;
    }
    if (groundData?.state != "") {
      tempval.state = true;
    }
    if (groundData?.city != "") {
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
    if (groundData?.start_time != "") {
      tempval.start_time = true;
    }
    if (groundData?.end_time != "") {
      tempval.end_time = true;
    }
    //console.log("groundData?.active", groundData?.active)
    // if (groundData?.active != "") {
    //   tempval.active = true;
    // }

    console.log(tempval, "tempval", Object.values(tempval).every(Boolean));
    setvalData(Object.values(tempval).every(Boolean));
    if (Object.values(tempval).every(Boolean)) {
      console.log("tempval", "2");
      if (details.owner) {
        let update = "";
        groundData.rules = textAreas;
        groundData.city = groundData?.city.toLowerCase();
       // console.log("Update Values", groundID)
        update = await UpdateGroundData(groundData, groundID);
        createcity = await createCity({ cityName: groundData?.city });
        if (typeof update === "undefined") {
          // toast.success("Update Success", {
          //   position: "top-right",
          //   autoClose: 2000,
          // });
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
        console.log(typeof update, "check ");
        grndData();
      } else {
        console.log("not a owner");
      }
    }
  };

  
/* Time Format Views */
  const formatTime = (date) => {
    if (!date) return 'Select Time';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };


  const renderItem = ({ item }) => (
    <View style={styles.itemContainerIncludes}>
      <CheckBox
        value={groundData?.includes.includes(item)}
        onValueChange={() => handleincludeclick(item)}
        tintColors={{ true: '#097E52', false: '#192335' }}
      />
      <Text style={styles.labelIncludes}>{item}</Text>
    </View>
  );

  const renderAmenities = ({ item }) => (
    <View style={styles.itemContainerIncludes}>
      <CheckBox
        value={groundData?.amenities.includes(item)}
        onValueChange={() => handleAmenitiesClick(item)}
        tintColors={{ true: '#097E52', false: '#192335' }}
      />
      <Text style={styles.labelIncludes}>{item}</Text>
    </View>
  );

  const renderItemRules = ({ item, index }) => (
    <View key={index} style={styles.itemContainerRule}>
    <View>
      <CommonTextArea
        value={item}
        onChangeText={(value) => handleTextAreaChange(index, value)}
        placeholder="Enter text"
      />
      </View>
      <View>
      <TouchableOpacity
        style={styles.deleteButtonRule}
        onPress={() => handleDeleteTextArea(index)}
      >
        {/* <Text style={styles.deleteTextRule}>Delete</Text> */}
        <Image source={IMAGES.DeleteIcons} style={styles.deleteIcon} />
      </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
            <CommonTextInput
                label="Arena Name"
                value={groundData?.groundname}
                onChangeText={(text) => handleInputChange('groundname', text)}
               // widthStyle={true} // Adjust this prop based on your requirement
              />
              <CommonTextInput
                label="Mobile Number"
                value={groundData?.phonenumber}
                onChangeText={(text) => handleInputChange('phonenumber', text)}
               // widthStyle={true} // Adjust this prop based on your requirement
              />
              <CommonTextInput
                label="Email"
                value={groundData?.email}
                onChangeText={(text) => handleInputChange('email', text)}
               // widthStyle={true} // Adjust this prop based on your requirement
              />
               <CommonTextInput
                label="Arena Type"
                value={groundData?.groundtype}
                onChangeText={(text) => handleInputChange('groundtype', text)}
               // widthStyle={true} // Adjust this prop based on your requirement
              />
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Opens At</Text>
                <TouchableOpacity style={styles.inputDateView} onPress={() => setOpenStartPicker(true)}>
                  <Text style={styles.inputText}>{groundData?.start_time || 'Select Time'}</Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={openStartPicker}
                  date={new Date()}
                  mode="time"
                  onConfirm={(date) => {
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
                <TouchableOpacity style={styles.inputDateView} onPress={() => setOpenEndPicker(true)}>
                  <Text style={styles.inputText}>{groundData?.end_time || 'Select Time'}</Text>
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={openEndPicker}
                  date={new Date()}
                  mode="time"
                  onConfirm={(date) => {
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
            <View style={styles.inputContainer}>
        <Text style={styles.label}>Arena - Active/Inactive</Text>
        <DropDownPicker
          open={open}
          value={(groundID != null) ? groundData?.active : value}
          items={items}
          setOpen={setOpen}
          setValue={(callback) => {
            const newValue = callback(value);
            setValue(newValue);
            setGroundData({
              ...groundData,
              active: newValue,
            });
          }}
          setItems={setItems}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          placeholder="Select Active/Inactive"
        />
        {!groundData?.active && !valData && (
          <Text style={styles.errorText}>*Select whether ground active or not</Text>
        )}
      </View>
      <View style={styles.uploadContainer}>
        <Text style={styles.label}>Upload Image</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleClick}>
          <Image source={IMAGES.UploadImages} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>Upload Image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainerUpload}>
        {groundData?.coverImage.map((image, index) => (
          <View key={index} style={styles.imageWrapperUpload}>
            <Image source={{ uri: image }} style={styles.imageUpload} />
            <TouchableOpacity onPress={() => handleImageDelete(index)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {groundData?.coverImage.length === 0 && (
        <Text style={styles.errorText}>*Select Cover Image</Text>
      )}

      <View style={styles.infoContainer}>
        {/* <Text>Put the main picture as first image</Text> */}
        <Text>Images should be supported file format JPG, PNG, JPEG, WEBP</Text>
      </View>
      <View>
      <CommonTextArea
              label="Overview"
              value={groundData?.overview}
              onChangeText={(text) => handleInputChange('overview', text)}
              // placeholderTextColor="#666"
              // numberOfLines={4}
            />
            {!groundData?.overview && !valData && (
              <Text style={styles.errorText}>*Enter overview</Text>
            )}
            </View>
            <View>
            <Text style={styles.label}>Sports Available</Text>
            <FlatList
        data={game_type}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.itemContainerSports,
              { borderColor: groundData?.game_type?.includes(item) ? '#000' : '#F9F9F6' },
            ]}
            onPress={() => handleGameclick(item)}
          >
            <Image source={iconsss[item]} style={styles.iconSports} />
            <Text style={styles.itemTextSports}>{item.replace("_", " ")}</Text>
            {groundData?.game_type?.includes(item) && (
              <Image source={IMAGES.TickIcons} style={styles.tickIconSports} />
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        numColumns={3}
        columnWrapperStyle={styles.rowSports}
      />
            </View>
          <View>
          <Text style={styles.label}>Inclueds</Text>
          <FlatList
        data={includes}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        extraData={groundData?.includes} // Ensures FlatList updates when state changes
      />
          </View>
          <View>
          <Text style={styles.label}>Rules</Text>
          {/* <CommonTextArea
        value={groundData?.rules}
        onChangeText={(text) => handleInputChange("rules", text)}
        placeholder="Enter text"
      /> */}
          <FlatList
        data={textAreas}
        renderItem={renderItemRules}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainerRule}
      />
      <TouchableOpacity
        style={styles.addButtonRule}
        onPress={handleAddTextArea}
      >
        <Text style={styles.addButtonTextRule}>Add Rule</Text>
      </TouchableOpacity>
          </View>
          <View>
          <Text style={styles.label}>Amenities</Text>
         
          <FlatList
        data={amenities}
        renderItem={renderAmenities}
        keyExtractor={(item) => item}
        extraData={groundData?.includes} // Ensures FlatList updates when state changes
      />
          </View>
          <View>
          <View style={styles.uploadContainer}>
        <Text style={styles.label}>Gallery Image</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleGalleryClick}>
          <Image source={IMAGES.UploadImages} style={styles.uploadIcon} />
          <Text style={styles.uploadText}>Upload Image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainerUpload}>
        {groundData?.gallery.map((image, index) => (
          <View key={index} style={styles.imageWrapperUpload}>
            <Image source={{ uri: image }} style={styles.imageUpload} />
            <TouchableOpacity onPress={() => handleImageGalleryDelete(index)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {groundData?.gallery.length === 0 && (
        <Text style={styles.errorText}>*Select Gallery Image</Text>
      )}
          </View>
          <View>
          <Text style={styles.label}>Locations</Text>
          <View style={styles.stack}>
        
        <CommonTextInput
          label="State"
          value={startCase(groundData?.state)}
          onChangeText={(value) => handleInputChange('state', value)}
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
          onChangeText={(value) => handleInputChange('city', value)}
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
          onChangeText={(value) => handleInputChange('street_address', value)}
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
          onChangeText={(value) => handleInputChange('pincode', value)}
         // widthStyle={true}
        />
        {!groundData?.pincode && !valData && (
          <Text style={styles.errorText}>*Enter pincode</Text>
        )}
      </View>
</View>
{ (groundID != null) ? 
(<View style={styles.buttonContainerArena}>
        <TouchableOpacity
          style={styles.buttonArena}
          onPress={() => {
            setGroundData(createtempgroundData);
          }}
        >
          <Text style={styles.buttonTextArena}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonArena}
          onPress={() => updateground(groundData)}
        >
          <Text style={styles.buttonTextArena}>Update Arena</Text>
        </TouchableOpacity>
      </View>) : 

    (  <View style={styles.buttonContainerArena}>
        <TouchableOpacity
          style={styles.buttonArena}
          onPress={() => {
            setGroundData(createtempgroundData);
          }}
        >
          <Text style={styles.buttonTextArena}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonArena}
          onPress={() => createground(groundData)}
        >
          <Text style={styles.buttonTextArena}>Add Arena</Text>
        </TouchableOpacity>
      </View> )
}
            </View>
    </ScrollView>
  )
}


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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#1B1B1B',
    marginBottom: 5,
  },
  inputDateView: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.9,
  },
  inputText: {
    fontSize: 16,
    color: '#000',
    
  },
 
  dropdown: {
    backgroundColor: '#FAFAFA',
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownText: {
    color: '#B7B9BF',
    fontSize: 14,
  },
  errorText: {
    fontSize: 13,
    color: 'red',
  },

  /* Upload Image Container */
  uploadContainer: {
    marginBottom: 10,
  },
  uploadButton: {
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    width: Dimensions.get('window').width * 0.9,
   // flexDirection: 'row',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  uploadText: {
    fontSize: 12,
    color: '#707889',
    paddingTop:5
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
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
 
  infoContainer: {
    marginTop: 10,
    color: '#757C8D',
    fontSize: 14,
  },
  
  /* Sports Available */
  itemContainerSports: {
    flex: 1,
    margin: 5,
    padding: 10,
    //borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#F9F9F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSports: {
    width: 52,
    height: 35,
    marginBottom: 10,
  },
  itemTextSports: {
    color: '#192335',
    fontSize: 12,
    fontWeight: '500',
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
    color: '#757C8D',
    fontSize: 16,
    marginLeft: 10, // Space between checkbox and label
  },

  /* Rules Sections */
  itemContainerRule: {
    flexDirection: 'row',
   // alignItems: 'center',
    marginBottom: 10,
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
    width:100,
    alignSelf:'center'
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
    width: '100%',
  },
  buttonArena: {
    backgroundColor: '#192335',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.4, // Adjust width as needed
  },
  buttonTextArena: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default ArenaScreen