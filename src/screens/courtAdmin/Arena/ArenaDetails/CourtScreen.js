import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  Modal,
  Switch,
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {IMAGES} from '../../../../assets/constants/global_images';
import {
  createCourtSlot,
  createNewCourt,
  deleteSlotDetails,
  getCourtsForGround,
  getcourtslotdata,
  getgroundDataById,
  getGroundslotdata,
  updatecourt,
  updateslotdata,
} from '../../../../firebase/firebaseFunction/groundDetails';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import CommonTextInput from '../../../../components/molecules/CommonTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  changeEventStatus,
  createNewBlockEvent,
  getcourtevent,
} from '../../../../firebase/firebaseFunction/eventDetails';
import _ from 'lodash';
import {getTimeFormatted} from '../../../../utils/getHours';
import {formatSlotTime} from '../../../../utils/getSlotTimeFormat.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER, USERLOGIN} from '../../..';
//import Collapsible from 'react-native-collapsible';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Collapsible from 'react-native-collapsible';
import {COLORS} from '../../../../assets/constants/global_colors';
import {Button, Checkbox, RadioButton} from 'react-native-paper';

const CourtScreen = () => {
  const [tab, setTab] = useState('Add Court');
  const [uid, setUid] = useState([]);
  const route = useRoute();
  const {groundID} = route.params || null;
  const navigation = useNavigation();
  //console.log("groundID Views", groundID)
  const [groundData, setGroundData] = useState();
  const [courtTime, setCourtTime] = useState([]);
  //  console.log("courtTime---", courtTime)
  const [eventData, setEventData] = useState([]);
  console.log('eventData values', eventData);
  //const [loader, setLoading] = useState(false);
  const [loader, setLoadingView] = useState(false);
  //console.log("CourtScreeen groundData", groundData)
  const [createCourt, setCreateCourt] = useState({
    gametype: [],
    court_name: '',
    default_amount: '',
  });

  const [editcourtdata, setEditcourtdata] = useState();

  const [selectedValue, setSelectedValue] = useState({
    Courts: '',
    selectedEditslot: '',
  });

  //console.log("selectedValues", selectedValue)
  // const currentDate = new Date().toISOString().split("T")[0];
  const currentDate = new Date();
  const [availablecourt, setAvailablecourt] = useState({
    Courts: '',
    date: null,
  });
  console.log('availablecourt', availablecourt);
  const [basicCourtDetailsOpen, setBasicCourtDetailsOpen] = useState(true);
  const [basicSlotDetailsOpen, setBasicSlotDetailsOpen] = useState(true);
  const [basicAvailableDetailsOpen, setBasicAvailableDetailsOpen] =
    useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [AddCourtError, setAddCourtError] = useState(false);
  const [AddCourtTimingError, setAddCourtTimingError] = useState(false);
  const [SlotmodalOpen, setSlotModalOpen] = useState(false);
  const [CreateSlotWarning, setCreateSlotWarning] = useState(false);
  const [CreateEditSlotWarning, setCreateEditSlotWarning] = useState(false);
  const [updateSlotWarning, setupdateSlotWarning] = useState(false);
  const [courtslot, setCourtslot] = useState();
  const tabs = ['Add Court', 'Add Court Time', 'Available Timings'];
  const [gametype, setgametype] = useState([]);
  //const [blockmodalopen, setblockModalOpen] = useState(false);
  const [blockerrormodalopen, setblockerrorModalOpen] = useState(false);
  const [unblockerrormodalopen, setunblockerrorModalOpen] = useState(false);
  const [unblockmodalopen, setunblockModalOpen] = useState(false);

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

  const [changestatusmodal, setChangestatusmodal] = useState(false);
  const [SlotDelWarning, setSlotDelWarning] = useState(false);
  const [SloteditWarning, setSloteditWarning] = useState(false);
  const [addEdit, setAddEdit] = useState('Add');
  const [selectcourt, setSelectcourt] = useState();
  const [OpenSlotRes, setOpenSlotRes] = useState();
  const [SlotToEdit, setSlotToEdit] = useState();
  const [AnchorEl, setAnchorEl] = useState();
  const [AccordionOpen, setAccordionOpen] = useState(false);
  const [createSlots, setCreateSlots] = useState({
    price: '',
    date: null,
    starttime: '',
    endtime: '',
    isActive: true,
    slotType: '',
    days: [],
  });
  const [selectedOption, setSelectedOption] = useState(createSlots.slotType);
  // console.log("createSlots", createSlots);
  /* Slot Timing States */
  const [openCourtDropdown, setOpenCourtDropdown] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openAvailableDatePicker, setOpenAvailableDatePicker] = useState(false);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [courtItems, setCourtItems] = useState([]);
  //console.log("courtItemsValus", courtItems);
  const [open, setOpen] = useState(false);
  const [openAvailable, setOpenAvailable] = useState(false);
  const [value, setValue] = useState('');
  const [blockmodalopen, setblockModalOpen] = useState(false);
  const [valueAvailable, setValueAvailable] = useState(null);
  const [customDays, setCustomDays] = useState({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });
  const [selectedDays, setSelectedDays] = useState([]);

  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
    {label: 'Pear', value: 'pear'},
    {label: 'Cricket', value: 'w8SLqfDdGeXXnfA74Ckf'},
  ]);

  const toggleCustomCheckbox = day => {
    setCustomDays(prevDays => {
      const newDays = {...prevDays, [day]: !prevDays[day]};
      return newDays;
    });
  };

  useEffect(() => {
    setSelectedOption(createSlots.slotType);
  }, [createSlots.slotType]);

  useEffect(() => {
    const days = Object.keys(customDays).filter(day => customDays[day]);
    setSelectedDays(days);
  }, [customDays]);

  //console.log("valuessssss", value)
  const ITEM_HEIGHT = 40;
  const calculatedHeight = Math.min(
    courtItems.length * ITEM_HEIGHT,
    Dimensions.get('window').height / 1,
  );

  /* UID */
  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('uid');
      //const value = "6Ip56SzHQycRTqwN6nOl7iMZd193";
      //console.log('value', value);
      if (value) {
        //const user = await userData(parsedValue?.user_id);
        setUid(JSON.parse(value));
        //setUid(value)
      }
    } catch (error) {
      console.error('Error retrieving user data', error);
    }
  };
  console.log('uid values', uid);
  useEffect(() => {
    getUserData();
    // getLocation();
  }, []);

  /* GRN DATA FETCH */
  const grndData = async () => {
    if (groundID != null) {
      setLoadingView(true);
      console.log('groundId', groundID);
      let groundres = await getgroundDataById(groundID, 'admin', uid);
      setLoadingView(false);
      setGroundData(groundres);
      setgametype(groundres?.game_type);
      let court_details = await getCourtsForGround(groundID);
      let ground_details = {...groundData, court_details};
      const slotDatas = await getGroundslotdata(ground_details);
      console.log('grndData2:', slotDatas);
      setCourtslot(slotDatas);
      getCourttime(ground_details, currentDate);
    } else {
      console.log('grndData2', 'check2 ');
    }
  };

  useEffect(() => {
    grndData();
  }, [uid]);

  //Update the CreatedAt Value in CreateSlots State values
  useEffect(() => {
    if (createSlots?.createdAt) {
      const formattedCreatedAt = new Date(createSlots?.createdAt);
      setCreateSlots(prevSlots => ({
        ...prevSlots,
        date: formattedCreatedAt,
      }));
    }
  }, [createSlots?.createdAt]);

  /* Choose The Game Options */
  const handleGameclick = value => {
    let availablegame = createCourt?.gametype;
    if (availablegame?.includes(value)) {
      let subarr = availablegame.filter(item => item != value);
      setCreateCourt({...createCourt, gametype: subarr});
      // console.log(subarr, "availablegame");
    } else {
      setCreateCourt(prevData => ({
        ...prevData,
        gametype: [...(prevData.gametype || []), value],
      }));
      // console.log(availablegame, "availablegame");
    }
  };

  /* Handle Add Cart Game Sections */
  const handleAddCourt = async () => {
    // setLoadingView(true);
    console.log('Hi One');
    if (
      createCourt.court_name == '' ||
      createCourt.default_amount == '' ||
      createCourt.gametype.length == 0
    ) {
      setAddCourtError(true);
    } else {
      // console.log("Hi Two")
      setModalOpen(true);
      setAddCourtError(false);
    }
  };

  const handleAddCourtSlot = async () => {
    if (
      !selectedValue?.Courts ||
      !createSlots?.price ||
      !createSlots?.slotType
      // !createSlots?.date ||
      // !createSlots?.starttime ||
      // !createSlots?.endtime
    ) {
      setAddCourtTimingError(true);
      ToastAndroid.showWithGravity(
        'Please fill in all the required fields.',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      return;
    } else {
      if (createSlots?.slotType === 'customDate' && !createSlots?.date) {
        setAddCourtTimingError(true);
        ToastAndroid.showWithGravity(
          'Please update the Custom Date Fields',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        return;
      } else if (
        createSlots?.slotType === 'customDays' &&
        selectedDays.length === 0
      ) {
        setAddCourtTimingError(true);
        ToastAndroid.showWithGravity(
          'Please update the Custom Days',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        return;
      } else {
        if (
          createSlots?.slotType === 'customDays'
          // createSlots?.slotType === 'weekday' ||
          // createSlots?.slotType === 'weekend'
        ) {
          const result = Object.values(courtslot).map(item => {
            let sortslotdata = item?.slotData?.sort(compareByDate);
            let activeSlotData = sortslotdata?.filter(item => item?.isActive);
            // console.log('Iten12: ', activeSlotData);
            // console.log(
            //   'ItenData12: ',
            //   activeSlotData.some(
            //     slot =>
            //       slot.slotType === 'weekday' || slot.slotType === 'weekend',
            //   ),
            // );
            // Check if createSlots.slotType matches any activeSlotData.slotType
            return activeSlotData.some(
              slot =>
                slot.slotType === 'weekday' || slot.slotType === 'weekend',
            );
          });
          const checkSlotType = result.includes(true);
          if (checkSlotType) {
            setCreateSlotWarning(true);
          } else {
            setSlotModalOpen(true);
            setAddCourtTimingError(false);
          }
        } else {
          const selectedDateStr = createSlots.date;
          const currentDate = new Date();
          const currentDateStr = currentDate.toISOString().split('T')[0];

          if (selectedDateStr === currentDateStr) {
            ToastAndroid.showWithGravity(
              'Please select a future date.',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
            return;
            // }
            // const startT = `${createSlots.date}T${createSlots.starttime}`;
            // const endT = `${createSlots.date}T${createSlots.endtime}`;

            // const newStartTime = new Date(startT);
            // const newEndTime = new Date(endT);
            // const currentDateTime = new Date();
            // if (
            //   newStartTime > newEndTime ||
            //   newStartTime < currentDateTime ||
            //   newEndTime < currentDateTime
            // ) {
            //   ToastAndroid.showWithGravity(
            //     'Past time is not allowed',
            //     ToastAndroid.LONG,
            //     ToastAndroid.CENTER,
            //   );
            //   return;
          } else {
            const courtDataBySlot = await getcourtevent(selectedValue?.Courts);
            if (courtDataBySlot.length != 0) {
              // const isExist = courtDataBySlot.filter(item => {
              //   console.log('Elam', item);
              //   return (
              //     (new Date(item.start) < newStartTime &&
              //       new Date(item.end) < newStartTime) == false &&
              //     (new Date(item.start) > newEndTime &&
              //       new Date(item.end) > newEndTime) == false
              //   );
              // });
              const isExist = courtDataBySlot.filter(item => {
                const itemStartDateStr = item.start.split('T')[0];
                const itemEndDateStr = item.end.split('T')[0];

                return (
                  itemStartDateStr === selectedDateStr ||
                  itemEndDateStr === selectedDateStr
                );
              });
              if (!isExist.length) {
                setSlotModalOpen(true);
                setAddCourtTimingError(false);
              } else {
                setCreateEditSlotWarning(true);
              }
            } else {
              setSlotModalOpen(true);
              setAddCourtTimingError(false);
            }
          }
        }
      }
    }
  };

  /* Create Court Confirmation Function */
  const handleCreateCourt = async () => {
    if (editcourtdata != null && Object.keys(editcourtdata).length != 0) {
      editcourtdata.court_name = createCourt.court_name;
      editcourtdata.default_amount = createCourt.default_amount;
      editcourtdata.gametype = createCourt.gametype;

      //  console.log(editcourtdata?.court_id, editcourtdata, "gtre43");
      //setLoading(true);
      setLoadingView(true);
      // await updatecourt(editcourtdata, editcourtdata?.court_id);
      try {
        await updatecourt(editcourtdata, editcourtdata?.court_id);
        ToastAndroid.showWithGravity(
          'Court updated successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } catch (error) {
        ToastAndroid.showWithGravity(
          'Failed to update the court. Please try again.',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      } finally {
        setLoadingView(false);
      }
      //setLoading(false);
    } else {
      //setLoading(true);
      setLoadingView(true);
      //await createNewCourt(groundID, createCourt);
      try {
        await createNewCourt(groundID, createCourt);
        ToastAndroid.showWithGravity(
          'Court created successfully!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } catch (error) {
        ToastAndroid.showWithGravity(
          'Failed to create the court. Please try again.',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      } finally {
        setLoadingView(false);
      }
      //setLoading(false);
      // setCreateCourt({
      //   gametype: [],
      //   court_name: "",
      //   default_amount: "",
      // });
    }
    setCreateCourt({
      gametype: [],
      court_name: '',
      default_amount: '',
    });
    grndData();
    setModalOpen(false);
  };

  /* Handle Switch Change Court Status Funtions */

  const handlemodal = async props => {
    //  console.log(props, "4", "gtr55");
    // console.log(props, "gtr55");
    setSelectcourt(props);
    setChangestatusmodal(true);
  };

  const handleswitchChange = async () => {
    //    console.log(selectcourt);
    selectcourt.isactive = selectcourt?.isactive ? false : true;
    //setLoading(true);
    setLoadingView(true);
    await updatecourt(selectcourt, selectcourt?.court_id);
    setLoadingView(false);
    //setLoading(false);
    ToastAndroid.showWithGravity(
      'Court Status Changed successfully!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
    grndData();
    setChangestatusmodal(false);
  };

  /* Handle Court Status Items Edit and Update Function */
  const handleEditCourt = async item => {
    //  console.log("gtre332", item);
    setAddEdit('Update');
    setEditcourtdata(item);
    setCreateCourt({
      gametype: item?.gametype,
      court_name: item?.court_name,
      default_amount: item?.default_amount,
    });
    //handleChange("Add Court");
  };

  const IOSSwitch = props => {
    const {colors} = useTheme();
    return (
      <Switch
        trackColor={{false: '#000', true: 'green'}}
        thumbColor={props.value ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        {...props}
      />
    );
  };

  /* Add Time Slot  */
  // const handleCourtChange = async (value) => {
  // // console.log("value handleCourtChange", value);
  // //   setSelectedValue((prev) => ({ ...prev, Courts: value }));
  // console.log("Selected value in handleCourtChange:", value);

  // // Ensure `value` is a string or the appropriate value type
  // if (typeof value === 'string' || typeof value === 'number') {
  //   setSelectedValue(prev => ({ ...prev, Courts: value }));
  // } else {
  //   console.warn('Unexpected value type:', value);
  // }
  // };

  const formatDateValues = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = async value => {
    //console.log("value", value);
    //  value = value.target.value;
    // console.log("value123", value);
    const today = new Date();
    const selectedDate = new Date(value);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < today.getTime()) {
      alert('Please select a future date.');
    } else {
      // setCreateslots({ ...createSlots, date: value });
      const formattedDate = formatDateValues(value);
      setCreateSlots(prevSlots => ({
        ...prevSlots,
        date: formattedDate,
      }));
    }
  };

  // const handleTimeChange = (type, date) => {
  //   if (
  //     createSlots.date.toDateString() === new Date().toDateString() &&
  //     date.getHours() < new Date().getHours()
  //   ) {
  //     Alert.alert('Past time is not allowed');
  //   } else {
  //     setCreateSlots({
  //       ...createSlots,
  //       [type]: date,
  //     });
  //   }
  // };

  // const formatTimeSlot = (date) => {
  //   return date.toLocaleTimeString('en-GB', {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };

  const formatTime = date => {
    if (!date) return 'Select Time';
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  /* Got the DropDown Value Of Court Slot */
  useEffect(() => {
    if (groundData?.court_details) {
      //  console.log("groundData?.court_details", groundData?.court_details)
      const items = groundData?.court_details.map((court, index) => ({
        id: index + 1,
        value: court?.court_id,
        label: court?.court_name,
        gameType: court?.gametype,
      }));
      setCourtItems(items);
    }
  }, [groundData]);

  useEffect(() => {
    // Update selectedValue.Courts when value changes
    if (value !== null) {
      setSelectedValue(prev => ({
        ...prev,
        Courts: value,
      }));
    }
    // else if(valueAvailable !== null){
    //   //console.log("valueAvailable",valueAvailable)
    //   setAvailablecourt((prev) => ({
    //     ...prev,
    //     Courts: valueAvailable,
    //   }));
    //   handleavailablecourt(valueAvailable);
    // }
  }, [value]);

  useEffect(() => {
    if (valueAvailable !== null) {
      console.log('valueAvailable', valueAvailable);
      setAvailablecourt(prev => ({
        ...prev,
        Courts: valueAvailable,
      }));
      // handleavailablecourt(valueAvailable);
    }
  }, [valueAvailable]);

  useEffect(() => {
    if (availablecourt?.Courts !== null) {
      // console.log('availablecourt?.Courts', availablecourt?.Courts);
      //  setAvailablecourt((prev) => ({
      //    ...prev,
      //    Courts: valueAvailable,
      //  }));
      handleavailablecourt(availablecourt?.Courts);
    }
  }, [availablecourt?.Courts]);
  // console.log('availablecourt?.Courts----', availablecourt?.Courts);
  //console.log("availableCourts", availablecourt, valueAvailable)

  /* Add Funciton of SLot */

  const handleCourtslot = async () => {
    createSlots.slotType = createSlots.slotType;
    if (createSlots.slotType != 'customDate') {
      createSlots.start = groundData.start_time;
      createSlots.end = groundData.end_time;
    } else {
      createSlots.start = `${createSlots?.date}T${groundData.start_time}`;
      createSlots.end = `${createSlots?.date}T${groundData.end_time}`;
    }

    if (createSlots.slotType == 'customDays') {
      createSlots.days = selectedDays;
    } else {
      createSlots.days = [];
    }

    createSlots.court_id = selectedValue?.Courts;

    if (
      selectedValue?.selectedEditslot == '' ||
      selectedValue?.selectedEditslot == undefined
    ) {
      //setLoading(true);
      console.log('SlotFB', selectedValue?.Courts, createSlots);

      setLoadingView(true);
      const data = await createCourtSlot(selectedValue?.Courts, createSlots);
      console.log('data---13', data);
      //setLoading(false);
      setLoadingView(false);
      if (
        data?.data ==
        'Slot overlaps with existing slots. Choose a different time.'
      ) {
        setCreateSlotWarning(true);
        ToastAndroid.showWithGravity(
          'Slot overlaps with existing slots. Choose a different time.',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      } else {
        setCreateSlotWarning(false);
        ToastAndroid.showWithGravity(
          'Slot created successfully!',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    } else {
      //setLoading(true);
      setLoadingView(true);
      const update = await updateslotdata(
        selectedValue?.selectedEditslot,
        createSlots,
      );
      //setLoading(false);
      setLoadingView(false);
      if (update.status == 'failure') {
        setupdateSlotWarning(true);
        ToastAndroid.showWithGravity(
          'Failed to update the slot. Please try again.',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      } else {
        setupdateSlotWarning(false);
        ToastAndroid.showWithGravity(
          'Slot updated successfully!',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      }
    }

    setCreateSlots({
      price: '',
      date: null,
      starttime: '',
      endtime: '',
      slotType: '',
      isActive: true,
    });
    setValue(null);
    setAddEdit('Add');
    setSelectedValue({...selectedValue, Courts: '', selectedEditslot: ''});
    grndData();
    console.log('End Game');
    setSlotModalOpen(false);
  };

  /* Available Timing Sections */
  const handleavailablecourt = async value => {
    // setAvailablecourt({ ...availablecourt, Courts: value });
    // console.log("data HandleAvailCOurt123", !_.isEmpty(availablecourt.date) && !_.isEmpty(value))
    console.log('Hi');
    console.log('data value given', value);
    console.log(
      '!_.isEmpty(availablecourt.date) && !_.isEmpty(value)',
      !_.isEmpty(availablecourt.date) && !_.isEmpty(value),
    );
    if (_.isEmpty(availablecourt.date) && !_.isEmpty(value)) {
      setAccordionOpen(true);
      //setLoading(true);
      const data = await getcourtevent(value);
      console.log('data HandleAvailCOurt', data);
      //setLoading(false);
      setEventData(data);
    } else {
      setEventData([]);
      setAccordionOpen(false);
      //setLoading(false);
    }
  };

  const handleavialbleDateChange = async value => {
    //value = value.target.value;
    //console.log("HI")
    const today = new Date();
    const selectedDate = new Date(value);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    //   console.log("HI12", selectedDate)
    if (selectedDate.getTime() < today.getTime()) {
      //   console.log("HI1223", selectedDate.getTime())
      alert('Please select a future date.');
    } else {
      const formattedDate = formatDateValues(value);
      //console.log("formattedDate", formattedDate, availablecourt.Courts, value)
      if (_.isEmpty(availablecourt.Courts)) {
        //alert("Please select a court before choosing a date.");
        ToastAndroid.showWithGravity(
          'Please select a available court before choosing a date.',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        return; // Stop further execution if no court is selected
      }
      // console.log(
      //   'New Values',
      //   !_.isEmpty(formattedDate) && !_.isEmpty(availablecourt.Courts),
      // );
      if (!_.isEmpty(formattedDate) && !_.isEmpty(availablecourt.Courts)) {
        //console.log("HI123", availablecourt)
        setAccordionOpen(true);
        //setLoading(true);

        setAvailablecourt(prevSlots => ({
          ...prevSlots,
          date: formattedDate,
        }));
        // setAvailablecourt({ ...availablecourt, date: value });
        //console.log('eventss', groundData, value)
        getCourttime(groundData, formattedDate);
        //setLoading(false);
      } else {
        setEventData([]);
        setAccordionOpen(false);
        //setLoading(false);
      }
    }
  };

  //   const getCourttime = (groundData, date) => {
  //     let start;
  //     let end;
  // console.log("groundData Data111", groundData, typeof date, date, "eventss")
  //     if (typeof date === "object") {
  //       start = `${date.getFullYear()}-${(date.getMonth() + 1)
  //         .toString()
  //         .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${
  //         groundData?.start_time
  //       }`;
  //       end = `${date.getFullYear()}-${(date.getMonth() + 1)
  //         .toString()
  //         .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${
  //         groundData?.end_time
  //       }`;
  //     } else {
  //       start = `${date}T${groundData?.start_time}`;
  //       end = `${date}T${groundData?.end_time}`;
  //     }

  //     let daystart = new Date(start);
  //     let dayend = new Date(end);

  //     let hourdiff = ((dayend - daystart) / (1000 * 60 * 60)).toFixed(1);
  // //console.log("days hourdiff", daystart, dayend, hourdiff, 'eventss')
  //     let eventss = [];
  //     let starttime = daystart;

  //     for (let j = 0; j < hourdiff; j++) {
  //       let en;

  //       en = {
  //         backgroundColor: "#fff",
  //         bordercolor: "#339A49",
  //         textColor: "#339A49",
  //         zIndex: "1",
  //         selected: false,
  //         isbooked: false,
  //         isblocked: false,
  //       };
  //       en.start = new Date(starttime.getTime() + 1);
  //       en.end = new Date(starttime.getTime() + 60 * 60 * 1000);
  //       eventss.push(en);
  // console.log("eventss", en, 'Hi')
  //       starttime = new Date(en.end.getTime() + 1);
  //     }
  //     eventss?.map(
  //       (court) =>
  //         eventData.length &&
  //         eventData?.map((event) => {
  //           let date1 = new Date(event?.start);
  //           let date2 = new Date(court?.start);
  //           if (
  //             Math.abs(date1.getTime() - date2.getTime()) <= 1000 &&
  //             event.status == "Blocked"
  //           ) {
  //             court.isblocked = true;
  //             court.backgroundColor = "#EEF0F3";
  //             court.textColor = "#ff0000";
  //             court.bordercolor = "#ff0000";
  //           } else if (
  //             Math.abs(date1.getTime() - date2.getTime()) <= 1000 &&
  //             event.status != "Canceled" &&
  //             event.status != "Cancelled" &&
  //             event.status != "Unblocked"
  //           ) {
  //             court.isbooked = true;
  //             court.backgroundColor = "#EEF0F3";
  //             court.textColor = "#64627C";
  //             court.bordercolor = "#64627C";
  //           }
  //         })
  //     );
  //     let eventarr = eventss.map((element, index) => {
  //       if (
  //         new Date(element.start).getHours() == new Date().getHours() &&
  //         new Date(element.start).getDate() == new Date().getDate()
  //       ) {
  //         element = {
  //           ...element,

  //           color: "#FFF",
  //           backgroundColor: "#FFF",
  //           bordercolor: "#00b4d8",
  //           textColor: "#00b4d8",
  //         };

  //         return element;
  //       } else {
  //         return element;
  //       }
  //     });
  //     console.log("eventss", eventarr)

  //     setCourtTime(eventarr);
  //   };

  const getCourttime = (groundData, date) => {
    let start;
    let end;

    if (typeof date === 'object') {
      start = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${
        groundData?.start_time
      }`;
      end = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${
        groundData?.end_time
      }`;
    } else {
      start = `${date}T${groundData?.start_time}`;
      end = `${date}T${groundData?.end_time}`;
    }

    let daystart = new Date(start);
    let dayend = new Date(end);

    let hourdiff = ((dayend - daystart) / (1000 * 60 * 60)).toFixed(1);

    let eventss = [];
    let starttime = daystart;

    for (let j = 0; j < hourdiff; j++) {
      let en = {
        backgroundColor: '#fff',
        bordercolor: '#339A49',
        textColor: '#339A49',
        zIndex: '1',
        selected: false,
        isbooked: false,
        isblocked: false,
      };

      en.start = new Date(starttime);
      en.end = new Date(starttime.getTime() + 60 * 60 * 1000); // 1 hour later

      eventss.push(en);

      starttime = new Date(en.end.getTime() + 1);
    }

    eventss.map(court => {
      eventData.map(event => {
        let date1 = new Date(event?.start);
        let date2 = new Date(court?.start);
        if (
          Math.abs(date1.getTime() - date2.getTime()) <= 1000 &&
          event.status === 'Blocked'
        ) {
          court.isblocked = true;
          court.backgroundColor = '#EEF0F3';
          court.textColor = '#ff0000';
          court.bordercolor = '#ff0000';
        } else if (
          Math.abs(date1.getTime() - date2.getTime()) <= 1000 &&
          event.status !== 'Canceled' &&
          event.status !== 'Cancelled' &&
          event.status !== 'Unblocked'
        ) {
          court.isbooked = true;
          court.backgroundColor = '#EEF0F3';
          court.textColor = '#64627C';
          court.bordercolor = '#64627C';
        }
      });
    });

    let eventarr = eventss.map(element => {
      if (
        new Date(element.start).getHours() === new Date().getHours() &&
        new Date(element.start).getDate() === new Date().getDate()
      ) {
        element = {
          ...element,
          color: '#FFF',
          backgroundColor: '#FFF',
          bordercolor: '#00b4d8',
          textColor: '#00b4d8',
        };
        return element;
      } else {
        return element;
      }

      // Convert start and end to the required format
      // element.start = element.start.toString();
      // element.end = element.end.toString();
    });

    //console.log("eventss", eventarr);

    setCourtTime(eventarr);
  };

  const handlebooking = (value, index) => {
    const updatedCourtTime = [...courtTime];
    console.log('value, index', value, index);
    const currentTime = new Date();
    const currentTimehour = new Date().getHours();
    if (value.start <= new Date().getHours()) {
      alert('This booking time has already passed.');
      return;
    } else {
      if (value.isblocked) {
        updatedCourtTime[index] = {
          ...updatedCourtTime[index],
          mapIndex: index,
          selected: !updatedCourtTime[index].selected,
          color: !updatedCourtTime[index].selected ? '#FFF' : '#ff0000',
          bordercolor: !updatedCourtTime[index].selected
            ? '#339A49'
            : '#ff0000',
          backgroundColor: !updatedCourtTime[index].selected
            ? '#339A49'
            : '#EEF0F3',
          textColor: !updatedCourtTime[index].selected ? '#FFF' : '#ff0000',
        };
      } else {
        updatedCourtTime[index] = {
          ...updatedCourtTime[index],
          mapIndex: index,
          selected: !updatedCourtTime[index].selected,
          color: !updatedCourtTime[index].selected ? '#FFF' : '#339A49',
          bordercolor: !updatedCourtTime[index].selected
            ? '#339A49'
            : '#339A49',
          backgroundColor: !updatedCourtTime[index].selected
            ? '#339A49'
            : '#FFF',
          textColor: !updatedCourtTime[index].selected ? '#FFF' : '#339A49',
        };
      }
      console.log('updatedCourtTime', updatedCourtTime);
      setCourtTime(updatedCourtTime);
    }
  };

  const handleblock = async () => {
    console.log('bbb');
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }
    setLoadingView(true);
    let data = courtTime?.filter(item => item?.selected == true);
    if (
      availablecourt?.Courts != '' &&
      availablecourt?.date != '' &&
      data.length != 0
    ) {
      availablecourt.selectedSlot = data;
      let Addcartdatas = [];
      const courtDetails = groundData?.court_details?.filter(
        item => item.court_id == availablecourt?.Courts,
      );
      availablecourt.courtDetails = courtDetails;
      let courtNo;
      // console.log("availablecourt- COurtDetails",courtDetails, availablecourt)
      if (typeof availablecourt?.Courts.match(/\d+/g) == null) {
        courtNo = availablecourt?.Courts.match(/\d+/g).join('');
      } else {
        courtNo = stringToAlphabetPositions(availablecourt?.Courts.slice(0, 5));
      }
      console.log('courtNo', courtNo);
      let courtslot = await getcourtslotdata(availablecourt?.Courts, 'user');

      data.forEach(slot => {
        let cartItem = {
          court_id: availablecourt?.Courts,
          court_name: courtDetails[0]?.court_name,
          ground_id: courtDetails[0]?.ground_id,
          user_id: uid,
          // amount: courtDetails[0]?.default_amount,
          start: `${availablecourt?.date}T${new Date(
            slot.start,
          ).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}`,
          end: `${availablecourt?.date}T${new Date(slot.end).toLocaleTimeString(
            'en-US',
            {hour: '2-digit', minute: '2-digit', hour12: false},
          )}`,
        };
        let currentslot = courtslot?.slotData?.find(item => {
          return (
            (new Date(item.start) < new Date(cartItem.start) &&
              new Date(item.end) < new Date(cartItem.start)) == false &&
            (new Date(item.start) > new Date(cartItem.end) &&
              new Date(item.end) > new Date(cartItem.end)) == false
          );
        });
        if (currentslot) {
          cartItem.amount = currentslot.price;
        }

        Addcartdatas.push(cartItem);
      });
      let bookedDataList = [];
      const promises = Addcartdatas.map(async item => {
        let dat = await getcourtevent(item.court_id);
        let bookedData = dat?.filter(data => data?.start === item.start);

        return bookedData;
      });
      const results = await Promise.all(promises);
      bookedDataList = results.flat();
      //console.log("results", results)
      const response = await createNewBlockEvent(Addcartdatas);
      console.log('response handle Booking', response);
      setLoadingView(false);
      if (response?.status == 'Success') {
        setblockModalOpen(false);
        handleReset();
        ToastAndroid.showWithGravity(
          'Slot Blocked successfully!',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        // ToastAndroid.show("Blocking Success");

        grndData();
        //setblockModalOpen(false);
      } else {
        // toast.error("Blocking Failed", {
        //   position: "top-right",
        //   autoClose: 2000,
        // });
        ToastAndroid.showWithGravity(
          'Slot Blocked Failed!',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        console.error('book fail');
      }
      // }
    }
  };

  const handleblockmodal = () => {
    console.log('vvv');
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }
    let data = courtTime?.filter(item => item?.selected == true);
    let blockeddata = data?.filter(item => item?.isblocked == true);

    if (
      availablecourt?.Courts != 'Select court' &&
      availablecourt?.date != '' &&
      // availablecourt?.gameType != "Select game" &&
      data.length != 0
    ) {
      if (blockeddata?.length) {
        setblockerrorModalOpen(true);
      } else {
        setblockModalOpen(true);
      }
    } else {
      console.error('select appropriate values');
    }
  };

  const handleunblockmodal = () => {
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }

    let data = courtTime?.filter(item => item?.selected == true);
    let unblockeddata = data?.filter(item => item?.isblocked == false);

    if (
      availablecourt?.Courts != 'Select court' &&
      availablecourt?.date != '' &&
      // availablecourt?.gameType != "Select game" &&
      data.length != 0
    ) {
      if (unblockeddata?.length) {
        setunblockerrorModalOpen(true);
      } else {
        setunblockModalOpen(true);
      }
    } else {
      console.error('select appropriate values');
    }
  };

  const handleUnblock = async () => {
    console.log('jjj');
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }
    setLoadingView(true);
    let data = courtTime?.filter(item => item?.selected == true);
    if (
      availablecourt?.Courts != '' &&
      availablecourt?.date != '' &&
      data.length != 0
    ) {
      availablecourt.selectedSlot = data;
      let Addcartdatas = [];
      const courtDetails = groundData?.court_details?.filter(
        item => item.court_id == availablecourt?.Courts,
      );
      availablecourt.courtDetails = courtDetails;
      let courtNo;
      if (typeof availablecourt?.Courts.match(/\d+/g) == null) {
        courtNo = availablecourt?.Courts.match(/\d+/g).join('');
      } else {
        courtNo = stringToAlphabetPositions(availablecourt?.Courts.slice(0, 5));
      }
      let courtslot = await getcourtslotdata(availablecourt?.Courts, 'user');

      data.forEach(slot => {
        let cartItem = {
          court_id: availablecourt?.Courts.value,
          court_name: courtDetails[0]?.court_name,
          ground_id: courtDetails[0]?.ground_id,
          user_id: uid,
          // amount: courtDetails[0]?.default_amount,
          start: `${availablecourt?.date}T${new Date(
            slot.start,
          ).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}`,
          end: `${availablecourt?.date}T${new Date(slot.end).toLocaleTimeString(
            'en-US',
            {hour: '2-digit', minute: '2-digit', hour12: false},
          )}`,
        };
        let currentslot = courtslot?.slotData?.find(item => {
          return (
            (new Date(item.start) < new Date(cartItem.start) &&
              new Date(item.end) < new Date(cartItem.start)) == false &&
            (new Date(item.start) > new Date(cartItem.end) &&
              new Date(item.end) > new Date(cartItem.end)) == false
          );
        });
        if (currentslot) {
          cartItem.amount = currentslot.price;
        }

        Addcartdatas.push(cartItem);
      });

      let bookedDataList = [];
      const promises = Addcartdatas.map(async item => {
        let dat = await getcourtevent(item.court_id);
        let bookedData = dat?.filter(data => data?.start === item.start);

        return bookedData;
      });
      const results = await Promise.all(promises);
      bookedDataList = results.flat();

      const mapcosnt = bookedDataList.map(async datum => {
        await changeEventStatus(datum?.event_id, 'Unblocked');
      });
      console.log('mapcosnt', mapcosnt);

      if (mapcosnt?.length) {
        setunblockModalOpen(false);
        handleReset();
        setLoadingView(false);
        // toast.success("Unblocking Success", {
        //   position: "top-right",
        //   autoClose: 2000,
        // });
        ToastAndroid.showWithGravity(
          'Slot Unblocked successfully!',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        grndData();
        //  setunblockModalOpen(false);
      } else {
        // toast.error("Unblocking Failed", {
        //   position: "top-right",
        //   autoClose: 2000,
        // });
        setunblockModalOpen(false);
        ToastAndroid.showWithGravity(
          'Slot Unblocked Failed!',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        console.error('Unblocking fail');
      }
      // }
    }
  };

  const handleReset = () => {
    setAvailablecourt({
      Courts: '',
      date: null,
    });
    setValueAvailable(null);
    setAccordionOpen(false);
    setCourtTime([]);
  };

  /* Update The Slots */
  const handleSlotedit = async value => {
    console.log('value one', value);

    // Check for required fields
    if (!value.court_id || !value.price || !value.slotType) {
      ToastAndroid.showWithGravity(
        'Please fill in all the required fields.',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
      return;
    }

    // Format start and end times
    const startTime = new Date(`1970-01-01T${value.start}:00`);
    const endTime = new Date(`1970-01-01T${value.end}:00`);

    // Check slot type and handle accordingly
    if (value.slotType === 'customDays') {
      if (!value.days || value.days.length === 0) {
        ToastAndroid.showWithGravity(
          'Please select the custom days.',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        return;
      }
    }

    // Fetch existing slots for the court
    const courtDataBySlot = await getcourtevent(value.court_id);

    if (courtDataBySlot.length !== 0) {
      const isExist = courtDataBySlot.filter(item => {
        const itemStartTime = new Date(item.start);
        const itemEndTime = new Date(item.end);
        return (
          (itemStartTime < startTime && itemEndTime < startTime) === false &&
          (itemStartTime > endTime && itemEndTime > endTime) === false
        );
      });

      // If no overlaps exist
      if (!isExist.length) {
        setAddEdit('Update');

        let court_value = courtItems?.filter(
          item => item.value === value.court_id,
        );

        setSelectedValue({
          ...selectedValue,
          selectedEditslot: value.slot_id,
          Courts: court_value[0].value,
        });

        setCreateSlots({
          date: value.date || '', // Make sure to set date if applicable
          starttime: value.start,
          endtime: value.end,
          price: value.price,
          isActive: value.isActive,
          days: value.days, // Include the days array
        });

        setAnchorEl(null);
      } else {
        setSloteditWarning(true);
      }
    } else {
      // If no existing slots, proceed with the update
      setAddEdit('Update');

      let court_value = courtItems?.filter(
        item => item.value === value.court_id,
      );

      setSelectedValue({
        ...selectedValue,
        selectedEditslot: value.slot_id,
        Courts: court_value[0].value,
      });

      setCreateSlots({
        date: value.date || '', // Make sure to set date if applicable
        starttime: value.start,
        endtime: value.end,
        price: value.price,
        isActive: value.isActive,
        days: value.days, // Include the days array
      });

      setAnchorEl(null);
    }
  };

  // const handleSlotedit = async value => {
  //   console.log('value one', value);
  //   //setLoading(true);
  //   const courtDataBySlot = await getcourtevent(value.court_id);
  //   //setLoading(false);
  //   if (courtDataBySlot.length != 0) {
  //     const newStartTime = new Date(value.start);
  //     const newEndTime = new Date(value.end);
  //     const isExist = courtDataBySlot.filter(item => {
  //       return (
  //         (new Date(item.start) < newStartTime &&
  //           new Date(item.end) < newStartTime) == false &&
  //         (new Date(item.start) > newEndTime &&
  //           new Date(item.end) > newEndTime) == false
  //       );
  //     });

  //     if (!isExist.length) {
  //       setAddEdit('Update');
  //       value.start = formatDateToISO(value.start);
  //       value.end = formatDateToISO(value.end);

  //       let court_value = courtItems?.filter(
  //         item => item.value == value?.court_id,
  //       );
  //       console.log('court_value123', court_value);
  //       setSelectedValue({
  //         ...selectedValue,
  //         selectedEditslot: value?.slot_id,
  //         Courts: court_value[0].value,
  //       });
  //       setValue(court_value[0].value);
  //       setCreateSlots({
  //         date: value?.start.slice(0, 10),
  //         starttime: value?.start?.slice(11, 16),
  //         endtime: value?.end?.slice(11, 16),
  //         price: value?.price,
  //         isActive: value?.isActive,
  //       });
  //       setAnchorEl(null);

  //       //handleChange("Slots");
  //     } else {
  //       setSloteditWarning(true);
  //     }
  //   } else {
  //     setAddEdit('Update');
  //     value.start = formatDateToISO(value.start);
  //     value.end = formatDateToISO(value.end);

  //     let court_value = courtItems?.filter(
  //       item => item.value == value?.court_id,
  //     );
  //     console.log('court_value', court_value);
  //     setSelectedValue({
  //       ...selectedValue,
  //       selectedEditslot: value?.slot_id,
  //       Courts: court_value[0].value,
  //     });
  //     setValue(court_value[0].value);
  //     setCreateSlots({
  //       date: value?.start.slice(0, 10),
  //       starttime: value?.start?.slice(11, 16),
  //       endtime: value?.end?.slice(11, 16),
  //       price: value?.price,
  //       isActive: value?.isActive,
  //     });
  //     setAnchorEl(null);

  //     //      handleChange("Slots");
  //   }
  // };

  const handleSlotdelete = async value => {
    //setLoading(true);
    setLoadingView(true);
    const delSlot = await deleteSlotDetails(value);
    setLoadingView(false);
    //setLoading(false);
    console.log('delSlot', delSlot);
    if (delSlot == 'deleted') {
      ToastAndroid.showWithGravity(
        'Slot deleted successfully!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      grndData();
    } else {
      setSlotDelWarning(true);
      ToastAndroid.showWithGravity(
        'Failed to delete the slot. Please try again.',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  };

  function formatDateToISO(inputDate) {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function charToAlphabetPosition(char) {
    // Convert a single character to its alphabetical position
    return char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  }

  function stringToAlphabetPositions(inputString) {
    // Convert the string to lowercase and split into individual characters
    inputString = inputString.toLowerCase();

    // Convert each character to its alphabetical position and concatenate them
    let result = '';
    for (let i = 0; i < inputString.length; i++) {
      if (inputString[i].match(/[a-z]/)) {
        result += charToAlphabetPosition(inputString[i]);
      }
    }
    return Number(result);
  }

  const [activeSections, setActiveSections] = useState({});

  const compareByDate = (a, b) => new Date(a.start) - new Date(a.start);

  const toggleSection = index => {
    setActiveSections(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const CourtCard = ({item, handlemodal, handleEditCourt}) => {
    const {colors} = useTheme();

    return (
      <View style={[styles.cardCourtCard, {backgroundColor: colors.card}]}>
        <View style={styles.rowCourtCard}>
          <View>
            <Text style={styles.courtNameCourtCard}>{item.court_name}</Text>
            <View style={styles.gameTypeContainer}>
              <Text style={styles.gameTypeCourtCard}>
                {item.gametype.join(' | ')}
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={() => handleEditCourt(item)}>
              <Feather name="edit" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.rowCourtCard, {paddingTop: 40}]}>
          <Text style={styles.priceCourtCard}>INR {item.default_amount}</Text>
          <View style={styles.rowCourtCard}>
            <Text style={styles.blockCourtTextCourtCard}>Block Court</Text>
            <IOSSwitch
              value={!item.isactive}
              onValueChange={() => handlemodal(item)}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderItemGame = ({item}) => (
    <View style={styles.itemContainerGame}>
      <TouchableOpacity onPress={() => handleGameclick(item)}>
        <Image style={styles.imageGame} source={iconsss[item]} />
        <Text style={styles.textGame}>{item.replace('_', ' ')}</Text>
        {createCourt?.gametype?.includes(item) && (
          <Ionicons
            style={styles.tickIconSports}
            name="checkmark-circle"
            size={15}
            color="#4CA181"
          />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {loader ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size={50}
            color={COLORS.PrimaryColor}
            animating={loader}
          />
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.container}>
            <TouchableOpacity
              style={[
                styles.accordionHeader,
                !basicCourtDetailsOpen
                  ? styles.openHeader
                  : styles.closedHeader,
              ]}
              onPress={() => setBasicCourtDetailsOpen(!basicCourtDetailsOpen)}
              activeOpacity={1}>
              <Text style={styles.accordionHeaderText}>Manage Courts</Text>
              <Ionicons
                name={!basicCourtDetailsOpen ? 'chevron-up' : 'chevron-down'}
                size={24}
              />
            </TouchableOpacity>

            <Collapsible collapsed={basicCourtDetailsOpen}>
              <View
                style={{
                  backgroundColor: '#fff',
                  paddingHorizontal: 15,
                  borderBottomRightRadius: 12,
                  borderBottomLeftRadius: 12,
                }}>
                <View style={styles.horizontalBar} />
                <View
                  style={{
                    zIndex: 2000,
                    padding: 10,
                    backgroundColor: COLORS.fieldColor,
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  }}>
                  <View>
                    <FlatList
                      data={gametype}
                      renderItem={renderItemGame}
                      keyExtractor={item => item}
                      numColumns={3}
                      columnWrapperStyle={styles.rowGame}
                    />
                  </View>
                </View>
                {AddCourtError && createCourt.gametype.length === 0 && (
                  <Text style={styles.errorText}>
                    *Select appropriate values
                  </Text>
                )}
                <View>
                  <View style={{paddingTop: 10}}>
                    <CommonTextInput
                      label="Court Name"
                      value={createCourt?.court_name}
                      onChangeText={text =>
                        setCreateCourt({...createCourt, court_name: text})
                      }
                      //widthStyle={true}
                    />
                    {AddCourtError && createCourt.court_name === '' && (
                      <Text style={styles.errorText}>
                        *Enter appropriate values
                      </Text>
                    )}
                  </View>
                  <View style={{paddingTop: 10}}>
                    <CommonTextInput
                      label="Default price"
                      value={createCourt?.default_amount}
                      onChangeText={text =>
                        setCreateCourt({...createCourt, default_amount: text})
                      }
                      // widthStyle={true}
                    />
                    {AddCourtError && createCourt.default_amount === '' && (
                      <Text style={styles.errorText}>
                        *Enter appropriate values
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.addButtonRule}
                    onPress={handleAddCourt}>
                    <Text style={styles.addButtonTextRule}>
                      {addEdit == 'Add' ? 'Add' : 'Update'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {groundData?.court_details?.map(item => (
                    <CourtCard
                      key={item.id}
                      item={item}
                      handlemodal={handlemodal}
                      handleEditCourt={handleEditCourt}
                    />
                  ))}
                </View>
              </View>
            </Collapsible>
            <View style={{paddingTop: 15}}>
              <TouchableOpacity
                style={[
                  styles.accordionHeader,
                  !basicSlotDetailsOpen
                    ? styles.openHeader
                    : styles.closedHeader,
                ]}
                onPress={() => setBasicSlotDetailsOpen(!basicSlotDetailsOpen)}
                activeOpacity={1}>
                <Text style={styles.accordionHeaderText}>Add Slot Timing</Text>
                <Ionicons
                  name={!basicSlotDetailsOpen ? 'chevron-up' : 'chevron-down'}
                  size={24}
                />
              </TouchableOpacity>

              <Collapsible collapsed={basicSlotDetailsOpen}>
                {/* <View>
    <Text style={styles.labelSlot}>Add Slot Timing</Text>
    </View> */}
                <View
                  style={{
                    backgroundColor: '#fff',
                    paddingHorizontal: 15,
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  }}>
                  <View style={styles.horizontalBar} />
                  <Text style={styles.labelSlot}>Courts</Text>
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={courtItems}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    placeholder={
                      courtItems.length === 0 ? 'No court data' : 'Select Court'
                    }
                    //maxHeight={500}
                    maxHeight={calculatedHeight}
                    zIndex={3000}
                    zIndexInverse={3000}
                    style={styles.dropdownSlot}
                    dropDownStyle={styles.dropdownSlot}
                    dropDownContainerStyle={{
                      borderColor: COLORS.fieldBorderColor,
                      backgroundColor: '#fafafa',
                    }}
                  />
                  {AddCourtTimingError && !selectedValue.Courts && (
                    <Text style={styles.errorText}>
                      *Select appropriate values
                    </Text>
                  )}
                  {console.log('price', createSlots?.price)}
                  <CommonTextInput
                    label="Price"
                    value={createSlots?.price}
                    onChangeText={text => {
                      setCreateSlots({...createSlots, price: text});
                    }}
                    //widthStyle={true}
                  />
                  {AddCourtTimingError && !createSlots.price && (
                    <Text style={styles.errorText}>
                      *Enter appropriate price values
                    </Text>
                  )}
                  {/* Slot Slection                   */}
                  <View style={{paddingTop: 10}}>
                    <Text style={styles.labelSlot}>Select a slot</Text>
                    <View style={styles.radioSlot}>
                      <RadioButton.Group
                        onValueChange={value => {
                          setSelectedOption(value);
                          setCreateSlots({
                            ...createSlots,
                            slotType: value,
                          });
                        }}
                        value={selectedOption}>
                        <View style={styles.radioRow}>
                          {/* First Row: Weekday and Weekend */}
                          <View style={styles.radioItem}>
                            <RadioButton
                              color={COLORS.PrimaryColor}
                              value="weekday"
                              status={
                                selectedOption === 'weekday'
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onValueChange={() => {
                                setSelectedOption('weekday');
                                setCreateSlots({
                                  ...createSlots,
                                  slotType: selectedOption,
                                });
                                console.log('selectedOption', selectedOption);
                              }}
                            />
                            <Text>Weekday</Text>
                          </View>

                          <View style={styles.radioItem}>
                            <RadioButton
                              color={COLORS.PrimaryColor}
                              value="weekend"
                              status={
                                selectedOption === 'weekend'
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onValueChange={() => {
                                setSelectedOption('weekend');
                                setCreateSlots({
                                  ...createSlots,
                                  slotType: 'weekend',
                                });
                              }}
                            />
                            <Text>Weekend</Text>
                          </View>
                        </View>

                        <View style={styles.radioRow}>
                          {/* Second Row: Custom Days and Custom Date */}
                          <View style={styles.radioItem}>
                            <RadioButton
                              color={COLORS.PrimaryColor}
                              value="customDays"
                              status={
                                selectedOption === 'customDays'
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onValueChange={() => {
                                setSelectedOption('customDays');
                                setCreateSlots({
                                  ...createSlots,
                                  slotType: 'customDays',
                                });
                              }}
                            />
                            <Text>Custom Days</Text>
                          </View>
                          <View style={styles.radioItem}>
                            <RadioButton
                              color={COLORS.PrimaryColor}
                              value="customDate"
                              status={
                                selectedOption === 'customDate'
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onValueChange={() => {
                                setSelectedOption('customDate');
                                setCreateSlots({
                                  ...createSlots,
                                  slotType: 'customDate',
                                });
                              }}
                            />
                            <Text>Custom Date</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                    </View>
                    {console.log('slotType', createSlots?.slotType)}
                    {AddCourtError && createSlots.slotType === '' && (
                      <Text style={styles.errorText}>
                        *Enter appropriate values
                      </Text>
                    )}
                    {/* WeekDay Slot */}
                    {selectedOption === 'weekday' && (
                      <View style={styles.radioSlot}>
                        <Text style={styles.sectionTitle}>Weekday Slot</Text>
                        <View style={styles.checkboxContainer}>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                            <View key={day} style={styles.checkboxItem}>
                              <Checkbox
                                status="checked"
                                color={COLORS.PrimaryColor}
                              />
                              <Text
                                style={{
                                  fontFamily: 'Outfit-Regular',
                                  fontSize: 16,
                                }}>
                                {day}
                              </Text>
                            </View>
                          ))}
                          {['Sat', 'Sun'].map(day => (
                            <View key={day} style={styles.checkboxItem}>
                              <Checkbox status="unchecked" disabled={true} />
                              <Text
                                style={{
                                  fontFamily: 'Outfit-Regular',
                                  fontSize: 16,
                                }}>
                                {day}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    {/* Weekend Slot */}
                    {selectedOption === 'weekend' && (
                      <View style={styles.radioSlot}>
                        <Text style={styles.sectionTitle}>Weekend Slot</Text>
                        <View style={styles.checkboxContainer}>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                            <View key={day} style={styles.checkboxItem}>
                              <Checkbox
                                status="unchecked"
                                disabled={true}
                                style={(fontFamily = 'Outfit-Regualar')}
                              />
                              <Text
                                style={{
                                  fontFamily: 'Outfit-Regular',
                                  fontSize: 16,
                                }}>
                                {day}
                              </Text>
                            </View>
                          ))}
                          {['Sat', 'Sun'].map(day => (
                            <View key={day} style={styles.checkboxItem}>
                              <Checkbox
                                status="checked"
                                color={COLORS.PrimaryColor}
                              />
                              <Text
                                style={{
                                  fontFamily: 'Outfit-Regular',
                                  fontSize: 16,
                                }}>
                                {day}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    {/* custom days Slot */}
                    {selectedOption === 'customDays' && (
                      <View style={[styles.radioSlot, {paddingTop: 10}]}>
                        <Text style={styles.sectionTitle}>Custom Days</Text>
                        <View style={styles.checkboxContainer}>
                          {Object.keys(customDays).map(day => (
                            <View key={day} style={styles.checkboxItem}>
                              <Checkbox
                                status={
                                  customDays[day] ? 'checked' : 'unchecked'
                                }
                                color={COLORS.PrimaryColor}
                                onPress={() => toggleCustomCheckbox(day)}
                              />
                              <Text>{day}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    {/* custom date Slot */}
                    {selectedOption === 'customDate' && (
                      <View
                        style={[
                          styles.radioSlot,
                          {paddingTop: 10, paddingBottom: 10},
                        ]}>
                        <Text style={styles.sectionTitle}>Custom Date</Text>
                        <View
                          style={{
                            width: '100%',
                            paddingTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 20,
                          }}>
                          <Text style={styles.labelSlot}>Date</Text>
                          <TouchableOpacity
                            style={styles.buttonSlot}
                            onPress={() => setOpenDatePicker(true)}>
                            <Text style={styles.buttonTextSlot}>
                              {' '}
                              {createSlots.date
                                ? new Date(createSlots.date).toLocaleDateString(
                                    'en-GB',
                                  )
                                : 'Select Date'}
                            </Text>
                          </TouchableOpacity>
                          <DatePicker
                            modal
                            mode="date"
                            open={openDatePicker}
                            date={
                              createSlots.date
                                ? new Date(createSlots.date)
                                : new Date()
                            }
                            minimumDate={new Date()}
                            onConfirm={date => {
                              setOpenDatePicker(false);
                              handleDateChange(date);
                            }}
                            onCancel={() => {
                              setOpenDatePicker(false);
                            }}
                          />
                        </View>
                        {AddCourtTimingError && !createSlots.date && (
                          <Text style={styles.errorText}>*Choose the date</Text>
                        )}
                      </View>
                    )}
                  </View>
                  {AddCourtTimingError && !createSlots.slotType && (
                    <Text style={styles.errorText}>*Select a SlotType</Text>
                  )}

                  {/* Old Code            
                  <View>
                    <Text style={styles.labelSlot}>Date</Text>
                    <TouchableOpacity
                      style={styles.buttonSlot}
                      onPress={() => setOpenDatePicker(true)}>
                      <Text style={styles.buttonTextSlot}>
                        {' '}
                        {createSlots.date
                          ? new Date(createSlots.date).toLocaleDateString(
                              'en-GB',
                            )
                          : 'Select Date'}
                      </Text>
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      mode="date"
                      open={openDatePicker}
                      date={
                        createSlots.date
                          ? new Date(createSlots.date)
                          : new Date()
                      }
                      minimumDate={new Date()}
                      onConfirm={date => {
                        setOpenDatePicker(false);
                        handleDateChange(date);
                      }}
                      onCancel={() => {
                        setOpenDatePicker(false);
                      }}
                    />
                  </View>
                  {AddCourtTimingError && !createSlots.date && (
                    <Text style={styles.errorText}>*Choose the date</Text>
                  )}
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelSlot}>Start Time</Text>
                    <TouchableOpacity
                      style={styles.inputDateViewSlot}
                      onPress={() => setOpenStartPicker(true)}>
                      <Text style={styles.inputTextSlot}>
                        {createSlots?.starttime || 'Select Time'}
                      </Text>
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      open={openStartPicker}
                      date={new Date()}
                      mode="time"
                      //  minimumDate={new Date()}
                      minimumDate={
                        new Date(createSlots.date).toDateString() ===
                        new Date().toDateString()
                          ? new Date()
                          : undefined
                      }
                      onConfirm={date => {
                        const now = new Date();
                        setOpenStartPicker(false);
                        setCreateSlots(prevState => ({
                          ...prevState,
                          ['starttime']: formatTime(date),
                        }));
                      }}
                      onCancel={() => {
                        setOpenStartPicker(false);
                      }}
                    />
                    {AddCourtTimingError && !createSlots.starttime && (
                      <Text style={styles.errorText}>*Enter start time</Text>
                    )}
                  </View>
                  {console.log('price', createSlots?.endtime)}
                  {console.log('price', createSlots?.starttime)}
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelSlot}>End Time</Text>
                    <TouchableOpacity
                      style={styles.inputDateViewSlot}
                      onPress={() => setOpenEndPicker(true)}>
                      <Text style={styles.inputTextSlot}>
                        {createSlots?.endtime || 'Select Time'}
                      </Text>
                    </TouchableOpacity>
                    <DatePicker
                      style={{fontFamily: 'Outfit-Regular'}}
                      modal
                      open={openEndPicker}
                      date={new Date()}
                      mode="time"
                      //minimumDate={new Date()}
                      minimumDate={
                        new Date(createSlots.date).toDateString() ===
                        new Date().toDateString()
                          ? new Date()
                          : undefined
                      }
                      onConfirm={date => {
                        const nowEnd = new Date();
                        //               if (date < nowEnd) {
                        //   Alert.alert("Invalid Time", "You cannot select a past time.");
                        //   setOpenStartPicker(false);
                        //   return;
                        // }
                        setOpenEndPicker(false);
                        //handleInputChange('end_time', date);
                        setCreateSlots(prevState => ({
                          ...prevState,
                          ['endtime']: formatTime(date),
                        }));
                      }}
                      onCancel={() => {
                        setOpenEndPicker(false);
                      }}
                    />
                    {AddCourtTimingError && !createSlots.endtime && (
                      <Text style={styles.errorText}>*Enter end time</Text>
                    )}
                  </View>
*/}

                  <View>
                    <TouchableOpacity
                      style={styles.addButtonRule}
                      onPress={handleAddCourtSlot}>
                      <Text style={styles.addButtonTextRule}>
                        {addEdit == 'Add' ? 'Add' : 'Update'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* New View of Add Slots */}
                  <View style={{paddingTop: 15}}>
                    {groundData?.court_details?.length !== 0 && (
                      <>
                        {courtslot &&
                          Object.values(courtslot).map((item, index) => {
                            let sortslotdata =
                              item?.slotData?.sort(compareByDate);
                            let activeSlotData = sortslotdata?.filter(
                              item => item?.isActive,
                            );

                            return (
                              <View key={index} style={styles.cardSlot}>
                                <TouchableOpacity
                                  onPress={() => toggleSection(index)}>
                                  <View style={styles.cardHeaderSlot}>
                                    {/* <Text style={styles.groundNameSlot}>{groundData.groundname}</Text> */}
                                    <Text style={styles.courtNameSlot}>
                                      {item.court_name}
                                    </Text>
                                    <Ionicons
                                      name={
                                        !activeSections[index]
                                          ? 'chevron-down'
                                          : 'chevron-up'
                                      }
                                      size={24}
                                      style={styles.icon}
                                    />
                                  </View>
                                </TouchableOpacity>
                                <Collapsible collapsed={!activeSections[index]}>
                                  {activeSlotData?.length ? (
                                    <View style={styles.dividerSlot} />
                                  ) : (
                                    <Text style={{alignItems: 'center'}}>
                                      No Data
                                    </Text>
                                  )}
                                  {activeSlotData?.map((slot, slotIndex) => {
                                    const newSlotStartTime = formatSlotTime(
                                      slot.start,
                                    );
                                    const newSlotEndTime = formatSlotTime(
                                      slot.end,
                                    );

                                    const startTimeFormatted = getTimeFormatted(
                                      slot.start,
                                    );
                                    const endTimeFormatted = getTimeFormatted(
                                      slot.end,
                                    );
                                    {
                                      console.log(
                                        'startTimeFormatted',
                                        slot.days,
                                      );
                                    }
                                    return (
                                      <View
                                        key={slotIndex}
                                        style={styles.slotDetailsSlot}>
                                        <View style={styles.slotTimeSlot}>
                                          <Text style={styles.slotTimeSlotText}>
                                            {slot.slotType &&
                                            slot.slotType !== 'customDate'
                                              ? slot.slotType
                                              : startTimeFormatted.formatedate}
                                          </Text>
                                          {slot.days &&
                                            slot.days.length > 0 && (
                                              <Text
                                                style={[
                                                  styles.slotTimeText,
                                                  {color: COLORS.PrimaryColor},
                                                ]}>
                                                {`${slot.days},`}
                                              </Text>
                                            )}
                                          <Text
                                            style={
                                              styles.slotTimeText
                                            }>{`${newSlotStartTime} - ${newSlotEndTime}`}</Text>
                                        </View>
                                        <Text
                                          style={
                                            styles.slotPriceSlot
                                          }>{`₹${slot.price}`}</Text>
                                        <View style={styles.actionsSlot}>
                                          <TouchableOpacity
                                            onPress={() =>
                                              handleSlotdelete(slot)
                                            }>
                                            {/* <Text>Delete</Text> */}
                                            <Image
                                              source={IMAGES.DeleteIcons}
                                              style={styles.actionIconSlot}
                                            />
                                          </TouchableOpacity>
                                          <TouchableOpacity
                                            onPress={() =>
                                              handleSlotedit(slot)
                                            }>
                                            <Image
                                              source={IMAGES.EditIcons}
                                              style={styles.actionIconSlot}
                                            />
                                            {/* <Text>Edit</Text> */}
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    );
                                  })}
                                </Collapsible>
                              </View>
                            );
                          })}
                      </>
                    )}
                  </View>
                </View>
              </Collapsible>
            </View>

            <View style={{paddingTop: 15}}>
              <TouchableOpacity
                style={[
                  styles.accordionHeader,
                  !basicAvailableDetailsOpen
                    ? styles.openHeader
                    : styles.closedHeader,
                ]}
                onPress={() =>
                  setBasicAvailableDetailsOpen(!basicAvailableDetailsOpen)
                }
                activeOpacity={1}>
                <Text style={styles.accordionHeaderText}>Available Timing</Text>
                <Ionicons
                  name={
                    !basicAvailableDetailsOpen ? 'chevron-up' : 'chevron-down'
                  }
                  size={24}
                />
              </TouchableOpacity>
              <Collapsible collapsed={basicAvailableDetailsOpen}>
                {/* <View>
    <Text style={styles.labelSlot}>Available Timing</Text>
    </View> */}
                <View
                  style={{
                    backgroundColor: '#fff',
                    paddingHorizontal: 15,
                    borderBottomRightRadius: 12,
                    borderBottomLeftRadius: 12,
                  }}>
                  <View style={styles.horizontalBar} />
                  <View>
                    <Text style={styles.labelSlot}>Courts</Text>
                    <DropDownPicker
                      open={openAvailable}
                      value={valueAvailable}
                      items={courtItems}
                      setOpen={setOpenAvailable}
                      setValue={setValueAvailable}
                      setItems={setItems}
                      placeholder={
                        courtItems.length === 0
                          ? 'No court data'
                          : 'Select Court'
                      }
                      maxHeight={calculatedHeight}
                      zIndex={1000}
                      zIndexInverse={3000}
                      style={styles.dropdownSlot}
                      dropDownContainerStyle={{
                        backgroundColor: '#FAFAFA',
                        borderColor: COLORS.fieldBorderColor,
                        borderWidth: 1,
                      }}
                      dropDownStyle={styles.dropdownSlot}
                    />
                    {AddCourtTimingError && availablecourt.Courts === '' && (
                      <Text style={styles.errorText}>*Select the Court</Text>
                    )}
                    {/* {AddCourtTimingError && availablecourt.Courts === '' && (
                      <Text style={styles.errorText}>*Select appropriate values</Text>
                    )} */}
                    <Text style={styles.labelSlot}>Date</Text>
                    {/* <DatePicker
        date={createSlots.date}
        onDateChange={handleDateChange}
        minimumDate={new Date()}
        mode="date"
        style={styles.datePickerSlot}
      /> */}
                    <TouchableOpacity
                      style={styles.buttonSlot}
                      onPress={() => setOpenAvailableDatePicker(true)}>
                      <Text style={styles.buttonTextSlot}>
                        {' '}
                        {availablecourt.date
                          ? new Date(availablecourt.date).toLocaleDateString(
                              'en-GB',
                            )
                          : 'Select Date'}
                      </Text>
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      mode="date"
                      open={openAvailableDatePicker}
                      //date={new Date(availablecourt.date)}
                      date={
                        availablecourt.date
                          ? new Date(availablecourt.date)
                          : new Date()
                      }
                      minimumDate={new Date()}
                      onConfirm={date => {
                        setOpenAvailableDatePicker(false);
                        handleavialbleDateChange(date);
                      }}
                      onCancel={() => {
                        setOpenAvailableDatePicker(false);
                      }}
                    />
                  </View>
                  <View>
                    {courtTime?.length ? (
                      <View style={styles.buttonContainerAvailable}>
                        {courtTime.map((item, index) => {
                          let gttime = getTimeFormatted(item?.start);
                          return (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.buttonAvailable,
                                {
                                  borderColor: item?.bordercolor,
                                  backgroundColor: item?.backgroundColor,
                                },
                              ]}
                              disabled={item.isbooked}
                              onPress={() => handlebooking(item, index)}>
                              <Text style={{color: item?.textColor}}>
                                {gttime.Time}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <View style={styles.noSelectionContainerAvailable}>
                        <Text>Select the appropriate values</Text>
                      </View>
                    )}

                    <View style={styles.legendContainerAvailable}>
                      <View style={styles.legendItemAvailable}>
                        <Image
                          source={IMAGES.BookedRec}
                          style={styles.iconAvailable}
                        />
                        <Text style={styles.legendTextAvailable}>Booked</Text>
                      </View>
                      <View style={styles.legendItemAvailable}>
                        <Image
                          source={IMAGES.AvailableRec}
                          style={styles.iconAvailable}
                        />
                        <Text style={styles.legendTextAvailable}>
                          Available
                        </Text>
                      </View>
                      <View style={styles.legendItemAvailable}>
                        <Image
                          source={IMAGES.SelectedRec}
                          style={styles.iconAvailable}
                        />
                        <Text style={styles.legendTextAvailable}>Selected</Text>
                      </View>
                      <View style={styles.legendItemAvailable}>
                        <Image
                          source={IMAGES.CurrentSlotIcons}
                          style={styles.iconAvailable}
                        />
                        <Text style={styles.legendTextAvailable}>
                          Current slot
                        </Text>
                      </View>
                      <View style={styles.legendItemAvailable}>
                        <Image
                          source={IMAGES.BlockedRec}
                          style={styles.iconAvailable}
                        />
                        <Text
                          style={[
                            styles.legendTextAvailable,
                            styles.noWrapTextAvailable,
                          ]}>
                          Blocked slot
                        </Text>
                      </View>
                    </View>

                    <View style={styles.footerButtonsCartData}>
                      <TouchableOpacity
                        style={styles.resetButtonCartData}
                        onPress={handleunblockmodal}>
                        <Text style={styles.buttonTextCartData}>
                          UnBlock Court
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.paymentButtonCartData}
                        onPress={handleblockmodal}>
                        <Text style={styles.buttonTextCartData}>
                          Block Court
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Collapsible>
            </View>
            {/* Modal For Create Court */}
            <Modal
              visible={modalOpen}
              transparent={true}
              onRequestClose={() => setModalOpen(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                    }}>
                    <TouchableOpacity onPress={() => setModalOpen(false)}>
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={COLORS.PrimaryColor}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.modalCreateCourtText}>
                    {addEdit == 'Add'
                      ? 'Are you sure you want to Create a Slot?'
                      : 'Are you sure you want to Update a Slot?'}
                  </Text>

                  <View style={styles.buttonCreateCourtContainer}>
                    <TouchableOpacity
                      style={[
                        styles.buttonCreateCourt,
                        styles.cancelCreateCourtButton,
                      ]}
                      onPress={() => setModalOpen(false)}>
                      <Text style={styles.cancelCreateCourtButtonText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmCreateCourtButton]}
                      onPress={handleCreateCourt}>
                      <Text style={styles.confirmCreateCourtButtonText}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              visible={changestatusmodal}
              transparent={true}
              onRequestClose={() => setChangestatusmodal(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                    }}>
                    <TouchableOpacity
                      onPress={() => setChangestatusmodal(false)}>
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={COLORS.PrimaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalCreateCourtText}>
                    Are you sure you want to Change Court Status?
                  </Text>

                  <View style={styles.buttonCreateCourtContainer}>
                    <TouchableOpacity
                      style={[
                        styles.buttonCreateCourt,
                        styles.cancelCreateCourtButton,
                      ]}
                      onPress={() => setChangestatusmodal(false)}>
                      <Text style={styles.cancelCreateCourtButtonText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmCreateCourtButton]}
                      onPress={handleswitchChange}>
                      <Text style={styles.confirmCreateCourtButtonText}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              visible={SlotmodalOpen}
              transparent={true}
              onRequestClose={() => setSlotModalOpen(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                    }}>
                    <TouchableOpacity onPress={() => setSlotModalOpen(false)}>
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={COLORS.PrimaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalCreateCourtText}>
                    {addEdit == 'Add'
                      ? 'Are you sure you want to Create a Slot?'
                      : 'Are you sure you want to Update a Slot?'}
                  </Text>

                  <View style={styles.buttonCreateCourtContainer}>
                    <TouchableOpacity
                      style={[
                        styles.buttonCreateCourt,
                        styles.cancelCreateCourtButton,
                      ]}
                      onPress={() => setSlotModalOpen(false)}>
                      <Text style={styles.cancelCreateCourtButtonText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmCreateCourtButton]}
                      onPress={handleCourtslot}>
                      <Text style={styles.confirmCreateCourtButtonText}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              visible={CreateSlotWarning}
              transparent={true}
              onRequestClose={() => setCreateSlotWarning(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setCreateSlotWarning(false);
                      }}>
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={COLORS.PrimaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalCreateCourtText}>
                    Cannot create slot as another slot already exists in the
                    chosen time range.
                  </Text>

                  {/* <View style={styles.buttonCreateCourtContainer}>
            <TouchableOpacity
              style={[styles.buttonCreateCourt, styles.cancelCreateCourtButton]}
              onPress={() => setModalOpen(false)}
            >
              <Text style={styles.cancelCreateCourtButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmCreateCourtButton]}
              onPress={handleCreateCourt}
            >
              <Text style={styles.confirmCreateCourtButtonText}>Yes</Text>
            </TouchableOpacity>
          </View> */}
                </View>
              </View>
            </Modal>

            <Modal
              visible={CreateEditSlotWarning}
              transparent={true}
              onRequestClose={() => setCreateEditSlotWarning(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setCreateEditSlotWarning(false);
                      }}>
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={COLORS.PrimaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalCreateCourtText}>
                    Cannot create slot as an event already exists in the chosen
                    time range.
                  </Text>
                  {/* <View style={styles.buttonCreateCourtContainer}>
            <TouchableOpacity
              style={[styles.buttonCreateCourt, styles.cancelCreateCourtButton]}
              onPress={() => setModalOpen(false)}
            >
              <Text style={styles.cancelCreateCourtButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmCreateCourtButton]}
              onPress={handleCreateCourt}
            >
              <Text style={styles.confirmCreateCourtButtonText}>Yes</Text>
            </TouchableOpacity>
          </View> */}
                </View>
              </View>
            </Modal>

            <Modal
              visible={blockmodalopen}
              transparent={true}
              onRequestClose={() => setblockModalOpen(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setblockModalOpen(false);
                      }}>
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={COLORS.PrimaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalCreateCourtText}>
                    Are you sure you want to block the selected slots?
                  </Text>

                  <View style={styles.buttonCreateCourtContainer}>
                    <TouchableOpacity
                      style={[
                        styles.buttonCreateCourt,
                        styles.cancelCreateCourtButton,
                      ]}
                      onPress={() => setblockModalOpen(false)}>
                      <Text style={styles.cancelCreateCourtButtonText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmCreateCourtButton]}
                      onPress={handleblock}>
                      <Text style={styles.confirmCreateCourtButtonText}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              visible={blockerrormodalopen}
              transparent={true}
              onRequestClose={() => setblockerrorModalOpen(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setblockerrorModalOpen(false);
                      }}>
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={COLORS.PrimaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalCreateCourtText}>
                    Cannot block slot as an blocked slot exists in the chosen
                    time range.
                  </Text>

                  {/* <View style={styles.buttonCreateCourtContainer}>
            <TouchableOpacity
              style={[styles.buttonCreateCourt, styles.cancelCreateCourtButton]}
              onPress={() => setModalOpen(false)}
            >
              <Text style={styles.cancelCreateCourtButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmCreateCourtButton]}
              onPress={handleCreateCourt}
            >
              <Text style={styles.confirmCreateCourtButtonText}>Yes</Text>
            </TouchableOpacity>
          </View> */}
                </View>
              </View>
            </Modal>

            <Modal
              visible={unblockmodalopen}
              transparent={true}
              onRequestClose={() => setunblockModalOpen(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setunblockModalOpen(false);
                      }}>
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={COLORS.PrimaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalCreateCourtText}>
                    Are you sure you want to unblock the selected slots?
                  </Text>
                  <View style={styles.buttonCreateCourtContainer}>
                    <TouchableOpacity
                      style={[
                        styles.buttonCreateCourt,
                        styles.cancelCreateCourtButton,
                      ]}
                      onPress={() => setunblockModalOpen(false)}>
                      <Text style={styles.cancelCreateCourtButtonText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmCreateCourtButton]}
                      onPress={handleUnblock}>
                      <Text style={styles.confirmCreateCourtButtonText}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              visible={unblockerrormodalopen}
              transparent={true}
              onRequestClose={() => setunblockerrorModalOpen(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setunblockerrorModalOpen(false);
                      }}>
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={COLORS.PrimaryColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalCreateCourtText}>
                    Cannot unblock slot as an unblocked slot exists in the
                    chosen time range.
                  </Text>

                  {/* <View style={styles.buttonCreateCourtContainer}>
            <TouchableOpacity
              style={[styles.buttonCreateCourt, styles.cancelCreateCourtButton]}
              onPress={() => setModalOpen(false)}
            >
              <Text style={styles.cancelCreateCourtButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmCreateCourtButton]}
              onPress={handleCreateCourt}
            >
              <Text style={styles.confirmCreateCourtButtonText}>Yes</Text>
            </TouchableOpacity>
          </View> */}
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      )}
    </>
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    //backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  itemContainerGame: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageGame: {
    // width: 52,
    // height: 35,
    width: 45,
    height: 45,
    //padding:5,
    resizeMode: 'contain',
  },
  textGame: {
    color: '#192335',
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
  },
  tickGame: {
    width: 15,
    height: 15,
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 10,
    borderRadius: 7.5,
  },
  // row: {
  //   flexDirection: 'row',
  //   marginBottom: 20,
  // },
  // rowSpace: {
  //   justifyContent: 'space-between',
  // },
  // halfWidth: {
  //   flex: 1,
  //   marginRight: 10,
  // },
  // inputContainer: {
  //   marginBottom: 20,
  // },
  // label: {
  //   fontSize: 16,
  //   color: '#1B1B1B',
  //   marginBottom: 5,
  // },
  // input: {
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   padding: 10,
  //   borderRadius: 5,
  //   backgroundColor: '#FAFAFA',
  // },
  // fixedWidth: {
  //   width: Dimensions.get('window').width * 0.9,
  // },
  // autoWidth: {
  //   width: '100%',
  // },
  errorText: {
    color: 'red',
    fontSize: 13,
    textAlign: 'left',
  },
  addButtonRule: {
    backgroundColor: '#097E52',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginVertical: 10,
  },
  addButtonTextRule: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /* Modal For Create Court */
  modalCreateCourtOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalCreateCourtContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 425,
  },
  headerCreateCourt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalCreateCourtText: {
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 10,
  },
  closeCreateCourtButton: {
    color: 'red',
    fontSize: 16,
  },
  buttonCreateCourtContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  buttonCreateCourt: {
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelCreateCourtButton: {
    backgroundColor: 'red',
    width: 80,
  },
  horizontalBar: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
    marginVertical: 10,
  },
  confirmCreateCourtButton: {
    width: 80,
    backgroundColor: 'green',
    borderRadius: 12,
  },
  cancelCreateCourtButtonText: {
    textAlign: 'center',
    color: '#fff',
  },
  confirmCreateCourtButtonText: {
    color: '#FFF',
    padding: 10,
    textAlign: 'center',
  },

  /* Court Card Details Of Switch */
  cardCourtCard: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: Dimensions.get('window').width * 0.82,
  },
  rowCourtCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courtNameCourtCard: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameTypeContainer: {
    marginRight: 40,
  },
  gameTypeCourtCard: {
    fontSize: 14,
    color: '#097E52',
  },
  priceCourtCard: {
    fontSize: 16,
    fontWeight: '600',
  },
  blockCourtTextCourtCard: {
    fontSize: 14,
    color: '#757C8D',
    marginRight: 8,
  },
  /* Slot Timing Styles*/
  labelSlot: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  slotText: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
  },

  dropdownSlot: {
    backgroundColor: '#fafafa',
    borderColor: COLORS.fieldBorderColor,
    marginBottom: 16,
    height: 60,
  },
  datePickerSlot: {
    marginBottom: 16,
  },
  buttonSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    height: 40,
    // width: '80%',
    borderColor: COLORS.fieldBorderColor,
    borderWidth: 1,
  },
  radioSlot: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    marginBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  buttonTextSlot: {
    color: '#000000',
    fontSize: 16,
    // marginVertical: 8,
  },
  inputSlotDateView: {
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  inputSlotText: {
    color: '#333',
  },
  inputDateViewSlot: {
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    fontFamily: 'Outfit-Regular',
    fontSize: 20,
    justifyContent: 'center',
    borderColor: COLORS.fieldBorderColor,
    borderWidth: 1,
  },
  inputTextSlot: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    color: '#fff',
  },
  /* Available Booking Booked Courttimes */
  buttonContainerAvailable: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonAvailable: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: '30%',
    margin: 5,
  },
  noSelectionContainerAvailable: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
  },
  legendContainerAvailable: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  legendItemAvailable: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  iconAvailable: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  legendTextAvailable: {
    fontSize: 14,
    color: '#64627C',
  },
  noWrapTextAvailable: {
    whiteSpace: 'nowrap',
  },

  /* Footer Button Cart Data */
  footerButtonsCartData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  resetButtonCartData: {
    backgroundColor: '#097E52',
    borderRadius: 8,
    paddingVertical: 15,
    width: '48%',
    alignItems: 'center',
  },
  paymentButtonCartData: {
    backgroundColor: '#192335',
    borderRadius: 8,
    paddingVertical: 15,
    width: '48%',
    alignItems: 'center',
  },

  /* Add Slot Accordian */
  cardSlot: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  cardHeaderSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  groundNameSlot: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  courtNameSlot: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  dividerSlot: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  slotDetailsSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  slotTimeSlot: {
    flexDirection: 'column',
  },
  slotTimeSlotText: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    color: '#192335',
    lineHeight: 22,
    textTransform: 'capitalize',
  },
  slotTimeText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: '#757C8D',
    lineHeight: 22,
  },
  slotPriceSlot: {
    color: '#097E52',
    fontFamily: 'Outfit-Medium',
    fontSize: 16,
    lineHeight: 22,
  },
  actionsSlot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconSlot: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },

  /* Accordian Collapsible */
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
  buttonTextCartData: {
    color: '#FFFFFF',
  },
  tickIconSports: {
    width: 15,
    height: 15,
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 15,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%', // Ensures wrapping if there are more than two items in a row
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '25%',
  },
  sectionTitle: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },

  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});

export default CourtScreen;
