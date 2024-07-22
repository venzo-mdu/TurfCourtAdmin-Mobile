import moment from "moment";
import { FetchData, InsertData, UpdateData } from "./crud";
import { SUPABASE_CLIENT } from "../supabase/supabase";

export const createEventByUser = async (datas) => {
    try {
        let ground_data = await FetchData('ground_details', ["*"]).eq("id", datas.ground_id)
        datas.owner_id = ground_data?.data[0]?.owner
        let result = await InsertData('events', datas)
        const { data, error } = result;
        if (error) throw error;
        return data;
    } catch (error) {
        return error;
    }
}

export const getEventDetails = async (uid, usertype) => {
    try {
        const fieldName = usertype === 'owner' ? 'owner_id' : 'user_id';
        const fieldValue = uid;
        let { data, error } = await SUPABASE_CLIENT.from('events').select('*,  ground_details (address, images, ground_name) , users_user_id:user_id(*)').eq(fieldName, fieldValue).order('id', { ascending: false });

        if (data) {
            data.forEach(item => {
                item.user = item.users_user_id?.username;
                item.title = item.event_name;
                item.created_at = item.created_at;
                item.start = item.start;
                item.end = item.end;
                // item.created_at = new Date(moment(item.created_at).format('MMM DD YYYY hh:mm A'))
                // item.start = new Date(moment(item.start).format('MMM DD YYYY hh:mm A'));
                // item.end = new Date(moment(item.end).format('MMM DD YYYY hh:mm A'));
                item.address = item?.ground_details?.address;
                item.images = item?.ground_details?.images;
                item.ground_name = item?.ground_details?.ground_name;
                delete item.ground_details;
            });

            return data;
        }
    } catch (err) {
        console.error('Error fetching event details:', err);
        return err;
    }
};

export const getEventByCourtId = async (ground_id, court_id) => {
    let events = await FetchData('events', ['id', 'created_at', 'ground_id', 'court_id', 'user_id', 'owner_id', 'total_amount', 'discount', 'paid_amount', 'balance', 'event_name', 'start', 'end', 'phonenumber', 'status', 'reason', 'ground_details (images, address, ground_name) user (username)']).eq('ground_id', ground_id)
    let filterdata = events?.data?.filter((event) => { return event?.court_id == court_id });
    events.data = filterdata
    if (events) {
        events?.data?.map(item => {
            if (item.court_id == court_id) {
                item.title = item.event_name
                item.created_at = item.created_at
                item.start = item.start
                item.end = item.end
                // item.created_at = new Date(moment.utc(item.created_at).format('MMM DD YYYY hh:mm A'))
                // item.start = new Date(moment(item.start).format('MMM DD YYYY hh:mm A'))
                // item.end = new Date(moment(item.end).format("MMM DD YYYY hh:mm A"))
                item.address = item?.ground_details?.address
                item.images = item?.ground_details?.images
                item.ground_name = item?.ground_details?.ground_name
                delete item.ground_details
            }
        })
        return filterdata
    } else {
        return {}
    }
}

export const getEventByCourtIdRaw = async (ground_id, court_id) => {
    try {
        let { data: events, error } = await SUPABASE_CLIENT.from('events').select('*').eq('ground_id', ground_id).eq('court_id', court_id).neq('status', "cancelled");

        if (error) throw error;

        return events;
    } catch (error) {
        return error;
    }
}

export const getEventByCourtIdForUser = async (ground_id, court_id) => {
    try {
        let { data: events, error } = await SUPABASE_CLIENT.from('events').select('*').eq('ground_id', ground_id).eq('court_id', court_id).neq('status', "cancelled");

        if (error) throw error;

        let eventSlot = [];

        events?.map(item => {
            const Death = new Date(item?.end);

            var start = new Date(item?.start);
            var end = new Date(item?.end);

            while (start < Death) {
              end = new Date(start.getTime() + 60 * 30 * 1000);
              eventSlot.push({
                ...item,
                start: start,
                end: end,
              })
            
              start = new Date(start.getTime() + 60 * 30 * 1000);
            }
        });

        return eventSlot;
    } catch (error) {
        return error;
    }
}

// priyanka bulk
export const getcourtevent = async (ground_id, court_id) => {
    let events = await FetchData('events', ['id', 'created_at', 'ground_id', 'court_id', 'user_id', 'owner_id', 'total_amount', 'discount', 'paid_amount', 'balance', 'event_name', 'start', 'end', 'phonenumber', 'status', 'reason', 'ground_details (images, address, ground_name) user (username)']).eq('ground_id', ground_id).neq('status','canceled')
    let filterdata = events?.data?.filter((event) => { return event?.court_id == court_id });
 
    events.data = filterdata
 
    if (events) {
        events?.data?.map(item => {
            if (item.court_id == court_id) {
                item.title = item.event_name
                item.created_at = item.created_at;
                item.start = item.start;
                item.end = item.end;
                // item.created_at = new Date(moment.utc(item.created_at).format('MMM DD YYYY hh:mm A'))
                // item.start = new Date(moment(item.start).format('MMM DD YYYY hh:mm A'))
                // item.end = new Date(moment(item.end).format("MMM DD YYYY hh:mm A"))
                item.address = item?.ground_details?.address
                item.images = item?.ground_details?.images
                item.ground_name = item?.ground_details?.ground_name;
                delete item.ground_details
            }
        })
 
        return filterdata
    } else {
        return {}
    }
}
 

export const updateEvent = async (id, updatedata) => {
    const propertiesToDelete = ['address', 'end', 'start', 'images', 'title', 'user', 'users_user_id', 'ground_name'];
    propertiesToDelete.forEach(property => delete updatedata[property]);
 
    try {
        let result = await UpdateData('events', updatedata, { conditionKey: "id", conditionValue: id })
        const { data, error } = result;
        if (error) throw error;
        return data;
    } catch (error) {
        return error;
    }
}

export const cancelEvent = async (id, reason) => {
    try {
        let result = await UpdateData('events', { status: 'cancelled', reason: reason }, { conditionKey: "id", conditionValue: id })
        const { data, error } = result;
        if (error) throw error;
        return data;
    } catch (error) {
        return error;
    }
};
