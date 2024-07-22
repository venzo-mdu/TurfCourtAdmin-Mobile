import moment from "moment";
import { SUPABASE_CLIENT } from "../supabase/supabase";
import { FetchData, InsertData } from "./crud";

export const createSlotByCourtId = async (ground_id, court_id, payment_data) => {
    try {
        payment_data['ground_id'] = ground_id;
        payment_data['court_id'] = court_id;

        const { data, error } = await InsertData('masterslot', payment_data);

        return data;
    } catch (error) {
        return error;
    }
};

export const getSlot = async (ground_id, court_id) => {
    try {
        let { data: masterslot, error } = await SUPABASE_CLIENT.from('masterslot').select('*').eq("ground_id", ground_id).eq("court_id", court_id);
        return masterslot;
    } catch (error) {
        return error;
    }
};

export const getSlotDataByCourtId = async (ground_id, court_id) => {
    try {

        let { data: masterslot, error } = await SUPABASE_CLIENT.from('masterslot').select('*').eq("ground_id", ground_id).eq("court_id", court_id);
        
        // const { data, error } = await FetchData('masterslot', ["*"]).eq("ground_id", ground_id).eq("court_id", court_id);

        if (error) throw error;

        let courtSlot = [];

        masterslot?.map(item => {
            const Death = new Date(item?.end);

            var start = new Date(item?.start);
            var end = new Date(item?.end);

            while (start < Death) {
              end = new Date(start.getTime() + 60 * 30 * 1000);


            //   if (moment(start).hours() < item?.start_restriction) {
            //   } else if (item?.end_restriction <= moment(start).hours()) {
            //   } else {
                courtSlot.push({
                    start: start,
                    end: end,
                    ground_id: item.ground_id,
                    court_id: item.court_id,
                    payment: item.payment,
                })
            //   }
            
              start = new Date(start.getTime() + 60 * 30 * 1000);
            }
            
        });

        return {data: masterslot, courtSlot: courtSlot};

    } catch (error) {
        return error;
    }
};

export const updateSlotByCourtId = async (slotdata) => {
    try {
        let result = await UpdateData('masterslot', slotdata, { conditionKey: "id", conditionValue: slotdata?.id })
        
        const { data, error } = result;

        if (error) throw error;

        return data;
    } catch (error) {
        return error;
    }
};
