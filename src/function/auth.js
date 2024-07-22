import { SUPABASE_CLIENT } from '../supabase/supabase'
import { InsertData, FetchData, UpdateData } from './crud'

export const signin = async (values) => {
  try {
    let val = values
    const { data, error } = await SUPABASE_CLIENT.auth.signUp({
      email: val.email,
      password: val.password
    })
    delete val?.password
    val['userid'] = data?.user?.id
    if (error) {
      console.error('Error signing up:', error.message);
      return {data : null, error: error, msg: error.message}
    } else {

      const { data, error } = await InsertData('user', val)
      if (error) throw error;
      return {data : data, error: null, msg: `Log in as ${data[0]?.username}`};
    }
  }
   catch (error) {
    console.error('Error:', error);
  }
}

export const login = async (values) => {
  try {
    const { data, error } = await SUPABASE_CLIENT.auth.signInWithPassword({
      email: values.email,
      password: values.password
    })
    if (error) {
      console.error('Error during login:', error.message);
      return { data: null, error: error.message, msg : 'Error during login' };
    } else {

      return { data, error: null, msg : 'User logged in successfully' };
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export const getSession = async () => {
  try {
    const { data, error } = await SUPABASE_CLIENT.auth.getSession()
    if (error) {
      console.error('Error login up:', error.message);
      return error
    } else {

      return data
    }
  } catch (error) {
    console.error('Error:', error.message);
    return error
  }
}

export const adminConfig = async (allowadmin) => {
  let result = await FetchData('config', ["*"])

  try {
    if (result.data.length == 0) {
      const { data, error } = await InsertData('config', { 'allowadmin': allowadmin });
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await UpdateData('config', { 'allowadmin': allowadmin }, { conditionKey: "id", conditionValue: result?.data[0]?.id })
      if (error) throw error;

      return data;
    }
  } catch (error) {
    return error;
  }
}