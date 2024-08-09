import {collection, getDocs, query, where} from 'firebase/firestore';
import moment from 'moment';
import {db} from '../firebase';
import {
  DeleteData,
  FetchData,
  FetchDataById,
  InsertData,
  UpdateData,
  fetchBulkData,
} from './crud';
import {userData} from './userDetails';
import {getgroundDataById, getreview} from './groundDetails';
import {v4} from 'uuid';

export const createNewBlockEvent = async event_data => {
  try {
    event_data?.map(async (item, Outerindex) => {
      console.log(item, 'item create');
      let ground_data = await FetchDataById('ground_details', item?.ground_id);
      console.log(ground_data, 'ground_data create');
      let user_data = await FetchDataById('user', item?.user_id);
      console.log(user_data, 'user_data create');
      item.ground_name = ground_data?.groundname;
      item.user_name = user_data?.username;
      item.createdAt = new Date();
      item.status = 'Blocked';
      item.owner_id = ground_data?.owner;
      await InsertData('events', item);
    });

    return {status: 'Success'};
  } catch (error) {
    return error;
  }
};

export const getEventdetailsByCourt = async ({
  courtIds,
  order = {key: 'start', dir: 'asc'},
  limitNumber = null,
  otherFilters,
}) => {
  if (!otherFilters) {
    return;
  }
  try {
    if (courtIds != null) {
      let data = await fetchBulkData(
        'events',
        'court_id',
        'in',
        courtIds,
        order,
        limitNumber,
        otherFilters,
      );

      return {status: 'success', data: data};
    } else {
      return {status: 'failure', data: 'No Login User'};
    }
  } catch (error) {
    return {status: 'failure', data: error};
  }
};

export const createNewEvent = async event_data => {
  // let event_data = {
  //     court_id: "CnkVReBw3zCwffn5boL9",
  //     user_id: "5f0oAXJHFaSmKSkpxkzxq8qRwy22",
  //     ground_id: "ZkBMZmjdlvff84hU7srJ",
  //     end: "2024-04-30T06:00",
  //     start: "2024-04-30T05:00",
  //     total_amount: 399,
  //     gametype:'Cricket'
  // }
  try {
    // const currentBookId = v4()
    // console.log(currentBookId,"response","current")
    // const sepfunc = separateConsecutiveSecondElements(event_data)
    // sepfunc?.map(async (item, Outerindex) => {
    event_data?.map(async (item, Outerindex) => {
      const currentBookId = v4();
      item?.map(async innerItem => {
        let ground_data = await FetchDataById(
          'ground_details',
          innerItem?.ground_id,
        );
        let user_data = await FetchDataById('user', innerItem?.user_id);
        let cart_id = innerItem?.cart_id;
        innerItem.ground_name = ground_data?.groundname;
        innerItem.user_name = user_data?.username;
        innerItem.createdAt = new Date();
        innerItem.status = 'Awaiting';
        innerItem.reason = '';
        innerItem.images = ground_data?.coverImage;
        innerItem.owner_id = ground_data?.owner;
        innerItem.BookId = `${currentBookId}-${Outerindex}`;
        delete innerItem.cart_id;
        await InsertData('events', innerItem);
        await removeCartData(cart_id);
      });
    });

    return {status: 'Success'};
  } catch (error) {
    return error;
  }
};

// let ground_data = await FetchDataById("ground_details", item?.ground_id);
// let user_data = await FetchDataById("user", item?.user_id);
// let cart_id = item?.cart_id;
// item.ground_name = ground_data?.groundname;
// item.user_name = user_data?.username;
// item.createdAt = new Date();
// item.status = "Awaiting";
// item.reason = "";
// item.images = ground_data?.coverImage;
// item.owner_id = ground_data?.owner;
// // item.BookId=currentBookId;
// delete item.cart_id;
// await InsertData("events", item);
// await removeCartData(cart_id);
export const getEventdetailsByType = async (
  uid,
  usertype,
  order = {key: 'start', dir: 'asc'},
  limitNumber = null,
  otherFilters,
) => {
  if (!otherFilters) {
    return;
  }
  try {
    const fieldName =
      usertype === 'owner'
        ? 'ground_id'
        : usertype === 'owners'
        ? 'owner_id'
        : 'user_id';
    const fieldValue = uid;
    console.log('fieldName: ', fieldName, fieldValue);
    if (uid != null) {
      let data = await fetchBulkData(
        'events',
        fieldName,
        '==',
        fieldValue,
        order,
        limitNumber,
        otherFilters,
      );

      return {status: 'success', data: data};
    } else {
      return {status: 'failure', data: 'No Login User'};
    }
  } catch (error) {
    return {status: 'failure', data: error};
  }
};

export const getcourtevent = async court_id => {
  try {
    if (court_id != '') {
      let events = await FetchData('events', 'court_id', court_id);
      // const filteredEvent = events?.filter(item => { return new Date(item?.start).toDateString() == new Date(date).toDateString() })
      if (events) {
        // console.log('events', events, 'courtDataBySlot');

        return events;
      } else {
        console.log('!events', 'courtDataBySlot');
        return [];
      }
    } else {
      console.log('!!events', 'courtDataBySlot');

      return [];
    }
  } catch (error) {
    return error;
  }
};

