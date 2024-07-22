import { SUPABASE_CLIENT } from "../supabase/supabase";
import { FetchData, UpdateData } from "./crud";

export const allUserList = async () => {
    try {
        
        let { data: user, error } = await SUPABASE_CLIENT.from('user').select('*').eq('usertype', 'user').order('id', { ascending: false });

        if (error) throw error;

        return user;
    } catch (error) {
        return error;
    }
};

export const allTurfAdminList = async () => {
    try {
        
        let { data: user, error } = await SUPABASE_CLIENT.from('user').select('*').eq('usertype', 'admin').order('id', { ascending: false });

        if (error) throw error;

        return user;
    } catch (error) {
        return error;
    }
};

export const userDetailsVenzoAdmin = async (userid) => {
    try {
        
        let { data: user, error } = await SUPABASE_CLIENT.from('user').select('*').eq('userid', userid).order('id', { ascending: false });

        if (error) throw error;


        let events = await SUPABASE_CLIENT.from('events').select('*,  ground_details (address, images, ground_name)').eq('user_id', userid).order('id', { ascending: false });

        let review = await SUPABASE_CLIENT.from('review').select('*, ground_details (ground_name, address, images, location)').eq('userid', userid).order('id', { ascending: false });

        return { details : user, history : events?.data, review : review?.data};
    } catch (error) {
        return error;
    }
};

export const userHistoryListVenzoAdmin = async (userid) => {
    try {

        let { data: events, error } = await SUPABASE_CLIENT.from('events').select('*,  ground_details (address, images, ground_name)').eq('user_id', userid).order('id', { ascending: false });

        if (error) throw error;

        return { history : events};
    } catch (error) {
        return error;
    }
};

export const turfAdminDetailsVenzoAdmin = async (userid) => {
    try {
        
        let { data: user, error } = await SUPABASE_CLIENT.from('user').select('*').eq('userid', userid).order('id', { ascending: false });

        if (error) throw error;

        
        let { data: ground_details } = await SUPABASE_CLIENT.from('ground_details').select('*').eq('owner', userid).order('id', { ascending: false });
        

        // let review = await SUPABASE_CLIENT.from('review').select('*, ground_details (ground_name, address, images, location)').eq('userid', userid).order('id', { ascending: false });

        return { details : user, ground : ground_details};
    } catch (error) {
        return error;
    }
};

export const turfAdminActiveVenzoAdmin = async (id, status) => {
    try {
        
        let { data: user, error } = await UpdateData('user', {isuseractive : status}, { conditionKey: "userid", conditionValue: id });

        if (error) throw error;

        let ground = await SUPABASE_CLIENT.from('ground_details').select('id').eq("owner", id);

        for (let i = 0; i < ground?.data?.length; i++) {
            const res = await UpdateData('ground_details', {isgroundactive : status}, { conditionKey: "id", conditionValue: ground?.data[i]?.id });
        }

        // let result = await UpdateData('ground_details', {isgroundactive : status}, { conditionKey: "id", conditionValue: id })

                
        return user[0]?.isuseractive;
    } catch (error) {
        return error;
    }
};