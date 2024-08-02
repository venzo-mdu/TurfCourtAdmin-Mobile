import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, Dimensions, Modal, Switch } from 'react-native'
import React, { useState, useEffect} from 'react'
import { StyleSheet } from 'react-native';
import { IMAGES } from '../../../../assets/constants/global_images';
import { createNewCourt, getgroundDataById, getGroundslotdata, updatecourt } from '../../../../firebase/firebaseFunction/groundDetails';
import { useRoute, useTheme } from '@react-navigation/native';
import CommonTextInput from '../../../../components/molecules/CommonTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { getcourtevent } from '../../../../firebase/firebaseFunction/eventDetails';

const CourtScreen = () => {
  const [tab, setTab] = useState("Add Court");
  const route = useRoute();
  const { groundID } = route.params || null;
  console.log("groundID Views", groundID)
  const [groundData, setGroundData] = useState();
  const [courtTime, setCourtTime] = useState([]);
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

  console.log("selectedValues", selectedValue)
 // const currentDate = new Date().toISOString().split("T")[0];
 const currentDate = new Date();
  const [availablecourt, setAvailablecourt] = useState({
    Courts: "",
    date: currentDate,
  });

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
  console.log("createSlots", createSlots);
/* Slot Timing States */
  const [openCourtDropdown, setOpenCourtDropdown] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [courtItems, setCourtItems] = useState([]);
  console.log("courtItemsValus", courtItems);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [valueAvailable, setValueAvailable] = useState(null);
  const [items, setItems] = useState([
      {label: 'Apple', value: 'apple'},
      {label: 'Banana', value: 'banana'},
      {label: 'Pear', value: 'pear'},
      {label: "Cricket", value: "w8SLqfDdGeXXnfA74Ckf"}
  ]);
  console.log("valuessssss", value)

  /* GRN DATA FETCH */
  const grndData = async () => {
    if (groundID != null) {
      setLoading(true);
      let groundres = await getgroundDataById(groundID);
      setLoading(false);
      console.log(groundID, "gtrr33");
      setGroundData(groundres);
      setgametype(groundres?.game_type);
      setLoading(true);
      const slotDatas = await getGroundslotdata(groundID);
      setLoading(false);
      console.log(slotDatas, groundres, "slotDatas");

      setCourtslot(slotDatas);
  //    getCourttime(groundres, currentDate);
    } else {
      console.log("grndData2", "check2 ");
    }
  };

  useEffect(() => {
    grndData();
    console.log("gtrr334");
  }, []);

  /* Choose The Game Options */
  const handleGameclick = (value) => {
    let availablegame = createCourt?.gametype;
    if (availablegame?.includes(value)) {
      let subarr = availablegame.filter((item) => item != value);
      setCreateCourt({ ...createCourt, gametype: subarr });
      console.log(subarr, "availablegame");
    } else {
      setCreateCourt((prevData) => ({
        ...prevData,
        gametype: [...(prevData.gametype || []), value],
      }));
      console.log(availablegame, "availablegame");
    }
  };

  /* Handle Add Cart Game Sections */
  const handleAddCourt = async () => {
    console.log("Hi One")
    if (
      createCourt.court_name == "" ||
      createCourt.default_amount == "" ||
      createCourt.gametype.length == 0
    ) {
      setAddCourtError(true);
    } else {
      console.log("Hi Two")
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

      console.log(editcourtdata?.court_id, editcourtdata, "gtre43");
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
    console.log(props, "4", "gtr55");
    console.log(props, "gtr55");
    setSelectcourt(props);
    setChangestatusmodal(true);
  };

  const handleswitchChange = async () => {
    console.log(selectcourt);
    selectcourt.isactive = selectcourt?.isactive ? false : true;
    setLoading(true);
    await updatecourt(selectcourt, selectcourt?.court_id);
    setLoading(false);
    grndData();
    setChangestatusmodal(false);
  };

  /* Handle Court Status Items Edit and Update Function */
  const handleEditCourt = async (item) => {
    console.log("gtre332", item);
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
  console.log("value", value);
  //  value = value.target.value;
      console.log("value123", value);
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
      setAvailablecourt((prev) => ({
        ...prev,
        Courts: value,
      }));
      handleavailablecourt(valueAvailable);
    }
  }, [value, valueAvailable]);


  /* Add Funciton of SLot */
  const handleAddCourtSlot = async () => {
    if (
      selectedValue?.Courts == "" ||
      createSlots?.price == "" ||
      createSlots?.date == "" ||
      createSlots?.starttime == "" ||
      createSlots?.endtime == ""
    ) {
      console.log("Hi123")
      setAddCourtTimingError(true);
    } else {
      setLoading(true);
      console.log("Hi12345")
      console.log("selectedValue?.Courts", selectedValue?.Courts)
      const courtDataBySlot = await getcourtevent(selectedValue?.Courts);
      console.log("courtDataBySlot---------", courtDataBySlot.length)
      setLoading(false);
      const startT = `${createSlots.date}T${createSlots.starttime}`;
      const endT = `${createSlots.date}T${createSlots.endtime}`;
      if (courtDataBySlot.length != 0) {
        console.log("Hi2222", courtDataBySlot)
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


  /* Available Timing Sections */
  const handleavailablecourt = async (value) => {
   // setAvailablecourt({ ...availablecourt, Courts: value });
    console.log("data HandleAvailCOurt123", !_.isEmpty(availablecourt.date) && !_.isEmpty(value))
    if (!_.isEmpty(availablecourt.date) && !_.isEmpty(value)) {
      setAccordionOpen(true);
      setLoading(true);
      const data = await getcourtevent(value?.value);
      console.log("data HandleAvailCOurt", data)
      setLoading(false);
      setEventData(data);
    } else {
      setEventData([]);
      setAccordionOpen(false);
      setLoading(false);
    }
  };

  // const handleavialbleDateChange = async (value) => {
  //   //value = value.target.value;

  //   const today = new Date();
  //   const selectedDate = new Date(value);
  //   today.setHours(0, 0, 0, 0);
  //   selectedDate.setHours(0, 0, 0, 0);

  //   if (selectedDate.getTime() < today.getTime()) {

  //     alert("Please select a future date.");
  //   } else {
  //     console.log("New Values", !_.isEmpty(value) && !_.isEmpty(availablecourt.Courts))
  //     if (!_.isEmpty(value) && !_.isEmpty(availablecourt.Courts)) {
  //       setAccordionOpen(true);
  //       setLoading(true);
  //       const formattedDate = formatDateValues(value);
  //       setAvailablecourt((prevSlots) => ({
  //        ...prevSlots,
  //        date: formattedDate,
  //      }));
  //      // setAvailablecourt({ ...availablecourt, date: value });
  //       console.log('eventss', groundData, value)
  //       getCourttime(groundData, value);
  //       setLoading(false);
  //     } else {
  //       setEventData([]);
  //       setAccordionOpen(false);
  //       setLoading(false);
  //     }
  //   }
  // };



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
        <Text style={styles.buttonTextSlot}> {createSlots.date ? new Date(createSlots.date).toLocaleDateString('en-GB') : 'Select Date'}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={openDatePicker}
        date={new Date(createSlots.date)}
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
       {/* <TouchableOpacity style={styles.buttonSlot} onPress={() => setOpenDatePicker(true)}>
        <Text style={styles.buttonTextSlot}> {availablecourt.date ? new Date(availablecourt.date).toLocaleDateString('en-GB') : 'Select Date'}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={openDatePicker}
        date={new Date(availablecourt.date)}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setOpenDatePicker(false);
          handleavialbleDateChange(date);
        }}
        onCancel={() => {
          setOpenDatePicker(false);
        }}
      /> */}
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
      visible={CreateEditSlotWarning}
      transparent={true}
      onRequestClose={() => setCreateSlotWarning(false)}
      animationType="slide"
    >
      <View style={styles.modalCreateCourtOverlay}>
        <View style={styles.modalCreateCourtContainer}>
          <View style={styles.headerCreateCourt}>
            <Text style={styles.modalCreateCourtText}>
            Cannot create slot as another slot already exists in the chosen
            time range.
            </Text>
            <TouchableOpacity onPress={() => setCreateSlotWarning(false)}>
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
})

export default CourtScreen