export const updateEventData = async (event_id, updatedata) => {
  updatedata.end = new Date(
    updatedata.end.setHours(updatedata.end.getHours() + 5),
  );
  updatedata.end = new Date(
    updatedata.end.setMinutes(updatedata.end.getMinutes() + 30),
  );
  updatedata.start = new Date(
    updatedata.start.setHours(updatedata.start.getHours() + 5),
  );
  updatedata.start = new Date(
    updatedata.start.setMinutes(updatedata.start.getMinutes() + 30),
  );
  updatedata.end = updatedata?.end.toISOString().slice(0, 16);
  updatedata.start = updatedata?.start.toISOString().slice(0, 16);

  try {
    let result = await UpdateData('events', updatedata, event_id);
    const data = result;
    return data;
  } catch (error) {
    return error;
  }
};

export const changeEventStatus = async (event_id, status) => {
  try {
    console.log("handleupdatestatus", "jj", event_id, status);
    let result = await UpdateData("events", { status: status }, event_id);
    return { data: result, status: "success" };
  } catch (error) {
    return error;
  }
};

export const courtswithoutevents = async (
  targetGroundIds,
  startTime,
  endTime,
) => {
  let collectionRef = collection(db, 'events');
  collectionRef = query(
    collectionRef,
    where('court_id', 'in', targetGroundIds),
  );

  let data;
  try {
    const querySnapshot = await getDocs(collectionRef);
    data = querySnapshot.docs.map(doc => {
      return doc.data();
    });
    let ids = [];
    if (data) {
      data.map(item => {
        if (
          (new Date(item.start) < new Date(startTime) &&
            new Date(item.end) < new Date(startTime)) == false &&
          (new Date(item.start) > new Date(endTime) &&
            new Date(item.end) > new Date(endTime)) == false
        ) {
          ids.push(item.court_id);
        }
      });
    }
    return new Promise(resolve => {
      resolve(ids);
    });
  } catch (error) {
    // console.error('Error getting documents:', e);
    return {status: 'failure', data: error};
  }
};

export const AddCartdata = async cartdata => {
  try {
    let cartData;
    cartdata?.map(async item => {
      await InsertData('Cart', item);
    });
    cartData = await GetcartDataById(
      cartdata[0]?.user_id,
      cartdata[0]?.ground_id,
    );
    Promise.resolve();
    return {status: 'success', data: cartData};
  } catch (error) {
    return error;
  }
};

export const GetcartDataById = async (uid, ground_id) => {
  let cart = await FetchData('Cart', 'user_id', uid);
  let cartData = cart?.filter(item => item.ground_id == ground_id);
  console.log(cartData, 'gtr43');
  const currentDate = new Date();
  let filterdate = [];
  cartData?.map(async item => {
    let date1 = new Date(item?.start);
    let date2 = new Date(currentDate);
    if (Math.abs(date1.getTime() < date2.getTime())) {
      await removeCartData(item?.cart_id);
    } else {
      filterdate.push(item);
    }
  });
  console.log('gtr43', filterdate);

  if (cartData?.length) {
    return cartData;
  } else {
    return [];
  }
};

export const removeCartData = async cartid => {
  try {
    let cart = await DeleteData('Cart', cartid);
  } catch (error) {
    return error;
  }
};

export const updateEventStatus = async (uid, usertype) => {
  try {
    const data = await getEventdetailsByType(uid, usertype);

    const currentDate = new Date();
    data?.data?.forEach(async item => {
      let date1 = new Date(item?.starttime);
      let date2 = new Date(currentDate);
      // date2.setMinutes(0, 0, 0);
      let endDate1 = new Date(item?.endtime);
      // if (Math.abs(date1.getTime() - date2.getTime()) <= 59999) {
      if (Math.abs(date1.getTime() <= date2.getTime())) {
        if (item.status == 'Awaiting') {
          await changeEventStatus(item?.event_id, 'Cancelled');
          console.log('awaiting', 'setInterval11');
        } else if (item.status == 'Accepted') {
          await changeEventStatus(item?.event_id, 'Ongoing');
          console.log('accepted', 'setInterval11');
        }
      }
      if (Math.abs(endDate1.getTime() <= date2.getTime())) {
        if (item.status == 'Ongoing') {
          console.log('gtreee2');
          await changeEventStatus(item?.event_id, 'Completed');
          console.log('ongoing', 'setInterval11');
        }
      }
    });
  } catch (err) {
    return err;
  }
};
export const separateConsecutiveSecondElements = arrayOfObjects => {
  arrayOfObjects.sort((a, b) => a.mapIndexx - b.mapIndexx);
  function extractDate(dateTime) {
    return dateTime.split('T')[0];
  }
  // Initialize the result array
  let result = [];
  let tempGroup = [];

  // Traverse the sorted array and group consecutive elements
  for (let i = 0; i < arrayOfObjects.length; i++) {
    if (tempGroup.length === 0) {
      // Start a new group with the first element
      tempGroup.push(arrayOfObjects[i]);
    } else {
      // Check if the current element is consecutive to the last element in the group

      if (
        arrayOfObjects[i].mapIndexx === arrayOfObjects[i - 1].mapIndexx + 1 &&
        arrayOfObjects[i].gametype === arrayOfObjects[i - 1].gametype &&
        arrayOfObjects[i].court_id === arrayOfObjects[i - 1].court_id &&
        extractDate(arrayOfObjects[i].start) ===
          extractDate(arrayOfObjects[i - 1].start)
      ) {
        // If it is, add it to the current group
        tempGroup.push(arrayOfObjects[i]);
      } else {
        // If it's not, push the current group to the result and start a new group
        result.push(tempGroup);
        tempGroup = [arrayOfObjects[i]];
      }
    }
  }

  if (tempGroup.length > 0) {
    result.push(tempGroup);
  }
  console.log(result, 'result', arrayOfObjects);
  return result;
};
