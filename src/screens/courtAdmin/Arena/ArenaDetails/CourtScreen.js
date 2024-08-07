import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, Dimensions, Modal, Switch, ToastAndroid } from 'react-native'
import React, { useState, useEffect} from 'react'
import { StyleSheet } from 'react-native';
import { IMAGES } from '../../../../assets/constants/global_images';
import { createCourtSlot, createNewCourt, getcourtslotdata, getgroundDataById, getGroundslotdata, updatecourt, updateslotdata } from '../../../../firebase/firebaseFunction/groundDetails';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import CommonTextInput from '../../../../components/molecules/CommonTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { changeEventStatus, createNewBlockEvent, getcourtevent } from '../../../../firebase/firebaseFunction/eventDetails';
import _ from "lodash";
import { getTimeFormatted } from '../../../../utils/getHours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER, USERLOGIN } from '../../..';

const CourtScreen = () => {
  const [tab, setTab] = useState("Add Court");
  const [uid, setUid] = useState([]);
  const route = useRoute();
  const { groundID } = route.params || null;
  const navigation = useNavigation();
  console.log("groundID Views", groundID)
  const [groundData, setGroundData] = useState();
  const [courtTime, setCourtTime] = useState([]);
  console.log("courtTime---", courtTime)
  const [eventData, setEventData] = useState([]);
  const [loader, setLoading] = useState(false);
console.log("CourtScreeen groundData", groundData)
  const [createCourt, setCreateCourt] = useState({
    gametype: [],
    court_name: "",
    default_amount: "",
  });

  const [editcourtdata, setEditcourtdata] = useState();

  const [selectedValue, setSelectedValue] = useState({
    Courts: "",
    selectedEditslot: "",
  });

  //console.log("selectedValues", selectedValue)
 // const currentDate = new Date().toISOString().split("T")[0];
 const currentDate = new Date();
  const [availablecourt, setAvailablecourt] = useState({
    Courts: "",
    date: new Date(),
  });
console.log("availablecourt", availablecourt)
  const [modalOpen, setModalOpen] = useState(false);
  const [AddCourtError, setAddCourtError] = useState(false);
  const [AddCourtTimingError, setAddCourtTimingError] = useState(false);
  const [SlotmodalOpen, setSlotModalOpen] = useState(false);
  const [CreateSlotWarning, setCreateSlotWarning] = useState(false);
  const [CreateEditSlotWarning, setCreateEditSlotWarning] = useState(false);
  const [updateSlotWarning, setupdateSlotWarning] = useState(false);
  const [courtslot, setCourtslot] = useState();
  const tabs = ["Add Court", "Add Court Time", "Available Timings"];
  const [gametype, setgametype] = useState([]);
  //const [blockmodalopen, setblockModalOpen] = useState(false);
  const [blockerrormodalopen, setblockerrorModalOpen] = useState(false);
  const [unblockerrormodalopen, setunblockerrorModalOpen] = useState(false);
  const [unblockmodalopen, setunblockModalOpen] = useState(false);

  
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

  const [changestatusmodal, setChangestatusmodal] = useState(false);
  const [SlotDelWarning, setSlotDelWarning] = useState(false);
  const [SloteditWarning, setSloteditWarning] = useState(false);
  const [addEdit, setAddEdit] = useState("Add");
  const [selectcourt, setSelectcourt] = useState();
  const [OpenSlotRes, setOpenSlotRes] = useState();
  const [SlotToEdit, setSlotToEdit] = useState();
  const [AnchorEl, setAnchorEl] = useState();
  const [AccordionOpen, setAccordionOpen] = useState(false);
  const [createSlots, setCreateslots] = useState({
    price: "",
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
  const [value, setValue] = useState(null);
  const [blockmodalopen, setblockModalOpen] = useState(false);
  const [valueAvailable, setValueAvailable] = useState(null);
  const [items, setItems] = useState([
      {label: 'Apple', value: 'apple'},
      {label: 'Banana', value: 'banana'},
      {label: 'Pear', value: 'pear'},
      {label: "Cricket", value: "w8SLqfDdGeXXnfA74Ckf"}
  ]);
  //console.log("valuessssss", value)


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

  /* GRN DATA FETCH */
  const grndData = async () => {
    if (groundID != null) {
      setLoading(true);
      let groundres = await getgroundDataById(groundID);
      setLoading(false);
      //console.log(groundID, "gtrr33");
      setGroundData(groundres);
      setgametype(groundres?.game_type);
      setLoading(true);
      const slotDatas = await getGroundslotdata(groundID);
      setLoading(false);
      //console.log(slotDatas, groundres, "slotDatas");

      setCourtslot(slotDatas);
      getCourttime(groundres, currentDate);
    } else {
      console.log("grndData2", "check2 ");
    }
  };

  useEffect(() => {
    grndData();
   // console.log("gtrr334");
  }, []);

  /* Choose The Game Options */
  const handleGameclick = (value) => {
    let availablegame = createCourt?.gametype;
    if (availablegame?.includes(value)) {
      let subarr = availablegame.filter((item) => item != value);
      setCreateCourt({ ...createCourt, gametype: subarr });
     // console.log(subarr, "availablegame");
    } else {
      setCreateCourt((prevData) => ({
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
      createCourt.court_name == "" ||
      createCourt.default_amount == "" ||
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
      setLoading(true);
      await updatecourt(editcourtdata, editcourtdata?.court_id);
      setLoading(false);
      setCreateCourt({
        gametype: [],
        court_name: "",
        default_amount: "",
      });
    } else {
      setLoading(true);
      await createNewCourt(groundID, createCourt);
      setLoading(false);
      setCreateCourt({
        gametype: [],
        court_name: "",
        default_amount: "",
      });
    }
    grndData();
    setModalOpen(false);
  };

  /* Handle Switch Change Court Status Funtions */
  
  const handlemodal = async (props) => {
  //  console.log(props, "4", "gtr55");
   // console.log(props, "gtr55");
    setSelectcourt(props);
    setChangestatusmodal(true);
  };

  const handleswitchChange = async () => {
//    console.log(selectcourt);
    selectcourt.isactive = selectcourt?.isactive ? false : true;
    setLoading(true);
    await updatecourt(selectcourt, selectcourt?.court_id);
    setLoading(false);
    grndData();
    setChangestatusmodal(false);
  };

  /* Handle Court Status Items Edit and Update Function */
  const handleEditCourt = async (item) => {
  //  console.log("gtre332", item);
    setEditcourtdata(item);
    setCreateCourt({
      gametype: item?.gametype,
      court_name: item?.court_name,
      default_amount: item?.default_amount,
    });
    //handleChange("Add Court");
  };

  const IOSSwitch = (props) => {
    const { colors } = useTheme();
    return (
      <Switch
        trackColor={{ false: "#767577", true: colors.primary }}
        thumbColor={props.value ? "#f4f3f4" : "#f4f3f4"}
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

  const formatDateValues = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = async (value) => {
  //console.log("value", value);
  //  value = value.target.value;
     // console.log("value123", value);
    const today = new Date();
    const selectedDate = new Date(value);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() < today.getTime()) {
      alert("Please select a future date.");
    } else {
     // setCreateslots({ ...createSlots, date: value });
     const formattedDate = formatDateValues(value);
     setCreateslots((prevSlots) => ({
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
      Alert.alert("Past time is not allowed");
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
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
 /* Got the DropDown Value Of Court Slot */
   useEffect(() => {
    if (groundData?.court_details) {
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
      setSelectedValue((prev) => ({
        ...prev,
        Courts: value,
      }));
    }
    else if(valueAvailable !== null){
      //console.log("valueAvailable",valueAvailable)
      setAvailablecourt((prev) => ({
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
      selectedValue?.Courts == "" ||
      createSlots?.price == "" ||
      createSlots?.date == "" ||
      createSlots?.starttime == "" ||
      createSlots?.endtime == ""
    ) {
    //  console.log("Hi123")
      setAddCourtTimingError(true);
    } else {
      setLoading(true);
      //console.log("Hi12345")
      //console.log("selectedValue?.Courts", selectedValue?.Courts)
      const courtDataBySlot = await getcourtevent(selectedValue?.Courts);
    //  console.log("courtDataBySlot---------", courtDataBySlot.length, courtDataBySlot)
      setLoading(false);
      const startT = `${createSlots.date}T${createSlots.starttime}`;
      const endT = `${createSlots.date}T${createSlots.endtime}`;
      if (courtDataBySlot.length != 0) {
       // console.log("Hi2222", courtDataBySlot)
        const newStartTime = new Date(startT);
        const newEndTime = new Date(endT);
        const isExist = courtDataBySlot.filter((item) => {
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
  };

  const handleCourtslot = async () => {
    createSlots.start = `${createSlots?.date}T${createSlots?.starttime}`;
    createSlots.end = `${createSlots?.date}T${createSlots?.endtime}`;

    createSlots.court_id = selectedValue?.Courts;

    if (
      selectedValue?.selectedEditslot == "" ||
      selectedValue?.selectedEditslot == undefined
    ) {
      setLoading(true);
      const data = await createCourtSlot(
        selectedValue?.Courts,
        createSlots
      );
     // console.log("data Created***11", data);
      setLoading(false);
      if (
        data?.data ==
        "Slot overlaps with existing slots. Choose a different time."
      ) {
        setCreateSlotWarning(true);
      } else {
        setCreateSlotWarning(false);
      }
    } else {
      setLoading(true);
      const update = await updateslotdata(
        selectedValue?.selectedEditslot,
        createSlots
      );
    //  console.log("data updated***11", update);
      setLoading(false);
      if (update.status == "failure") {
        setupdateSlotWarning(true);
      } else {
        setupdateSlotWarning(false);
      }
    }

    setCreateslots({
      price: "",
      date:  new Date(),
      starttime: "",
      endtime: "",
      isActive: true,
    });
    setSelectedValue({ ...selectedValue, Courts: "", selectedEditslot: "" });
    setValue(null);
    grndData();
    setSlotModalOpen(false);
  };



  /* Available Timing Sections */
  const handleavailablecourt = async (value) => {
   // setAvailablecourt({ ...availablecourt, Courts: value });
   // console.log("data HandleAvailCOurt123", !_.isEmpty(availablecourt.date) && !_.isEmpty(value))
    if (!_.isEmpty(availablecourt.date) && !_.isEmpty(value)) {
      setAccordionOpen(true);
      setLoading(true);
      const data = await getcourtevent(value?.value);
      //console.log("data HandleAvailCOurt", data)
      setLoading(false);
      setEventData(data);
    } else {
      setEventData([]);
      setAccordionOpen(false);
      setLoading(false);
    }
  };

  const handleavialbleDateChange = async (value) => {
    //value = value.target.value;
//console.log("HI")
    const today = new Date();
    const selectedDate = new Date(value);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
 //   console.log("HI12", selectedDate)
    if (selectedDate.getTime() < today.getTime()) {
   //   console.log("HI1223", selectedDate.getTime())
      alert("Please select a future date.");
    } else {
      const formattedDate = formatDateValues(value);
      //console.log("formattedDate", formattedDate, availablecourt.Courts, value)
      console.log("New Values", !_.isEmpty(formattedDate) && !_.isEmpty(availablecourt.Courts))
      if (!_.isEmpty(formattedDate) && !_.isEmpty(availablecourt.Courts)) {
        //console.log("HI123", availablecourt)
        setAccordionOpen(true);
        setLoading(true);
     
        setAvailablecourt((prevSlots) => ({
         ...prevSlots,
         date: formattedDate,
       }));
       // setAvailablecourt({ ...availablecourt, date: value });
        //console.log('eventss', groundData, value)
        getCourttime(groundData, formattedDate);
        setLoading(false);
      } else {
        setEventData([]);
        setAccordionOpen(false);
        setLoading(false);
      }
    }
  };

  const getCourttime = (groundData, date) => {
    let start;
    let end;
console.log("groundData Data111", groundData, typeof date, date, "eventss")
    if (typeof date === "object") {
      start = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${
        groundData?.start_time
      }`;
      end = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${
        groundData?.end_time
      }`;
    } else {
      start = `${date}T${groundData?.start_time}`;
      end = `${date}T${groundData?.end_time}`;
    }

    let daystart = new Date(start);
    let dayend = new Date(end);

    let hourdiff = ((dayend - daystart) / (1000 * 60 * 60)).toFixed(1);
console.log("days hourdiff", daystart, dayend, hourdiff, 'eventss')
    let eventss = [];
    let starttime = daystart;

    for (let j = 0; j < hourdiff; j++) {
      let en;

      en = {
        backgroundColor: "#fff",
        bordercolor: "#339A49",
        textColor: "#339A49",
        zIndex: "1",
        selected: false,
        isbooked: false,
        isblocked: false,
      };
      en.start = new Date(starttime.getTime() + 1);
      en.end = new Date(starttime.getTime() + 60 * 60 * 1000);
      eventss.push(en);
console.log("eventss", en, 'Hi')
      starttime = new Date(en.end.getTime() + 1);
    }
    eventss?.map(
      (court) =>
        eventData.length &&
        eventData?.map((event) => {
          let date1 = new Date(event?.start);
          let date2 = new Date(court?.start);
          if (
            Math.abs(date1.getTime() - date2.getTime()) <= 1000 &&
            event.status == "Blocked"
          ) {
            court.isblocked = true;
            court.backgroundColor = "#EEF0F3";
            court.textColor = "#ff0000";
            court.bordercolor = "#ff0000";
          } else if (
            Math.abs(date1.getTime() - date2.getTime()) <= 1000 &&
            event.status != "Canceled" &&
            event.status != "Cancelled" &&
            event.status != "Unblocked"
          ) {
            court.isbooked = true;
            court.backgroundColor = "#EEF0F3";
            court.textColor = "#64627C";
            court.bordercolor = "#64627C";
          }
        })
    );
    let eventarr = eventss.map((element, index) => {
      if (
        new Date(element.start).getHours() == new Date().getHours() &&
        new Date(element.start).getDate() == new Date().getDate()
      ) {
        element = {
          ...element,

          color: "#FFF",
          backgroundColor: "#FFF",
          bordercolor: "#00b4d8",
          textColor: "#00b4d8",
        };

        return element;
      } else {
        return element;
      }
    });
    console.log("eventss", eventarr)

    setCourtTime(eventarr);
  };


  
  const handlebooking = (value, index) => {
    const updatedCourtTime = [...courtTime];

    const currentTime = new Date();
    const currentTimehour = new Date().getHours();
    if (value.start <= new Date().getHours()) {
      alert("This booking time has already passed.");
      return;
    } else {
      if (value.isblocked) {
        updatedCourtTime[index] = {
          ...updatedCourtTime[index],
          mapIndex: index,
          selected: !updatedCourtTime[index].selected,
          color: !updatedCourtTime[index].selected ? "#FFF" : "#ff0000",
          bordercolor: !updatedCourtTime[index].selected
            ? "#339A49"
            : "#ff0000",
          backgroundColor: !updatedCourtTime[index].selected
            ? "#339A49"
            : "#EEF0F3",
          textColor: !updatedCourtTime[index].selected ? "#FFF" : "#ff0000",
        };
      } else {
        updatedCourtTime[index] = {
          ...updatedCourtTime[index],
          mapIndex: index,
          selected: !updatedCourtTime[index].selected,
          color: !updatedCourtTime[index].selected ? "#FFF" : "#339A49",
          bordercolor: !updatedCourtTime[index].selected
            ? "#339A49"
            : "#339A49",
          backgroundColor: !updatedCourtTime[index].selected
            ? "#339A49"
            : "#FFF",
          textColor: !updatedCourtTime[index].selected ? "#FFF" : "#339A49",
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
    let data = courtTime?.filter((item) => item?.selected == true);
    if (
      availablecourt?.Courts != "" &&
      availablecourt?.date != "" &&
      data.length != 0
    ) {
      availablecourt.selectedSlot = data;
      let Addcartdatas = [];
      const courtDetails = groundData?.court_details?.filter(
        (item) => item.court_id == availablecourt?.Courts
      );
      availablecourt.courtDetails = courtDetails;
      let courtNo;
      console.log("availablecourt- COurtDetails",courtDetails, availablecourt)
      if (typeof availablecourt?.Courts.match(/\d+/g) == null) {
        courtNo = availablecourt?.Courts.match(/\d+/g).join("");
      } else {
        courtNo = stringToAlphabetPositions(
          availablecourt?.Courts.slice(0, 5)
        );
      }
      console.log("courtNo", courtNo);
      let courtslot = await getcourtslotdata(
        availablecourt?.Courts,
        "user"
      );

      data.forEach((slot) => {
        let cartItem = {
          court_id: availablecourt?.Courts,
          court_name: courtDetails[0]?.court_name,
          ground_id: courtDetails[0]?.ground_id,
          user_id: uid,
          // amount: courtDetails[0]?.default_amount,
          start: `${availablecourt?.date}T${new Date(
            slot.start
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}`,
          end: `${availablecourt?.date}T${new Date(slot.end).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", hour12: false }
          )}`,
        };
        let currentslot = courtslot?.slotData?.find((item) => {
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
      const promises = Addcartdatas.map(async (item) => {
        let dat = await getcourtevent(item.court_id);
        let bookedData = dat?.filter((data) => data?.start === item.start);

        return bookedData;
      });
      const results = await Promise.all(promises);
      bookedDataList = results.flat();
console.log("results", results)
      const response = await createNewBlockEvent(Addcartdatas);
console.log("response handle Booking", response)
      if (response?.status == "Success") {
        setblockModalOpen(false);
        handleReset();
        ToastAndroid.show("Blocking Success");

        grndData();
        //setblockModalOpen(false);
      } else {
        toast.error("Blocking Failed", {
          position: "top-right",
          autoClose: 2000,
        });
        console.error("book fail");
      }
      // }
    }
  };

  const handleblockmodal = () => {
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }
    let data = courtTime?.filter((item) => item?.selected == true);
    let blockeddata = data?.filter((item) => item?.isblocked == true);

    if (
      availablecourt?.Courts != "Select court" &&
      availablecourt?.date != "" &&
      // availablecourt?.gameType != "Select game" &&
      data.length != 0
    ) {
      if (blockeddata?.length) {
        setblockerrorModalOpen(true);
      } else {
        setblockModalOpen(true);
      }
    } else {
      console.error("select appropriate values");
    }
  };

  const handleunblockmodal = () => {
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }

    let data = courtTime?.filter((item) => item?.selected == true);
    let unblockeddata = data?.filter((item) => item?.isblocked == false);

    if (
      availablecourt?.Courts != "Select court" &&
      availablecourt?.date != "" &&
      // availablecourt?.gameType != "Select game" &&
      data.length != 0
    ) {
      if (unblockeddata?.length) {
        setunblockerrorModalOpen(true);
      } else {
        setunblockModalOpen(true);
      }
    } else {
      console.error("select appropriate values");
    }
  };


  const handleUnblock = async () => {
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }
    let data = courtTime?.filter((item) => item?.selected == true);
    if (
      availablecourt?.Courts != "" &&
      availablecourt?.date != "" &&
      data.length != 0
    ) {
      availablecourt.selectedSlot = data;
      let Addcartdatas = [];
      const courtDetails = groundData?.court_details?.filter(
        (item) => item.court_id == availablecourt?.Courts
      );
      availablecourt.courtDetails = courtDetails;
      let courtNo;
      if (typeof availablecourt?.Courts.match(/\d+/g) == null) {
        courtNo = availablecourt?.Courts.match(/\d+/g).join("");
      } else {
        courtNo = stringToAlphabetPositions(
          availablecourt?.Courts.slice(0, 5)
        );
      }
      let courtslot = await getcourtslotdata(
        availablecourt?.Courts,
        "user"
      );

      data.forEach((slot) => {
        let cartItem = {
          court_id: availablecourt?.Courts.value,
          court_name: courtDetails[0]?.court_name,
          ground_id: courtDetails[0]?.ground_id,
          user_id: uid,
          // amount: courtDetails[0]?.default_amount,
          start: `${availablecourt?.date}T${new Date(
            slot.start
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}`,
          end: `${availablecourt?.date}T${new Date(slot.end).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", hour12: false }
          )}`,
        };
        let currentslot = courtslot?.slotData?.find((item) => {
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
      const promises = Addcartdatas.map(async (item) => {
        let dat = await getcourtevent(item.court_id);
        let bookedData = dat?.filter((data) => data?.start === item.start);

        return bookedData;
      });
      const results = await Promise.all(promises);
      bookedDataList = results.flat();

      const mapcosnt = bookedDataList.map(async (datum) => {
        await changeEventStatus(datum?.event_id, "Unblocked");
      });

      if (mapcosnt?.length) {
        handleReset();
        toast.success("Unblocking Success", {
          position: "top-right",
          autoClose: 2000,
        });
        grndData();
        setunblockModalOpen(false);
      } else {
        toast.error("Unblocking Failed", {
          position: "top-right",
          autoClose: 2000,
        });
        setunblockModalOpen(false);
        console.error("Unblocking fail");
      }
      // }
    }
  };

  const handleReset = () => {
    setAvailablecourt({
      Courts: "",
      date: currentDate,
    });

    setAccordionOpen(false);
    setCourtTime([]);
  };

  function charToAlphabetPosition(char) {
    // Convert a single character to its alphabetical position
    return char.toLowerCase().charCodeAt(0) - "a".charCodeAt(0) + 1;
  }

  function stringToAlphabetPositions(inputString) {
    // Convert the string to lowercase and split into individual characters
    inputString = inputString.toLowerCase();

    // Convert each character to its alphabetical position and concatenate them
    let result = "";
    for (let i = 0; i < inputString.length; i++) {
      if (inputString[i].match(/[a-z]/)) {
        result += charToAlphabetPosition(inputString[i]);
      }
    }
    return Number(result);
  }


  const CourtCard = ({ item, handlemodal, handleEditCourt }) => {
    const { colors } = useTheme();
  
    return (
      <View style={[styles.cardCourtCard, { backgroundColor: colors.card }]}>
        <View style={styles.rowCourtCard}>
          <View>
            <Text style={styles.courtNameCourtCard}>{item.court_name}</Text>
            <Text style={styles.gameTypeCourtCard}>
              {item.gametype.join(' | ')}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleEditCourt(item)}>
            <Icon name="ellipsis-v" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={[styles.rowCourtCard, { paddingTop: 40 }]}>
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

  const renderItemGame = ({ item }) => (
    <View style={styles.itemContainerGame}>
      <TouchableOpacity onPress={() => handleGameclick(item)}>
        <Image style={styles.imageGame} source={iconsss[item]} />
        <Text style={styles.textGame}>{item.replace("_", " ")}</Text>
        {createCourt?.gametype?.includes(item) && (
          <Image source={IMAGES.TickIcons} style={styles.tickGame} />
        )}
      </TouchableOpacity>
    </View>
  );


  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View>
        <FlatList
          data={gametype}
          renderItem={renderItemGame}
          keyExtractor={(item) => item}
          numColumns={3}
          columnWrapperStyle={styles.rowGame}
        />
        {AddCourtError && createCourt.gametype === "" && (
            <Text style={styles.errorText}>*Select appropriate values</Text>
          )}
        </View>
        <View>
        <View>
          <CommonTextInput
            label="Court Name"
            value={createCourt?.court_name}
            onChangeText={(text) => setCreateCourt({ ...createCourt, court_name: text })}
            //widthStyle={true}
          />
          {AddCourtError && createCourt.court_name === "" && (
            <Text style={styles.errorText}>*Enter appropriate values</Text>
          )}
        </View>
        <View>
          <CommonTextInput
            label="Default price"
            value={createCourt?.default_amount}
            onChangeText={(text) => setCreateCourt({ ...createCourt, default_amount: text })}
           // widthStyle={true}
          />
          {AddCourtError && createCourt.default_amount === "" && (
            <Text style={styles.errorText}>*Enter appropriate values</Text>
          )}
        </View>
        <TouchableOpacity
        style={styles.addButtonRule}
        onPress={handleAddCourt}
      >
        <Text style={styles.addButtonTextRule}>Add</Text>
      </TouchableOpacity>
      </View>
      <View >
      {groundData?.court_details?.map((item) => (
        <CourtCard
          key={item.id}
          item={item}
          handlemodal={handlemodal}
          handleEditCourt={handleEditCourt}
        />
      ))}
    </View>
    <View>
    <Text style={styles.labelSlot}>Add Slot Timing</Text>
    </View>
    <View>
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
                />
      {AddCourtTimingError && selectedValue.Courts === "" && (
        <Text style={styles.errorText}>*Select appropriate values</Text>
      )}

      <CommonTextInput
        label="Price"
        value={createSlots.price}
        onChangeText={(text) => setCreateslots({ ...createSlots, price: text })}
        widthStyle={false}
      />
      {AddCourtTimingError && createSlots.price === "" && (
        <Text style={styles.errorText}>*Enter appropriate values</Text>
      )}

      <Text style={styles.labelSlot}>Date</Text>
      {/* <DatePicker
        date={createSlots.date}
        onDateChange={handleDateChange}
        minimumDate={new Date()}
        mode="date"
        style={styles.datePickerSlot}
      /> */}
       <TouchableOpacity style={styles.buttonSlot} onPress={() => setOpenDatePicker(true)}>
        <Text style={styles.buttonTextSlot}> {createSlots.date ? createSlots.date  ? new Date(createSlots.date).toLocaleDateString('en-GB') : new Date(createSlots.createdAt).toLocaleDateString('en-GB') : 'Select Date'}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={openDatePicker}
        date={createSlots.date ? new Date(createSlots.date) :  new Date(createSlots.createdAt)}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setOpenDatePicker(false);
          handleDateChange(date);
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
      />
       {/* <Text style={styles.labelSlot}>Start Timing</Text>
      <TouchableOpacity style={styles.inputSlotDateView} onPress={() => setOpenStartPicker(true)}>
        <Text style={styles.inputSlotText}>{createSlots.starttime ? formatTimeSlot(createSlots.starttime) : 'Select Time'}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openStartPicker}
        date={createSlots.starttime}
        mode="time"
        onConfirm={(date) => {
          setOpenStartPicker(false);
          handleTimeChange('starttime', date);
        }}
        onCancel={() => {
          setOpenStartPicker(false);
        }}
      />
      {AddCourtTimingError && !createSlots.starttime && (
        <Text style={styles.errorText}>*Enter start time</Text>
      )}

      <Text style={styles.labelSlot}>End Timing</Text>
      <TouchableOpacity style={styles.inputSlotDateView} onPress={() => setOpenEndPicker(true)}>
        <Text style={styles.inputSlotText}>{createSlots.endtime ? formatTimeSlot(createSlots.endtime) : 'Select Time'}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openEndPicker}
        date={createSlots.endtime}
        mode="time"
        onConfirm={(date) => {
          setOpenEndPicker(false);
          handleTimeChange('endtime', date);
        }}
        onCancel={() => {
          setOpenEndPicker(false);
        }}
      />
      {AddCourtTimingError && !createSlots.endtime && (
        <Text style={styles.errorText}>*Enter end time</Text>
      )} */}
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
                  onConfirm={date => {
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
                  onConfirm={date => {
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
      <View>
      <TouchableOpacity
        style={styles.addButtonRule}
        onPress={handleAddCourtSlot}
      >
        <Text style={styles.addButtonTextRule}>Add</Text>
      </TouchableOpacity>
      </View>
     
    </View>
    <View>
    <Text style={styles.labelSlot}>Available Timing</Text>
    </View>
    <View>
    <Text style={styles.labelSlot}>Courts</Text>
      <DropDownPicker
                    open={open}
                    value={valueAvailable}
                    items={courtItems}
                    setOpen={setOpen}
                    setValue={setValueAvailable}
                    setItems={setItems}
                    placeholder={'Select Court'}
                />
      {AddCourtTimingError && availablecourt.Courts === "" && (
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
       <TouchableOpacity style={styles.buttonSlot} onPress={() => setOpenAvailableDatePicker(true)}>
        <Text style={styles.buttonTextSlot}> {availablecourt.date ? new Date(availablecourt.date).toLocaleDateString('en-GB') : 'Select Date'}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={openAvailableDatePicker}
        date={new Date(availablecourt.date)}
        minimumDate={new Date()}
        onConfirm={(date) => {
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
                onPress={() => handlebooking(item, index)}
              >
                <Text style={{ color: item?.textColor }}>{gttime.Time}</Text>
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
          <Image source={IMAGES.BookedRec} style={styles.iconAvailable} />
          <Text style={styles.legendTextAvailable}>Booked</Text>
        </View>
        <View style={styles.legendItemAvailable}>
          <Image source={IMAGES.AvailableRec} style={styles.iconAvailable} />
          <Text style={styles.legendTextAvailable}>Available</Text>
        </View>
        <View style={styles.legendItemAvailable}>
          <Image source={IMAGES.SelectedRec} style={styles.iconAvailable} />
          <Text style={styles.legendTextAvailable}>Selected</Text>
        </View>
        <View style={styles.legendItemAvailable}>
          <Image source={IMAGES.AvailableRec} style={styles.icon} />
          <Text style={[styles.legendTextAvailable, styles.noWrapTextAvailable]}>Current slot</Text>
        </View>
        <View style={styles.legendItemAvailable}>
          <Image source={IMAGES.BlockedRec} style={styles.iconAvailable} />
          <Text style={[styles.legendTextAvailable, styles.noWrapTextAvailable]}>Blocked slot</Text>
        </View>
      </View>

      <View style={styles.footerButtonsCartData}>
            <TouchableOpacity
              style={styles.resetButtonCartData}
              onPress={handleunblockmodal}
            >
              <Text style={styles.buttonTextCartData}>UnBlock Court</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentButtonCartData}
              onPress={handleblockmodal}
            >
              <Text style={styles.buttonTextCartData}>Block Court</Text>
            </TouchableOpacity>
          </View>
        
    </View>

{/* Modal For Create Court */}
<Modal
      visible={modalOpen}
      transparent={true}
      onRequestClose={() => setModalOpen(false)}
      animationType="slide"
    >
      <View style={styles.modalCreateCourtOverlay}>
        <View style={styles.modalCreateCourtContainer}>
          {/* <View style={styles.headerCreateCourt}> */}
            <Text style={styles.modalCreateCourtText}>
              Are you sure you want to Create a Court?
            </Text>
            <TouchableOpacity onPress={() => setModalOpen(false)}>
              <Text style={styles.closeCreateCourtButton}>X</Text>
            </TouchableOpacity>
          {/* </View> */}
          <View style={styles.buttonCreateCourtContainer}>
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
          </View>
        </View>
      </View>
    </Modal>
    <Modal
      visible={changestatusmodal}
      transparent={true}
      onRequestClose={() => setChangestatusmodal(false)}
      animationType="slide"
    >
      <View style={styles.modalCreateCourtOverlay}>
        <View style={styles.modalCreateCourtContainer}>
          <View style={styles.headerCreateCourt}>
            <Text style={styles.modalCreateCourtText}>
                Are you sure you want to Change Court Status?
            </Text>
            <TouchableOpacity onPress={() => setChangestatusmodal(false)}>
              <Text style={styles.closeCreateCourtButton}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonCreateCourtContainer}>
            <TouchableOpacity
              style={[styles.buttonCreateCourt, styles.cancelCreateCourtButton]}
              onPress={() => setChangestatusmodal(false)}
            >
              <Text style={styles.cancelCreateCourtButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmCreateCourtButton]}
              onPress={handleswitchChange}
            >
              <Text style={styles.confirmCreateCourtButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <Modal
      visible={SlotmodalOpen}
      transparent={true}
      onRequestClose={() => setSlotModalOpen(false)}
      animationType="slide"
    >
      <View style={styles.modalCreateCourtOverlay}>
        <View style={styles.modalCreateCourtContainer}>
          <View style={styles.headerCreateCourt}>
            <Text style={styles.modalCreateCourtText}>
            {addEdit == "Add"
                ? "Are you sure you want to Create a Slot?"
                : "Are you sure you want to Update a Slot?"}
            </Text>
            <TouchableOpacity onPress={() => setSlotModalOpen(false)}>
              <Text style={styles.closeCreateCourtButton}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonCreateCourtContainer}>
            <TouchableOpacity
              style={[styles.buttonCreateCourt, styles.cancelCreateCourtButton]}
              onPress={() => setSlotModalOpen(false)}
            >
              <Text style={styles.cancelCreateCourtButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmCreateCourtButton]}
              onPress={handleCourtslot}
            >
              <Text style={styles.confirmCreateCourtButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <Modal
      visible={CreateSlotWarning}
      transparent={true}
      onRequestClose={() => setCreateSlotWarning(false)}
      animationType="slide"
    >
      <View style={styles.modalCreateCourtOverlay}>
        <View style={styles.modalCreateCourtContainer}>
          {/* <View style={styles.headerCreateCourt}> */}
          <TouchableOpacity onPress={() => setCreateSlotWarning(false)}>
              <Text style={styles.closeCreateCourtButton}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalCreateCourtText}>
            Cannot create slot as another slot already exists in the chosen
            time range.
            </Text>
           
          {/* </View> */}
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
      animationType="slide"
    >
      <View style={styles.modalCreateCourtOverlay}>
        <View style={styles.modalCreateCourtContainer}>
          <View style={styles.headerCreateCourt}>
            <Text style={styles.modalCreateCourtText}>
            Cannot create slot as an event already exists in the chosen time
            range.
            </Text>
            <TouchableOpacity onPress={() => setCreateEditSlotWarning(false)}>
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
      animationType="slide"
    >
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
              style={[styles.buttonCreateCourt, styles.cancelCreateCourtButton]}
              onPress={() => setblockModalOpen(false)}
            >
              <Text style={styles.cancelCreateCourtButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmCreateCourtButton]}
              onPress={handleblock}
            >
              <Text style={styles.confirmCreateCourtButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <Modal
      visible={blockerrormodalopen}
      transparent={true}
      onRequestClose={() => setblockerrorModalOpen(false)}
      animationType="slide"
    >
      <View style={styles.modalCreateCourtOverlay}>
        <View style={styles.modalCreateCourtContainer}>
          <View style={styles.headerCreateCourt}>
            <Text style={styles.modalCreateCourtText}>
            Cannot block slot as an blocked slot exists in the chosen time
              range.
            </Text>
            <TouchableOpacity onPress={() => setblockerrorModalOpen(false)}>
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
      animationType="slide"
    >
      <View style={styles.modalCreateCourtOverlay}>
        <View style={styles.modalCreateCourtContainer}>
          <View style={styles.headerCreateCourt}>
            <Text style={styles.modalCreateCourtText}>
            Are you sure you want to unblock the selected slots?
            </Text>
            <TouchableOpacity onPress={() => setunblockModalOpen(false)}>
              <Text style={styles.closeCreateCourtButton}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonCreateCourtContainer}>
            <TouchableOpacity
              style={[styles.buttonCreateCourt, styles.cancelCreateCourtButton]}
              onPress={() => setunblockModalOpen(false)}
            >
              <Text style={styles.cancelCreateCourtButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmCreateCourtButton]}
              onPress={handleUnblock}
            >
              <Text style={styles.confirmCreateCourtButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <Modal
      visible={unblockerrormodalopen}
      transparent={true}
      onRequestClose={() => setunblockerrorModalOpen(false)}
      animationType="slide"
    >
      <View style={styles.modalCreateCourtOverlay}>
        <View style={styles.modalCreateCourtContainer}>
          <View style={styles.headerCreateCourt}>
            <Text style={styles.modalCreateCourtText}>
            Cannot unblock slot as an unblocked slot exists in the chosen time
            range.
            </Text>
            <TouchableOpacity onPress={() => setunblockerrorModalOpen(false)}>
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
    width: 52,
    height: 35,
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
    width:100,
    alignSelf:'center'
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
    fontSize: 18,
    cursor: 'pointer',
    textAlign: 'right',
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
    borderRadius:12
  },
  cancelCreateCourtButtonText: {
    color: '#000',
  },
  confirmCreateCourtButtonText: {
    color: '#FFF',
    padding:10,
    
  },

  /* Court Card Details Of Switch */
  cardCourtCard: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: Dimensions.get('window').width * 0.9,
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
    fontSize: 16,
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
  buttonTextSlot: {
    color: '#000000',
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
    flexBasis: '30%', // This makes the buttons take up roughly a third of the width
    margin: 5, // Adds padding between buttons
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
    alignItems: 'center',
  },
  paymentButtonCartData: {
    backgroundColor: '#192335',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
  },

})

export default CourtScreen