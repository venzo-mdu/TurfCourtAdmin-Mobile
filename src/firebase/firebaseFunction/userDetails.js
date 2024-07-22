import { FetchData, FetchDataById, UpdateData } from "./crud";
import { storage } from "../firebase";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export const userData = async (uid) => {
  try {
    const userData = await FetchDataById("user", uid);
    return userData;
  } catch (error) {
    // return error;
    //  12-01
    return null;
  }
};

export const allDataBasedOnUsertype = async (usertype) => {
  try {
    const userData = await FetchData("user", "usertype", usertype);
    if (userData) {
      return { status: "success", data: userData };
    } else {
      return { status: "failure", data: "No User" };
    }
  } catch (error) {
    return error;
  }
};
export const allUserdata = async () => {
  try {
    const userData = await FetchData("user", "usertype", "admin");
    return userData;
  } catch (error) {
    return error;
  }
};
export const UpdateUserData = async (userdata, studentUid) => {
  try {
    if (studentUid) {
      await UpdateData("user", userdata, studentUid);

      let userData = await FetchDataById("user", studentUid);
     // toast.success("Update Success", { position: "top-right", autoClose: 2000, });
      return { status: "success", data: userData };
    } else {
     // toast.error("Update Failed", { position: "top-right", autoClose: 2000, });
      return { status: "failure", data: "No Login User" };
    }
  } catch (error) {
    return { status: "failure", data: error };
  }
};

export const profileImgUpdate = async (uuid, name, file, bucketName) => {
  try {
    if (uuid) {
      const storageRef = ref(storage, `${bucketName}/${uuid}/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
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
    }
  } catch (error) {
    console.error("Error during image upload:", error);
    return { status: "failure", data: error };
  }
};

// export const profileImgUpdate1 = async (uid, file, userData) => {
//     const { data, error } = await SUPABASE_CLIENT.storage
//       .from('turfImages')
//       .upload(`avatar/${uid}_avatar.png`, file, {
//         cacheControl: '3600',
//         upsert: true,
//       });
//     const { data: url } = SUPABASE_CLIENT.storage.from('turfImages').getPublicUrl(data.path)
//     userData['avatar'] = url?.publicUrl
//     const profileData = await UpdateUserData(userData, uid);
//     return profileData
//   }

//   export const profileImgUpdate = async (uuid, name, file, bucketName) => {

//     try {
//         const storageRef = ref(storage, `${bucketName}/${uuid}/${name}`);
//         const uploadTask = uploadBytesResumable(storageRef, file);
//         return new Promise((resolve, reject) => {
//             uploadTask.on(
//                 'state_changed',
//                 (snapshot) => {
//                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                     console.log(`Upload is ${progress}% done`);
//                 },
//                 (error) => {
//                     console.error(error);
//                     reject(error);
//                 },
//                 async () => {
//                     try {
//                         const url = await getDownloadURL(uploadTask.snapshot.ref);
//                         console.log('File available at', url);
//                         resolve(url);
//                     } catch (error) {
//                         console.error('Error getting download URL:', error);
//                         reject(error);
//                     }
//                 }
//             );
//         });
//     } catch (error) {
//         console.error('Error during image upload:', error);
//         throw error;
//     }

// };
