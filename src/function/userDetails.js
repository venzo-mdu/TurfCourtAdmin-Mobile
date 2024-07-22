import {SUPABASE_CLIENT} from '../supabase/supabase';
import {FetchData, UpdateData} from './crud';
import {SupabaseClient} from '@supabase/supabase-js';

export const userData = async uid => {

  try {
    let result = await FetchData('user', ['*']).eq('user_id', uid);
    const {data, error} = result;
    if (error) throw error;
    return data;
  } catch (error) {
    return error;
  }
};

export const UpdateUserData = async (userdata, studentUid) => {
  try {
    let result = await UpdateData('user', userdata, {
      conditionKey: 'userid',
      conditionValue: studentUid,
    });
    const {data, error} = result;
    if (error) throw error;
    return data;
  } catch (error) {
    return error;
  }
};

export const profileImgUpdate = async (uid, file, userData) => {
  const {data, error} = await SUPABASE_CLIENT.storage
    .from('turfImages')
    .upload(`avatar/${uid}_avatar.png`, file, {
      cacheControl: '3600',
      upsert: true,
    });
  const {data: url} = SUPABASE_CLIENT.storage
    .from('turfImages')
    .getPublicUrl(data.path);
  userData['avatar'] = url?.publicUrl;
  const profileData = await UpdateUserData(userData, uid);
  return profileData;
};
