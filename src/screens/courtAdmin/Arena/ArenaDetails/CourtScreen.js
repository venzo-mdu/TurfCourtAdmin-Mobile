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
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  changeEventStatus,
  createNewBlockEvent,
  getcourtevent,
} from '../../../../firebase/firebaseFunction/eventDetails';
import _ from 'lodash';
import {getTimeFormatted} from '../../../../utils/getHours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER, USERLOGIN} from '../../..';
import Collapsible from 'react-native-collapsible';
import moment from 'moment';
import {COLORS} from '../../../../assets/constants/global_colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonTextInputError from '../../../../components/molecules/commomTextInputError';

const CourtScreen = () => {
  const [tab, setTab] = useState('Add Court');
  const [uid, setUid] = useState([]);
  const route = useRoute();
  const {groundID} = route.params || null;
  const navigation = useNavigation();
  //console.log("groundID Views", groundID)
  const [groundData, setGroundData] = useState();
  const [courtTime, setCourtTime] = useState([]);
  //console.log("courtTime---", courtTime)
  const [eventData, setEventData] = useState([]);
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
    date: new Date(),
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
  console.log('gametype', gametype);
  //const [blockmodalopen, setblockModalOpen] = useState(false);
  const [blockerrormodalopen, setblockerrorModalOpen] = useState(false);
  const [unblockerrormodalopen, setunblockerrorModalOpen] = useState(false);
  const [unblockmodalopen, setunblockModalOpen] = useState(false);

  const iconsss = {
    Cricket: IMAGES.Cricket,
    Badminton: IMAGES.Badmiton,
    'Table Tennis': IMAGES.TableTennis,
    Football: IMAGES.Football,
    Volleyball: IMAGES.Cricket,
    Hockey: IMAGES.Badmiton,
    Basketball: IMAGES.Cricket,
    Archery: IMAGES.Badmiton,
    Baseball: IMAGES.Cricket,
    Softball: IMAGES.Badmiton,
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
  const [createSlots, setCreateslots] = useState({
    price: '',
    date: new Date(),
    starttime: '',
    endtime: '',
    isActive: true,
  });
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
  const [value, setValue] = useState(null);
  const [blockmodalopen, setblockModalOpen] = useState(false);
  const [valueAvailable, setValueAvailable] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
    {label: 'Pear', value: 'pear'},
    {label: 'Cricket', value: 'w8SLqfDdGeXXnfA74Ckf'},
  ]);
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
    // console.log("Hi")
    if (groundID != null) {
      // console.log("Hi123", groundID)
      // //setLoading(true);
      // let groundres = await getgroundDataById(groundID);
      // //setLoading(false);
      // console.log("gtrr33 groundres" , groundres, "gtrr33");
      // setGroundData(groundres);
      // setgametype(groundres?.game_type);
      // //setLoading(true);
      // const slotDatas = await getGroundslotdata(groundID);
      // //setLoading(false);
      // console.log("slotDatas",slotDatas, groundres, "slotDatas");

      // setCourtslot(slotDatas);
      // getCourttime(groundres, currentDate);
      //setLoading(true);
      setLoadingView(true);
      console.log('groundId', groundID);
      let groundres = await getgroundDataById(groundID, 'admin', uid);
      //setLoading(false);
      setLoadingView(false);
      console.log('gtrr33 groundres', groundres, 'gtrr33');
      setGroundData(groundres);
      setgametype(groundres?.game_type);
      //setLoading(true);
      let court_details = await getCourtsForGround(groundID);
      //     console.log("court_details", court_details)
      let ground_details = {...groundData, court_details};
      console.log('ground_details', ground_details);
      // setGroundData(ground_details);
      // setgametype(ground_details?.game_type);

      const slotDatas = await getGroundslotdata(ground_details);

      //  console.log("My SLotsData",slotDatas);
      //setLoading(false);

      setCourtslot(slotDatas);
      getCourttime(ground_details, currentDate);
    } else {
      console.log('grndData2', 'check2 ');
    }
  };

  useEffect(() => {
    grndData();
    // console.log("gtrr334");
  }, [uid]);

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
    //console.log("Hi One")
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
      await createNewCourt(groundID, createCourt);
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
        trackColor={{false: '#767577', true: colors.primary}}
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
      setCreateslots(prevSlots => ({
        ...prevSlots,
        date: formattedDate,
      }));
    }
  };

  const handleTimeChange = (type, date) => {
    if (
      createSlots.date.toDateString() === new Date().toDateString() &&
      date.getHours() < new Date().getHours()
    ) {
      Alert.alert('Past time is not allowed');
    } else {
      setCreateslots({
        ...createSlots,
        [type]: date,
      });
    }
  };

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
      console.log('groundData?.court_details', groundData?.court_details);
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
    } else if (valueAvailable !== null) {
      //console.log("valueAvailable",valueAvailable)
      setAvailablecourt(prev => ({
        ...prev,
        Courts: valueAvailable,
      }));
      handleavailablecourt(valueAvailable);
    }
  }, [value, valueAvailable]);

  //   useEffect(()=>{
  //     if(valueAvailable !== null){
  //      console.log("valueAvailable",valueAvailable)
  //      setAvailablecourt((prev) => ({
  //        ...prev,
  //        Courts: value,
  //      }));
  //      handleavailablecourt(valueAvailable);
  //    }

  //  },[valueAvailable])

  //console.log("availableCourts", availablecourt, valueAvailable)

  /* Add Funciton of SLot */
  const handleAddCourtSlot = async () => {
    if (
      selectedValue?.Courts == '' ||
      createSlots?.price == '' ||
      createSlots?.date == '' ||
      createSlots?.starttime == '' ||
      createSlots?.endtime == ''
    ) {
      setAddCourtTimingError(true);
      ToastAndroid.show('Past time is not allowed');
    } else {
      const startT = `${createSlots.date}T${createSlots.starttime}`;
      const endT = `${createSlots.date}T${createSlots.endtime}`;
      const newStartTime = new Date(startT);
      const newEndTime = new Date(endT);
      const currentDateTime = new Date();
      if (
        newStartTime > newEndTime ||
        newStartTime < currentDateTime ||
        newEndTime < currentDateTime
      ) {
        ToastAndroid.show('Past time is not allowed');
        return;
      } else {
        //setLoading(true);
        const courtDataBySlot = await getcourtevent(selectedValue?.Courts);
        //setLoading(false);

        if (courtDataBySlot.length != 0) {
          const isExist = courtDataBySlot.filter(item => {
            return (
              (new Date(item.start) < newStartTime &&
                new Date(item.end) < newStartTime) == false &&
              (new Date(item.start) > newEndTime &&
                new Date(item.end) > newEndTime) == false
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
  };

  const handleCourtslot = async () => {
    createSlots.start = `${createSlots?.date}T${createSlots?.starttime}`;
    createSlots.end = `${createSlots?.date}T${createSlots?.endtime}`;

    createSlots.court_id = selectedValue?.Courts;

    if (
      selectedValue?.selectedEditslot == '' ||
      selectedValue?.selectedEditslot == undefined
    ) {
      //setLoading(true);
      setLoadingView(true);
      const data = await createCourtSlot(selectedValue?.Courts, createSlots);
      console.log('data---1213', data);
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

    setCreateslots({
      price: '',
      date: new Date(),
      starttime: '',
      endtime: '',
      isActive: true,
    });
    setValue(null);
    setSelectedValue({...selectedValue, Courts: '', selectedEditslot: ''});
    grndData();
    console.log('End Game');
    setSlotModalOpen(false);
  };

  /* Available Timing Sections */
  const handleavailablecourt = async value => {
    // setAvailablecourt({ ...availablecourt, Courts: value });
    // console.log("data HandleAvailCOurt123", !_.isEmpty(availablecourt.date) && !_.isEmpty(value))
    if (!_.isEmpty(availablecourt.date) && !_.isEmpty(value)) {
      setAccordionOpen(true);
      //setLoading(true);
      const data = await getcourtevent(value?.value);
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
      console.log(
        'New Values',
        !_.isEmpty(formattedDate) && !_.isEmpty(availablecourt.Courts),
      );
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

    eventss.forEach(court => {
      eventData.forEach(event => {
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
      }

      // Convert start and end to the required format
      element.start = element.start.toString();
      element.end = element.end.toString();

      return element;
    });

    console.log('eventss', eventarr);

    setCourtTime(eventarr);
  };

  const handlebooking = (value, index) => {
    const updatedCourtTime = [...courtTime];

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
      setCourtTime(updatedCourtTime);
    }
  };

  const handleblock = async () => {
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }
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
      //console.log("response handle Booking", response)
      if (response?.status == 'Success') {
        setblockModalOpen(false);
        handleReset();
        // ToastAndroid.show("Blocking Success");

        grndData();
        //setblockModalOpen(false);
      } else {
        toast.error('Blocking Failed', {
          position: 'top-right',
          autoClose: 2000,
        });
        console.error('book fail');
      }
      // }
    }
  };

  const handleblockmodal = () => {
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
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }
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

      if (mapcosnt?.length) {
        handleReset();
        toast.success('Unblocking Success', {
          position: 'top-right',
          autoClose: 2000,
        });
        grndData();
        setunblockModalOpen(false);
      } else {
        toast.error('Unblocking Failed', {
          position: 'top-right',
          autoClose: 2000,
        });
        setunblockModalOpen(false);
        console.error('Unblocking fail');
      }
      // }
    }
  };

  const handleReset = () => {
    setAvailablecourt({
      Courts: '',
      date: currentDate,
    });
    setValueAvailable(null);
    setAccordionOpen(false);
    setCourtTime([]);
  };

  /* Update The Slots */
  const handleSlotedit = async value => {
    console.log('value one', value);
    //setLoading(true);
    const courtDataBySlot = await getcourtevent(value.court_id);
    //setLoading(false);
    if (courtDataBySlot.length != 0) {
      const newStartTime = new Date(value.start);
      const newEndTime = new Date(value.end);
      const isExist = courtDataBySlot.filter(item => {
        return (
          (new Date(item.start) < newStartTime &&
            new Date(item.end) < newStartTime) == false &&
          (new Date(item.start) > newEndTime &&
            new Date(item.end) > newEndTime) == false
        );
      });

      if (!isExist.length) {
        setAddEdit('Update');
        value.start = formatDateToISO(value.start);
        value.end = formatDateToISO(value.end);

        let court_value = courtItems?.filter(
          item => item.value == value?.court_id,
        );
        console.log('court_value123', court_value);
        setSelectedValue({
          ...selectedValue,
          selectedEditslot: value?.slot_id,
          Courts: court_value[0].value,
        });
        setValue(court_value[0].value);
        setCreateslots({
          date: value?.start.slice(0, 10),
          starttime: value?.start?.slice(11, 16),
          endtime: value?.end?.slice(11, 16),
          price: value?.price,
          isActive: value?.isActive,
        });
        setAnchorEl(null);

        //handleChange("Slots");
      } else {
        setSloteditWarning(true);
      }
    } else {
      setAddEdit('Update');
      value.start = formatDateToISO(value.start);
      value.end = formatDateToISO(value.end);

      let court_value = courtItems?.filter(
        item => item.value == value?.court_id,
      );
      console.log('court_value', court_value);
      setSelectedValue({
        ...selectedValue,
        selectedEditslot: value?.slot_id,
        Courts: court_value[0].value,
      });
      setValue(court_value[0].value);
      setCreateslots({
        date: value?.start.slice(0, 10),
        starttime: value?.start?.slice(11, 16),
        endtime: value?.end?.slice(11, 16),
        price: value?.price,
        isActive: value?.isActive,
      });
      setAnchorEl(null);

      //      handleChange("Slots");
    }
  };

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
            <Text style={styles.gameTypeCourtCard}>
              {item.gametype.join(' | ')}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => handleEditCourt(item)}>
              <Icon name="ellipsis-v" size={20} color={colors.text} />
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
    <TouchableOpacity
      style={styles.itemContainerGame}
      onPress={() => handleGameclick(item)}>
      <Image
        style={styles.imageGame}
        resizeMode="contain"
        source={iconsss[item]}
      />
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
  );

  return (
    <>
      {loader ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#097E52" />
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
            {/* <Collapsible collapsed={basicCourtDetailsOpen}> */}
            <View
              style={{
                zIndex: 2000,
                padding: 10,
                marginBottom: 20,
                backgroundColor: '#fff',
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
                {AddCourtError && createCourt.gametype === '' && (
                  <Text style={styles.errorText}>
                    *Select appropriate values
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 10,
              }}>
              <View style={{marginBottom: 20}}>
                <CommonTextInputError
                  label="Court Name"
                  value={createCourt?.court_name}
                  onChangeText={text =>
                    setCreateCourt({...createCourt, court_name: text})
                  }
                  //widthStyle={true}
                />
                {AddCourtError && createCourt.court_name === '' && (
                  <Text style={styles.errorText}>Enter the Court Name</Text>
                )}
              </View>
              <View style={{marginBottom: 20}}>
                <CommonTextInputError
                  label="Default price"
                  value={createCourt?.default_amount}
                  onChangeText={text =>
                    setCreateCourt({...createCourt, default_amount: text})
                  }
                  // widthStyle={true}
                />
                {AddCourtError && createCourt.default_amount === '' && (
                  <Text style={styles.errorText}>Enter the Court Price</Text>
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
            <View style={{marginTop: 20}}>
              {groundData?.court_details?.map(item => (
                <CourtCard
                  key={item.id}
                  item={item}
                  handlemodal={handlemodal}
                  handleEditCourt={handleEditCourt}
                />
              ))}
            </View>
            {/* </Collapsible> */}
            <View
              style={{
                zIndex: 2000,
                padding: 10,
                marginBottom: 20,
                backgroundColor: '#fff',
                borderBottomRightRadius: 12,
                borderBottomLeftRadius: 12,
              }}>
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
              {/* <Collapsible collapsed={basicSlotDetailsOpen}> */}
              {/* <View>
    <Text style={styles.labelSlot}>Add Slot Timing</Text>
    </View> */}
              <View style={{marginBottom: 20}}>
                <Text style={styles.labelSlot}>Courts</Text>
                {/* <DropDownPicker
        open={openCourtDropdown}
        value={selectedValue?.Courts}
        items={courtItems}
        setOpen={setOpenCourtDropdown}
        setValue={handleCourtChange}
        setItems={setCourtItems}
        placeholder="Select Court"
        style={styles.dropdownSlot}
        dropDownStyle={styles.dropdownSlot}
      /> */}
                <DropDownPicker
                  open={open}
                  value={value}
                  items={courtItems}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder={'Select Court'}
                  placeholderStyle={(fontFamily = 'Outfit-Regular')}
                  style={[styles.dropdown]}
                  textStyle={{
                    fontFamily: 'Outfit-Regular',
                    color: '#000',
                    fontSize: 14,
                  }}
                  //maxHeight={500}
                  maxHeight={calculatedHeight}
                  zIndex={3000}
                  zIndexInverse={3000}
                  dropDownStyle={styles.dropdownSlot}
                />
                {AddCourtTimingError && selectedValue.Courts === '' && (
                  <Text style={styles.errorText}>Select the Court</Text>
                )}
                <View>
                  <CommonTextInput
                    label="Price"
                    value={createSlots.price}
                    onChangeText={text =>
                      setCreateslots({...createSlots, price: text})
                    }
                    widthStyle={false}
                  />
                  {AddCourtTimingError && createSlots.price === '' && (
                    <Text style={styles.errorText}>Enter the Price</Text>
                  )}

                  <Text style={styles.labelSlot}>Date</Text>
                  {/* <DatePicker
        date={createSlots.date}
        onDateChange={handleDateChange}
        minimumDate={new Date()}
        mode="date"
        style={styles.datePickerSlot}
      /> */}
                  <View style={styles.dropDownDate}>
                    <TouchableOpacity
                      style={styles.buttonSlot}
                      onPress={() => setOpenDatePicker(true)}>
                      <Text style={styles.buttonTextSlot}>
                        {' '}
                        {createSlots.date
                          ? createSlots.date
                            ? new Date(createSlots.date).toLocaleDateString(
                                'en-GB',
                              )
                            : new Date(
                                createSlots.createdAt,
                              ).toLocaleDateString('en-GB')
                          : 'Select Date'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <DatePicker
                    modal
                    mode="date"
                    open={openDatePicker}
                    date={
                      createSlots.date
                        ? new Date(createSlots.date)
                        : new Date(createSlots.createdAt)
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
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.labelSlot}>Start Time</Text>
                    <TouchableOpacity
                      style={styles.inputDateViewSlot}
                      onPress={() => setOpenStartPicker(true)}>
                      <Text style={styles.inputTextSlot}>
                        {createSlots?.starttime || 'Select Time'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <DatePicker
                    modal
                    open={openStartPicker}
                    date={new Date()}
                    mode="time"
                    minimumDate={new Date()}
                    onConfirm={date => {
                      const now = new Date();
                      //               if (date < now) {
                      //   Alert.alert("Invalid Time", "You cannot select a past time.");
                      //   setOpenStartPicker(false);
                      //   return;
                      // }
                      setOpenStartPicker(false);
                      //handleInputChange('start_time', date);
                      setCreateslots(prevState => ({
                        ...prevState,
                        ['starttime']: formatTime(date),
                      }));
                    }}
                    onCancel={() => {
                      setOpenStartPicker(false);
                    }}
                  />
                  {!createSlots?.starttime && AddCourtTimingError && (
                    <Text style={styles.errorText}>*Enter start time</Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelSlot}>End Time</Text>
                  <View style={styles.dropDownDate}>
                    <TouchableOpacity
                      style={styles.inputDateViewSlot}
                      onPress={() => setOpenEndPicker(true)}>
                      <Text style={styles.inputTextSlot}>
                        {createSlots?.endtime || 'Select Time'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <DatePicker
                    style={{fontFamily: 'Outfit-Regular'}}
                    modal
                    open={openEndPicker}
                    date={new Date()}
                    mode="time"
                    minimumDate={new Date()}
                    onConfirm={date => {
                      const nowEnd = new Date();
                      //               if (date < nowEnd) {
                      //   Alert.alert("Invalid Time", "You cannot select a past time.");
                      //   setOpenStartPicker(false);
                      //   return;
                      // }
                      setOpenEndPicker(false);
                      //handleInputChange('end_time', date);
                      setCreateslots(prevState => ({
                        ...prevState,
                        ['endtime']: formatTime(date),
                      }));
                    }}
                    onCancel={() => {
                      setOpenEndPicker(false);
                    }}
                  />
                  {!createSlots?.endtime && AddCourtTimingError && (
                    <Text style={styles.errorText}>*Enter end time</Text>
                  )}
                </View>
                <View style={{marginVertical: 20}}>
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
                                ) : null}
                                {activeSlotData?.map((slot, slotIndex) => {
                                  const startTimeFormatted = getTimeFormatted(
                                    slot.start,
                                  );
                                  const endTimeFormatted = getTimeFormatted(
                                    slot.end,
                                  );
                                  return (
                                    <View
                                      key={slotIndex}
                                      style={styles.slotDetailsSlot}>
                                      <View style={styles.slotTimeSlot}>
                                        <Text style={styles.slotTimeSlotText}>
                                          {startTimeFormatted.formatedate}
                                        </Text>
                                        <Text
                                          style={
                                            styles.slotTimeSlotText
                                          }>{`${startTimeFormatted.Time} - ${endTimeFormatted.Time}`}</Text>
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
                                          onPress={() => handleSlotedit(slot)}>
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
              {/* </Collapsible> */}
            </View>
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
            {/* <Collapsible collapsed={basicAvailableDetailsOpen}> */}
            {/* <View>
    <Text style={styles.labelSlot}>Available Timing</Text>
    </View> */}
            <View>
              <Text style={styles.labelSlot}>Courts</Text>
              <DropDownPicker
                open={openAvailable}
                value={valueAvailable}
                items={courtItems}
                setOpen={setOpenAvailable}
                setValue={setValueAvailable}
                setItems={setItems}
                placeholder={'Select Court'}
                maxHeight={calculatedHeight}
                zIndex={1000}
                zIndexInverse={3000}
                style={styles.dropdownSlot}
                dropDownStyle={styles.dropdownSlot}
              />
              {AddCourtTimingError && availablecourt.Courts === '' && (
                <Text style={styles.errorText}>*Select appropriate values</Text>
              )}
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
                    ? new Date(availablecourt.date).toLocaleDateString('en-GB')
                    : 'Select Date'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                mode="date"
                open={openAvailableDatePicker}
                date={new Date(availablecourt.date)}
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
                  <Text style={styles.legendTextAvailable}>Available</Text>
                </View>
                <View style={styles.legendItemAvailable}>
                  <Image
                    source={IMAGES.SelectedRec}
                    style={styles.iconAvailable}
                  />
                  <Text style={styles.legendTextAvailable}>Selected</Text>
                </View>
                <View style={styles.legendItemAvailable}>
                  <Image source={IMAGES.AvailableRec} style={styles.icon} />
                  <Text
                    style={[
                      styles.legendTextAvailable,
                      styles.noWrapTextAvailable,
                    ]}>
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
                  <Text style={styles.buttonTextCartData}>Unblock Court</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.paymentButtonCartData}
                  onPress={handleblockmodal}>
                  <Text style={styles.buttonTextCartData}>Block Court</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* </Collapsible> */}
            {/* Modal For Create Court */}
            <Modal
              visible={modalOpen}
              transparent={true}
              onRequestClose={() => setModalOpen(false)}
              animationType="slide">
              <View style={styles.modalCreateCourtOverlay}>
                <View style={styles.modalCreateCourtContainer}>
                  <View style={styles.headerCreateCourt}>
                    <Text style={styles.modalCreateCourtText}>
                      Are you sure you want to Create a Court?
                    </Text>
                    <TouchableOpacity onPress={() => setModalOpen(false)}>
                      <Text style={styles.closeCreateCourtButton}>X</Text>
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.headerCreateCourt}>
                    <Text style={styles.modalCreateCourtText}>
                      Are you sure you want to Change Court Status?
                    </Text>
                    <TouchableOpacity
                      onPress={() => setChangestatusmodal(false)}>
                      <Text style={styles.closeCreateCourtButton}>X</Text>
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.headerCreateCourt}>
                    <Text style={styles.modalCreateCourtText}>
                      {addEdit == 'Add'
                        ? 'Are you sure you want to Create a Slot?'
                        : 'Are you sure you want to Update a Slot?'}
                    </Text>
                    <TouchableOpacity onPress={() => setSlotModalOpen(false)}>
                      <Text style={styles.closeCreateCourtButton}>X</Text>
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.headerCreateCourt}>
                    <Text style={styles.modalCreateCourtText}>
                      Cannot create slot as another slot already exists in the
                      chosen time range.
                    </Text>
                    <TouchableOpacity
                      onPress={() => setCreateSlotWarning(false)}>
                      <Text style={styles.closeCreateCourtButton}>X</Text>
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.headerCreateCourt}>
                    <Text style={styles.modalCreateCourtText}>
                      Cannot create slot as an event already exists in the
                      chosen time range.
                    </Text>
                    <TouchableOpacity
                      onPress={() => setCreateEditSlotWarning(false)}>
                      <Text style={styles.closeCreateCourtButton}>X</Text>
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.headerCreateCourt}>
                    <Text style={styles.modalCreateCourtText}>
                      Are you sure you want to block the selected slots?
                    </Text>
                    <TouchableOpacity onPress={() => setblockModalOpen(false)}>
                      <Text style={styles.closeCreateCourtButton}>X</Text>
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.headerCreateCourt}>
                    <Text style={styles.modalCreateCourtText}>
                      Cannot block slot as an blocked slot exists in the chosen
                      time range.
                    </Text>
                    <TouchableOpacity
                      onPress={() => setblockerrorModalOpen(false)}>
                      <Text style={styles.closeCreateCourtButton}>X</Text>
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.headerCreateCourt}>
                    <Text style={styles.modalCreateCourtText}>
                      Are you sure you want to unblock the selected slots?
                    </Text>
                    <TouchableOpacity
                      onPress={() => setunblockModalOpen(false)}>
                      <Text style={styles.closeCreateCourtButton}>X</Text>
                    </TouchableOpacity>
                  </View>
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
                  <View style={styles.headerCreateCourt}>
                    <Text style={styles.modalCreateCourtText}>
                      Cannot unblock slot as an unblocked slot exists in the
                      chosen time range.
                    </Text>
                    <TouchableOpacity
                      onPress={() => setunblockerrorModalOpen(false)}>
                      <Text style={styles.closeCreateCourtButton}>X</Text>
                    </TouchableOpacity>
                  </View>
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
    alignItems: 'center',
    margin: 5,
    padding: 10,
    backgroundColor: '#F9F9F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F9F9F6',
  },
  imageGame: {
    // width: 52,
    // height: 35,
    //padding:5,
    // marginBottom: 10,
  },
  textGame: {
    color: '#192335',
    marginTop: 5,
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
    zIndex: 10,
    borderRadius: 7.5,
  },

  errorText: {
    color: 'red',
    fontFamily: 'Outfit-Regular',
    marginBottom: 20,
  },
  rowSports: {
    justifyContent: 'space-between',
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
  modalCreateCourtText: {
    fontSize: 14,
    textAlign: 'center',
  },
  closeCreateCourtButton: {
    color: 'red',
    fontSize: 16,
  },
  buttonCreateCourtContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonCreateCourt: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelCreateCourtButton: {
    backgroundColor: '#F9F9F9',
  },
  confirmCreateCourtButton: {
    backgroundColor: '#192335',
    borderRadius: 12,
  },
  cancelCreateCourtButtonText: {
    color: '#000',
  },
  confirmCreateCourtButtonText: {
    color: '#FFF',
    padding: 10,
  },

  /* Court Card Details Of Switch */
  cardCourtCard: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    width: Dimensions.get('window').width * 0.9,
  },
  rowCourtCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courtNameCourtCard: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    textTransform: 'uppercase',
  },
  gameTypeCourtCard: {
    paddingTop: 5,
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#097E52',
  },
  priceCourtCard: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
  },
  blockCourtTextCourtCard: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    color: '#757C8D',
    marginRight: 8,
  },
  /* Slot Timing Styles*/
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#FAFAFA',
    borderRadius: 8,
    height: 60,
  },
  labelSlot: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    marginBottom: 8,
    color: '#333',
  },
  dropdownSlot: {
    backgroundColor: '#fafafa',
    borderColor: '#ccc',
    marginBottom: 16,
  },
  datePickerSlot: {
    marginBottom: 16,
  },
  buttonSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  dropDownDate: {
    borderRadius: 12,
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Regular',
    borderColor: COLORS.fieldBorderColor,
    borderWidth: 1,
  },
  buttonTextSlot: {
    color: '#000000',
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
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
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 10,
    fontFamily: 'Outfit-Regular',
    fontSize: 20,
    justifyContent: 'center',
  },
  inputTextSlot: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    marginBottom: 20,
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
  },
  legendItemAvailable: {
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
    marginTop: 20,
  },
  resetButtonCartData: {
    backgroundColor: '#097E52',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '48%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextCartData: {
    fontFamily: 'Outfit-Medium',
    color: COLORS.WHITE,
    fontSize: 18,
  },
  paymentButtonCartData: {
    backgroundColor: '#192335',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 12,
    color: '#097E52',
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
    color: '#192335',
    lineHeight: 22,
  },
  slotPriceSlot: {
    color: '#097E52',
    fontWeight: '500',
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
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

export default CourtScreen;
