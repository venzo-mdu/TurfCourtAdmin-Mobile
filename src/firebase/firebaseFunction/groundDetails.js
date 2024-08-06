import {
  FetchData,
  FetchDataById,
  InsertData,
  UpdateData,
  fetchBulkData,
} from "./crud";
import { storage, db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  setDoc,
  orderBy,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { GeoPoint } from "firebase/firestore";
import { courtswithoutevents, getcourtevent, getEventdetailsByCourt } from "./eventDetails";
import { UpdateUserData, userData } from "./userDetails";
import moment from "moment";
import _ from "lodash";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


const ids = {
  user: "user_id",
  ground_details: "ground_id",
  courts: "court_id",
  masterslot: "slot_id",
  events: "event_id",
  config: "config_id",
  review: "review_id",
  Cart: "cart_id",
};
const GROUND_DETAILS = "ground_details";
const USER = "user";
const COURTS = "courts";
const REVIEW = "review";

export const getallgroundData = async (uid, city, game_type) => {
  let userData;

  try {
    if (uid != null || uid != undefined) {
      userData = await FetchDataById("user", uid);
    }

    let collectionRef = collection(db, GROUND_DETAILS);
    if (city) {
      collectionRef = query(
        collectionRef,
        where("city", "==", city.toLowerCase())
      );
    }

    if (game_type) {
      collectionRef = query(collectionRef, where("game_type", "==", game_type));
    }

    let data;
    let querySnapshot;

    querySnapshot = await getDocs(collectionRef);

    data = querySnapshot.docs.map((doc) => {
      return { [ids[GROUND_DETAILS]]: doc.id, ...doc.data() };
    });

    data.sort((a, b) => a.createdAt - b.createdAt);
    const owner_ids = data.map((d) => d.owner);
    const ground_ids = data.map((d) => d.ground_id);

    let courts = await fetchBulkData(COURTS, "ground_id", "in", ground_ids);

    let reviews = await fetchBulkData(REVIEW, "ground_id", "in", ground_ids);

    let owners = await fetchBulkData(USER, "docid", "in", owner_ids);

    let courtDetailsArray = data?.map((item) => {
      const owner = owners.find((o) => o.user_id === item.owner);

      if (owner && owner.isuseractive === true) {
        item.owner_data = owner;
        if (uid != null || uid != undefined) {
          item.favarote = userData?.favarote?.includes(item?.ground_id);
        }
      }

      let ground_courts = courts?.filter((c) => c.ground_id === item.ground_id);
      let activecourts = ground_courts?.filter((item) => item.isactive);

      let review = consolidateReviews(reviews);

      const minAmount = activecourts.length
        ? activecourts?.reduce(
            (min, current) => Math.min(min, parseInt(current.default_amount)),
            Infinity
          )
        : 0;

      return {
        ...item,
        court_details: activecourts,
        no_of_courts: activecourts?.length,
        starting_amount: minAmount,
        overallRating: review?.overallRating,
        review: review?.review,
      };
    });
    //.filter((item) => item?.court_details && item.court_details.length > 0);

    return { value: courtDetailsArray, status: "success" };
    // return filteredArray;
  } catch (error) {
    console.error("getallgroundData error", error);
    return { value: [], status: "error" };
  }
};

export const cityFilter = async (city, date, game_type) => {
  console.log("cityfilter", "handlefilter", city, date, game_type);

  const table = "ground_details";
  let collectionRef = collection(db, table);
  if (city) {
    collectionRef = query(
      collectionRef,
      where("city", "==", city.toLowerCase())
    );
  }

  if (game_type) {
    collectionRef = query(
      collectionRef,
      where("game_type", "array-contains", game_type)
    );
  }
  let grounds;
  try {
    let querySnapshot;

    querySnapshot = await getDocs(collectionRef);

    grounds = querySnapshot.docs.map((doc) => {
      return { [ids[table]]: doc.id, ...doc.data() };
    });
    console.log(
      grounds,
      "cityfilter",
      querySnapshot,
      collectionRef,
      "handlefilter"
    );
  } catch (e) {
    console.error("Error getting documents:", e);
  }

  let filteredGrounds = grounds;

  if (date) {
    let targetGroundIds = [];
    console.log(filteredGrounds, "filter");
    filteredGrounds?.forEach((item) => {
      item?.court_details?.forEach((court) => {
        if (court.gametype.includes(game_type)) {
          targetGroundIds.push({
            courtId: court.court_id,
            ground: item.ground_id,
            grdtlt: parseInt(
              `${
                ((new Date(`2000-01-01T${item?.end_time}`) -
                  new Date(`2000-01-01T${item?.start_time}`)) /
                  3600000 +
                  24) %
                24
              }`
            ),
          });
        }
      });
    });

    let fullCourtIds = [];
    let fullcourtlength = {};
    await Promise.all(
      targetGroundIds.map(async (item) => {
        let response = await getcourtevent(item.courtId);

        let filterevent = response.filter(
          (item) =>
            item.start.substring(0, 10) == date && item.status != "Cancelled"
        );

        if (item?.grdtlt <= filterevent?.length) {
          fullCourtIds?.push({ court: item?.courtId, ground: item.ground });
          item.ground in fullcourtlength
            ? fullcourtlength[item.ground].push(item?.courtId)
            : (fullcourtlength[item.ground] = [item?.courtId]);
        }
      })
    );

    let result = [];
    if (fullCourtIds.length) {
      filteredGrounds?.forEach(async (item) => {
        let filterCourts = item.court_details.filter((court) =>
          court.gametype.includes(game_type)
        );
        if (
          filterCourts?.length &&
          (fullcourtlength[item.ground_id] == undefined ||
            filterCourts.length != fullcourtlength[item.ground_id].length)
        ) {
          result.push(item.ground_id);
        }
        if (
          fullcourtlength[item.ground_id] != undefined &&
          fullcourtlength[item.ground_id]?.length
        ) {
          fullcourtlength[item.ground_id]?.map(async (court) => {
            const response = await getCourtData(court);
            response.fullCourtDates = response?.fullCourtDates
              ? response?.fullCourtDates.includes(date)
                ? [...response.fullCourtDates]
                : [...response.fullCourtDates, date]
              : [date];
            const res = await updatecourt(response, court);
          });
        }
      });
    } else {
      filteredGrounds?.forEach(async (item) => {
        result.push(item.ground_id);
      });
    }

    filteredGrounds = filteredGrounds.filter((item) =>
      result.includes(item.ground_id)
    );
    return filteredGrounds;
  } else {
    return filteredGrounds;
  }
};

export const locationTimeFilter = async (
  latitude,
  longitude,
  start,
  end,
  distance
) => {
  try {
    distance = parseInt(distance);
    const userLocation = {
      _lat: parseFloat(latitude),
      _long: parseFloat(longitude),
    };
    let grounds = await getallgroundData();
    let filterdata = grounds?.filter((item) => {
      return item.isgroundactive == true;
    });
    let filteredGrounds = filterdata?.filter((ground) => {
      return arePointsNear(ground.location, userLocation, distance);
    });

    if (start && end) {
      let targetGroundIds = [];
      filteredGrounds?.map((item) => {
        item.court_details.map((court) => targetGroundIds.push(court.court_id));
      });

      filteredGrounds = filteredGrounds?.filter((item) => {
        let open = parseInt(item.open.slice(0, 2));
        let close = parseInt(item.close.slice(0, 2));
        let start1 = new Date(start).getHours();
        let end1 = new Date(end).getHours();
        return (
          (start1 >= open && start1 < close) || (end1 > open && end1 < close)
        );
      });

      const eventcourtId = await courtswithoutevents(
        targetGroundIds,
        start,
        end
      );
      let event = [];
      filteredGrounds.map((item) => {
        let court = [];
        item.court_details.map((courts) => {
          if (eventcourtId.includes(courts.court_id)) {
            court.push(courts.court_id);
          }
        });
        if (court.length) {
          event.push({ ground_id: item.ground_id, court_id: court });
        }
      });
      return {
        status: "success",
        data: { locationbased_grd: filteredGrounds, event: event },
      };
    } else {
      return {
        status: "success",
        data: { locationbased_grd: filteredGrounds, event: [] },
      };
    }
  } catch (error) {
    return { status: "failure", data: error };
  }
};

export const getgroundData = async (uid) => {
  try {
    let result = await FetchData("ground_details", ["*"]);
    const filterdata = result?.filter((grd_Data) => {
      return grd_Data?.owner == uid;
    });

    const courtPromises = filterdata?.map(async (item) => {
      const court = await FetchData("courts", "ground_id", item.ground_id);
      let review = await getreview(item.ground_id);

      const minAmount = court.length
        ? court.reduce(
            (min, current) => Math.min(min, parseInt(current.default_amount)),
            Infinity
          )
        : 0;
      return {
        ...item,
        court_details: court,
        no_of_courts: court?.length,
        starting_amount: minAmount,
        overallRating: review?.data?.overallRating,
        review: review?.data?.review,
      };
    });

    const courtDetailsArray = await Promise.all(courtPromises);

    return courtDetailsArray;
  } catch (error) {
    return error;
  }
};

export const getgroundDataById = async (ground_id, user_type, uid) => {
  try {
    let data = await FetchDataById("ground_details", ground_id);
    let user;

    const anotherCollectionData = await FetchDataById("user", data?.owner);
    if (anotherCollectionData && anotherCollectionData.isuseractive == true) {
      data.owner_data = anotherCollectionData;
      if (uid != null || uid != undefined) {
        const userData = await FetchDataById("user", uid);
        data.favarote = userData?.favarote?.includes(data?.ground_id);
      }
    }

    let courts = await FetchData("courts", "ground_id", ground_id);
    let review = await getreview(ground_id);
    let reviewdata = review?.data;
    if (user_type == "user") {
      courts = courts?.filter((item) => item.isactive);
      user = await userData(data?.owner);
      data.grd_ph = user?.phonenumber;
    }
    const minAmount = courts.length
      ? courts?.reduce(
          (min, current) => Math.min(min, parseInt(current.default_amount)),
          Infinity
        )
      : 0;
    data.starting_amount = minAmount;
    data.court_details = courts;
    data.no_of_courts = courts.length;
    data.overallRating = reviewdata.overallRating;
    data.review = reviewdata.review;

    return data;
  } catch (error) {
    return error;
  }
};

export const createGroundData = async (groundData) => {
  try {
    if (groundData?.latitude && groundData?.longitude) {
      groundData.location = new GeoPoint(
        parseFloat(groundData.latitude),
        parseFloat(groundData.longitude)
      );
      groundData.createdAt = new Date();
      delete groundData.latitude;
      delete groundData.longitude;

      const data = await InsertData("ground_details", groundData);
      return data;
    } else {
      return {
        data: null,
        error: "latitude or longitude is not given correctly",
      };
    }
  } catch (error) {
    return error;
  }
};

export const createCity = async (cityname) => {
  try {
    let existingCities = await getallCities();
    let alreadyExxist = existingCities.some(
      (item) => item.cityName == cityname.cityName
    );
    if (!alreadyExxist) {
      const data = await InsertData("cities", cityname);
      return data;
    } else {
      return undefined;
    }
  } catch (err) {
    return err;
  }
};
export const getallCities = async () => {
  try {
    let collectionRef = collection(db, "cities");
    let data;
    let querySnapshot;

    querySnapshot = await getDocs(collectionRef);

    data = querySnapshot.docs.map((doc) => {
      // return { CityId: doc.id, ...doc.data() };
      return doc.data();
    });

    return data;
  } catch (err) {
    return err;
  }
};
export const UpdateGroundData = async (grounddata, ground_id) => {
  try {
    console.log(grounddata, ground_id, "result", "check");
    if (grounddata?.latitude && grounddata?.longitude) {
      grounddata.location = new GeoPoint(
        parseFloat(grounddata.latitude),
        parseFloat(grounddata.longitude)
      );
      delete grounddata.latitude;
      delete grounddata.longitude;
    }
    delete grounddata?.court_details;
    delete grounddata?.owner_data;
    delete grounddata?.review;
    delete grounddata?.overallRating;
    delete grounddata?.starting_amount;
    delete grounddata?.no_of_courts;

    let result = await UpdateData("ground_details", grounddata, ground_id);
    console.log(result, "result", "check");

    return result;
  } catch (error) {
    return error;
  }
};
// const uriToBlob = (uri) => {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.onload = () => {
//       resolve(xhr.response);
//     };
//     xhr.onerror = () => {
//       reject(new Error("uriToBlob failed"));
//     };
//     xhr.responseType = "blob";
//     xhr.open("GET", uri, true);
//     xhr.send(null);
//   });
// };
// export const uploadFile = async (uuid, name, file, bucketName) => {
//   try {
//     const storageRef = ref(storage, `${bucketName}/${uuid}/${name}`);
//     console.log(typeof file, file, "FILE");
//     if (typeof file == "string") {
//       // const blob = new Blob([file], {
//       //   type: 'image/jpeg' // or whatever your Content-Type is
//       // });
//       const blob = uriToBlob(file);
//       var uploadTask = uploadBytesResumable(storageRef, blob);
//     } else {
//       var uploadTask = uploadBytesResumable(storageRef, file);
//     }
//     // const uploadTask = uploadBytesResumable(storageRef, file);
//     return new Promise((resolve, reject) => {
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           console.log(`Upload is ${progress}% done`);
//         },
//         (error) => {
//           console.error(error);
//           reject(error);
//         },
//         async () => {
//           try {
//             const url = await getDownloadURL(uploadTask.snapshot.ref);
//             console.log("File available at", url);
//             resolve(url);
//           } catch (error) {
//             console.error("Error getting download URL:", error);
//             reject(error);
//           }
//         }
//       );
//     });
//   } catch (error) {
//     console.error("Error during image upload:", error);
//     throw error;
//   }
// };

const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = () => {
      reject(new Error('uriToBlob failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

export const uploadFile = async (uuid, name, file, bucketName) => {
  try {
    const storageRef = ref(storage, `${bucketName}/${uuid}/${name}`);
   // console.log("typeof file", typeof file)
    if (typeof file == "string") {
      const blob = await uriToBlob(file);
      var uploadTask = uploadBytesResumable(storageRef, blob);
    } 
    else 
    { 
      //console.log("blob2"); 
      var uploadTask = uploadBytesResumable(storageRef, file); 
    }
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", url);
            resolve(url);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error during image upload:", error);
    throw error;
  }
};

export const deleteFile = async (filename, ground_id) => {
  try {
    var arr = filename.split("/");
    let name = arr[arr?.length - 1].split("?")[0];
    name = name.replaceAll("%2F", "/");

    try {
      const imageRef = ref(storage, name);
      deleteObject(imageRef).then(async () => {
        console.log("Image deleted successfully");
      });
    } catch (error) {
      console.error("Error deleting image:", error.message);
    }
  } catch (error) {
    return error;
  }
};

export const createNewCourt = async (ground_id, court_details) => {
  try {
    court_details.ground_id = ground_id;
    court_details.createdAt = new Date();
    court_details.isactive = true;
    console.log(court_details, "gtrrr");
    const data = await InsertData("courts", court_details);
    return data;
  } catch (err) {
    return err;
  }
};

export const updatecourt = async (courtdata, court_id) => {
  try {
    delete courtdata.court_id;
    let result = await UpdateData("courts", courtdata, court_id);
    return result;
  } catch (err) {
    return err;
  }
};

export const getCourtData = async (court_id) => {
  // let court_id = 'un5RZcbqkqWSxI7GhHSm'
  try {
    const data = await FetchDataById("courts", court_id);
    return data;
  } catch (err) {
    return err;
  }
};

// export const getGroundslotdata = async (ground_id) => {
//   const grounddata = await getgroundDataById(ground_id, "admin");
//   let result = {};
//   if (!grounddata?.court_details) {
//     console.log(result, "trrre");
//     return result;
//   }

//   const promises = grounddata.court_details.map(async (item) => {
//     const courtSlotData = await getcourtslotdata(item?.court_id, "admin");
//     courtSlotData.court_name = item?.court_name;
//     courtSlotData.ground_name = grounddata.groundname;
//     result[item.court_id] = courtSlotData;
//   });
//   await Promise.all(promises);
//   return result;
// };

export const getGroundslotdata = async (ground_details) => {
  const courtIds = ground_details?.court_details?.map((item) => item.court_id);

  const courtSlots = await fetchBulkData(
    "masterslot",
    "court_id",
    "in",
    courtIds,
    { key: "start", order: "asc" },
    null,
    [
      { key: "isActive", operator: "==", value: true },
      {
        key: "start",
        operator: ">=",
        value: moment().format("YYYY-MM-DDTHH:mm"),
      },
    ]
  );

  return ground_details.court_details.reduce((result, item) => {
    const courtSlotData = courtSlots.filter(
      (slot) => slot.court_id === item.court_id
    );
    if (courtSlotData) {
      courtSlotData.court_name = item?.court_name;
      courtSlotData.ground_name = ground_details.groundname;
      courtSlotData.slotData = courtSlotData;
      result[item.court_id] = courtSlotData;
    }
    return result;
  }, {});
};

export const getcourtslotdata = async (court_id, user_type) => {
  try {
    const data = await FetchDataById("courts", court_id);
    const slotData = await FetchData("masterslot", "court_id", court_id);

    slotData.map(async (item) => {
      item.start = new Date(item.start);
      item.end = new Date(item.end);
    });
    const presentStartTime = new Date();
    const filteredSlotData = slotData?.filter(
      (item) => new Date(item.start) >= presentStartTime
    );
    let slotdata = [];
    if (user_type == "user") {
      filteredSlotData.map((item) => {
        let start = new Date(item.start);
        let end = new Date(item.end);
        if (item.end.getDate() != item.start.getDate()) {
          while (start < end) {
            let cur_end = new Date(start.toISOString());
            slotdata.push({
              ...item,
              start: new Date(start),
              end: new Date(
                cur_end.setHours(
                  end.getHours(),
                  end.getMinutes(),
                  end.getSeconds()
                )
              ),
            });
            start.setDate(start.getDate() + 1);
            // start.setHours();
          }
        } else {
          slotdata.push(item);
        }
      });
    } else {
      slotdata = filteredSlotData;
    }

    let eventData = await getcourtevent(court_id);
    if (user_type == "user") {
      eventData = eventData?.filter((item) => item.status != "canceled");
    }
    return {
      slotData: slotdata,
      eventData: eventData,
      default_amount: data?.default_amount,
    };
  } catch (err) {
    return err;
  }
};


export const getCourtsForGround = async (ground_id) => {
  try {
    let courts = await FetchData("courts", "ground_id", ground_id);
    return courts;
  } catch (error) {
    return error;
  }
};

// export const createCourtSlot = async (court_id, slot_details) => {
//   // let solt_details = {
//   //     price: "1000",
//   //     court_id: "6jvTt3n5Md9BHclu1okS",
//   //     end: "2024-01-06T10:19",
//   //     start: "2024-01-04T10:19",
//   // }

//   delete slot_details?.starttime;
//   delete slot_details?.endtime;
//   delete slot_details?.date;

//   slot_details.court_id = court_id;
//   slot_details.createdAt = new Date();
//   slot_details.isActive = true;

//   console.log(slot_details, court_id, "gtrree");

//   let availableSlots = await FetchData("masterslot", "court_id", court_id);

//   const isSlotAvailable = isTimeSlotAvailable(slot_details, availableSlots);

//   console.log(isSlotAvailable, availableSlots, court_id, "createCourtSlot");

//   if (isSlotAvailable) {
//     console.log("slot create", "gtr55");
//     const data = await InsertData("masterslot", slot_details);
//     return { status: "success", data: data };
//   } else {
//     return {
//       status: "failure",
//       data: "Slot overlaps with existing slots. Choose a different time.",
//     };
//   }
// };

// const isTimeSlotAvailable = (newSlot, existingSlots) => {
//   const notSame = existingSlots.filter((item) => {
//     return item.slot_id != newSlot.slot_id;
//   });
//   console.log(newSlot, existingSlots, "updateslotdata", notSame);

//   const newStartTime = new Date(newSlot.start);
//   const newEndTime = new Date(newSlot.end);
//   const isExist = notSame.filter((item) => {
//     return (
//       item.isActive &&
//       (new Date(item.start) < newStartTime &&
//         new Date(item.end) < newStartTime) == false &&
//       (new Date(item.start) > newEndTime && new Date(item.end) > newEndTime) ==
//         false
//     );
//   });
//   console.log(isExist, "updateslotdata", "courtDataBySlot");

//   return isExist.length ? false : true;
// };

export const createCourtSlot = async (court_id, slot_details) => {
  // let solt_details = {
  //     price: "1000",
  //     court_id: "6jvTt3n5Md9BHclu1okS",
  //     end: "2024-01-06T10:19",
  //     start: "2024-01-04T10:19",
  // }

  delete slot_details?.starttime;
  delete slot_details?.endtime;
  delete slot_details?.date;

  slot_details.court_id = court_id;
  slot_details.createdAt = new Date();
  slot_details.isActive = true;

  let availableSlots = await fetchBulkData(
    "masterslot",
    "court_id",
    "in",
    [court_id],
    { key: "start", order: "asc" },
    null,
    [
      { key: "isActive", operator: "==", value: true },
      {
        key: "start",
        operator: ">=",
        value: moment(slot_details.start).format("YYYY-MM-DDTHH:mm"),
      },
      {
        key: "end",
        operator: "<=",
        value: moment(slot_details.end).format("YYYY-MM-DDTHH:mm"),
      },
    ]
  );

  if (availableSlots?.length === 0) {
    const data = await InsertData("masterslot", slot_details);
    return { status: "success", data: data };
  } else {
    return {
      status: "failure",
      data: "Slot overlaps with existing slots. Choose a different time.",
    };
  }
};

const isTimeSlotAvailable = (newSlot, existingSlots) => {
  const notSame = existingSlots.filter((item) => {
    return item.slot_id != newSlot.slot_id;
  });

  const newStartTime = new Date(newSlot.start);
  const newEndTime = new Date(newSlot.end);
  const isExist = notSame.filter((item) => {
    return (
      item.isActive &&
      (new Date(item.start) < newStartTime &&
        new Date(item.end) < newStartTime) == false &&
      (new Date(item.start) > newEndTime && new Date(item.end) > newEndTime) ==
        false
    );
  });

  return isExist.length ? false : true;
};


export const updateslotdata = async (slot_id, slotdata) => {
  // slotdata.start = slotdata?.start;
  // slotdata.end = slotdata?.end;
  try {
    let availableSlots = await FetchData(
      "masterslot",
      "court_id",
      slotdata.court_id
    );
    slotdata.slot_id = slot_id;
    const isSlotAvailable = isTimeSlotAvailable(slotdata, availableSlots);

    console.log(isSlotAvailable, availableSlots, slotdata, "updateCourtSlot");

    if (isSlotAvailable) {
      console.log("slot create", "updateCourtSlot");
      let result = await UpdateData("masterslot", slotdata, slot_id);
      return { status: "success", data: result };
    } else {
      return {
        status: "failure",
        data: "Slot overlaps with existing slots. Choose a different time.",
      };
    }
  } catch (err) {
    return { status: "failure", data: err };
  }
};

// export const deleteSlotDetails = async (slotData) => {
//   const courtDataBySlot = await getcourtevent(slotData.court_id);
//   // console.log(courtDataBySlot, slotData, "courtDataBySlot");
//   if (courtDataBySlot.length != 0) {
//     const courtEvvetns = await getcourtevent(slotData.court_id);
//     // const isSlotAvailable = isTimeSlotAvailable(slotData, courtEvvetns);
//     const newStartTime = new Date(slotData.start);
//     const newEndTime = new Date(slotData.end);
//     const isExist = courtEvvetns.filter((item) => {
//       return (
//         (new Date(item.start) < newStartTime &&
//           new Date(item.end) < newStartTime) == false &&
//         (new Date(item.start) > newEndTime &&
//           new Date(item.end) > newEndTime) == false
//       );
//     });
//     if (!isExist.length) {
//       slotData.isActive = false;
//       const deleteVar = await UpdateData(
//         "masterslot",
//         slotData,
//         slotData.slot_id
//       );
//       console.log("deleteVar", "deleteVar", "courtDataBySlot");
//       return "deleted";
//     } else {
//       return "not deleted";
//     }
//   } else {
//     slotData.isActive = false;
//     const deleteVar = await UpdateData(
//       "masterslot",
//       slotData,
//       slotData.slot_id
//     );
//     console.log("deleteVar", "deleteVar", "courtDataBySlot");
//     return "deleted";
//   }
// };



export const deleteSlotDetails = async (slotData) => {
  try {
    const courtEvents = await getEventdetailsByCourt({
      courtIds: [slotData.court_id],
      otherFilters: [
        { key: "start", operator: ">=", value: slotData.start },
        { key: "end", operator: "<=", value: slotData.end },
      ],
    });

    if (_.isEmpty(courtEvents.data)) {
      slotData.isActive = false;
      const deleteVar = await UpdateData(
        "masterslot",
        slotData,
        slotData.slot_id
      );

      return "deleted";
    } else {
      return "not deleted";
    }
  } catch (err) {
    return err;
  }
};

function arePointsNear(checkPoint, centerPoint, km) {
  var ky = 40000 / 360;
  var kx = Math.cos((Math.PI * centerPoint._lat) / 180.0) * ky;
  var dx = Math.abs(centerPoint._long - checkPoint._long) * kx;
  var dy = Math.abs(centerPoint._lat - checkPoint._lat) * ky;
  var distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= km;
}

export const Createreivew = async (review) => {
  try {
    const availableReview = await getreview(review?.ground_id);
    let filtervalue = availableReview?.data?.review?.filter(
      (item) => item.userId == review?.userId
    );

    let data;
    if (filtervalue && filtervalue.length) {
      data = await UpdateData("review", review, filtervalue[0]?.review_id); //-----
    } else {
      review.createdAt = new Date();
      review.adminreply = "";
      data = await InsertData("review", review);
    }
    return { status: "success", data: data };
  } catch (error) {
    return { status: "failure", data: error };
  }
};

export const consolidateReviews = (data) => {
  let result;
  if (data) {
    const totalReviews = data.length;
    const totalRatings = data.reduce(
      (acc, review) => acc + parseFloat(review.rating),
      0
    );
    const overallRating = totalReviews ? totalRatings / totalReviews : 0;

    const roundedRating = Math.round(overallRating * 2) / 2;

    result = {
      review: data,
      overallRating: roundedRating ? parseFloat(roundedRating.toFixed(1)) : 0,
    };
  } else {
    result = {
      review: data,
      overallRating: 0,
    };
  }

  return result;
};

export const getreview = async (ground_id, data) => {
  try {
    if (!data) {
      data = await FetchData("review", "ground_id", ground_id);
    }

    let result;
    data.sort((a, b) => a.createdAt - b.createdAt);

    if (data) {
      await Promise.all(
        data?.map(async (item) => {
          let userdata = await FetchDataById("user", item?.userId);
          item.user_name = userdata?.username;
          item.profileimg = userdata?.profileimg;
        })
      );

      const totalReviews = data.length;
      const totalRatings = data.reduce(
        (acc, review) => acc + parseFloat(review.rating),
        0
      );
      const overallRating = totalReviews ? totalRatings / totalReviews : 0;

      const roundedRating = Math.round(overallRating * 2) / 2;

      result = {
        review: data,
        overallRating: roundedRating ? parseFloat(roundedRating.toFixed(1)) : 0,
      };
    } else {
      result = {
        review: data,
        overallRating: 0,
      };
    }

    return { status: "success", data: result };
  } catch (error) {
    return { status: "failure", data: error };
  }
};

export const updatereivew = async (review_id, reviewData) => {
  delete reviewData.user_name;
  delete reviewData.review_id;
  try {
    const data = await UpdateData("review", reviewData, review_id);
    return { status: "success", data: data };
  } catch (error) {
    return { status: "failure", data: error };
  }
};

export const getFavGround = async (uid) => {
  try {
    const userdata = await userData(uid);
    const table = "ground_details";
    let collectionRef = collection(db, table);

    collectionRef = query(
      collectionRef,
      where("ground_id", "in", userdata.favarote)
    );

    let querySnapshot = await getDocs(collectionRef);

    let grounds = querySnapshot.docs.map((doc) => {
      let favadd = doc.data();
      favadd.favarote = true;
      console.log("favd", doc.data(), "ff");
      return { [ids[table]]: doc.id, ...favadd };
    });
    console.log("favd", grounds, "ee");
    return grounds;
  } catch (err) {
    return err;
  }
};

export const removefavGround = async (uid, ground_id) => {
  try {
    const userdata = await userData(uid);
    if (userdata) {
      userdata.favarote = userdata.favarote.filter(
        (item) => item !== ground_id
      );
    }

    const updatedata = await UpdateUserData(userdata, uid);
    return updatedata;
  } catch (err) {
    return err;
  }
};
