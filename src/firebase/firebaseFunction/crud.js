import {tab} from '@testing-library/user-event/dist/tab';
// import { database, db } from "../../firebase";
// import { Database,db } from "firebase/database";
import {database, db} from '../firebase';
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
  documentId,
} from 'firebase/firestore';

const ids = {
  user: 'user_id',
  ground_details: 'ground_id',
  courts: 'court_id',
  masterslot: 'slot_id',
  events: 'event_id',
  config: 'config_id',
  review: 'review_id',
  Cart: 'cart_id',
};

const fetchBulkData = async (
  table,
  filter_key,
  operator,
  filter_value,
  order = null,
  limitNumber = null,
  otherFilters,
  countOnly = false,
) => {
  try {
    let collectionRef = collection(db, table);

    if (filter_key && operator && filter_value) {
      collectionRef = query(
        collectionRef,
        where(
          filter_key === 'docid' ? documentId() : filter_key,
          operator,
          filter_value,
        ),
      );
    }

    otherFilters = _.compact(otherFilters);
    if (otherFilters?.length > 0) {
      otherFilters?.forEach(filterData => {
        collectionRef = query(
          collectionRef,
          where(
            filterData.key === 'docid' ? documentId() : filterData.key,
            filterData.operator,
            filterData.value,
          ),
        );
      });
    }

    if (order) {
      collectionRef = query(
        collectionRef,
        orderBy(order.key, order.dir || 'asc'),
      );
    }

    if (limitNumber) {
      collectionRef = query(collectionRef, limit(limitNumber));
    }

    let querySnapshot;
    if (countOnly) {
      const snapshot = await getCountFromServer(collectionRef);
      console.log('count: ', snapshot.data().count);
      return snapshot.data().count;
    } else {
      querySnapshot = await getDocs(collectionRef);

      let data = querySnapshot.docs.map(doc => {
        return {[ids[table]]: doc.id, ...doc.data()};
      });

      return data;
    }
  } catch (e) {
    console.error('Error getting documents:', e);
  }
};

const FetchData = async (
  table,
  filter_key,
  filter_value,
  requiredFields = [],
) => {
  let collectionRef = collection(db, table);
  //  collectionRef = query(collection(db, table), orderBy('fieldName', 'desc'));
  if (filter_key && filter_value) {
    collectionRef = query(collectionRef, where(filter_key, '==', filter_value));
  }

  let data;
  try {
    let querySnapshot;
    //     if(table == 'ground_details' || table == 'events' || table == 'courts'){
    //        querySnapshot = await getDocs(query(collectionRef, orderBy('createdAt','desc')));
    //     }
    // else{
    querySnapshot = await getDocs(collectionRef);
    // }
    data = querySnapshot.docs.map(doc => {
      return {[ids[table]]: doc.id, ...doc.data()};
    });
  } catch (e) {
    console.error('Error getting documents:', e);
  }
  return data;
};

const FetchDataById = async (table, docid) => {
  const docRef = doc(db, table, docid);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {[ids[table]]: docSnap.id, ...docSnap.data()};
    } else {
      console.log('No such document!');
      // 12-01
      return {status: 'failure'};
      //
    }
  } catch (e) {
    console.error('Error  getting document:', e);
  }
};

const InsertData = async (collectionName, formValues) => {
  try {
    console.log(formValues, 'formvalues');
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, formValues);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      return docData;
    } else {
      console.error('Document does not exist');
      return null;
    }
  } catch (error) {
    console.error('Error adding document:', error);
    return error;
  }
};

const InsertDataWithUID = async (collectionName, formValues, uid) => {
  try {
    const collectionRef = collection(db, collectionName);

    const docRef = doc(collectionRef, uid);

    await setDoc(docRef, formValues);

    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const docData = {user_id: docSnapshot.id, ...docSnapshot.data()};
      // const docData = docSnapshot.data();
      return docData;
    } else {
      console.error('Document does not exist');
      return null;
    }
  } catch (error) {
    console.error('Error adding document:', error);
    return error;
  }
};

const UpdateData = async (collectionName, updateValues, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);

    const data = await updateDoc(docRef, updateValues);
    // console.log(
    //   collectionName,
    //   updateValues,
    //   docId,
    //   data,
    //   docRef,
    //   "update",
    //   "check"
    // );
    // const docSnapshot = await getDoc(docRef);
    console.log(data, 'zzzz', 'courtDataBySlot');
    return data;
  } catch (error) {
    console.log(error, 'yyyyy');
    return error;
    // console.error('Error updating document:', error);
  }
};

const DeleteData = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const dd = await deleteDoc(docRef);
    console.log('Document deleted successfully:', collectionName, docId);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

export {
  FetchData,
  FetchDataById,
  InsertData,
  InsertDataWithUID,
  UpdateData,
  DeleteData,
  fetchBulkData,
};
