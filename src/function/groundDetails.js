import { FetchData, InsertData, UpdateData } from "./crud";
import { SUPABASE_CLIENT } from '../supabase/supabase';
import moment from "moment";

export const getActiveGroundList = async () => {
    try {
        let result = await FetchData('ground_details', ["*"]).eq("isgroundactive", true).order('id', { ascending: false });
        const { data, error } = result;

        data?.map(item => {
            let min_value;
            item.court_details?.map(value => {
                if (min_value) {
                    if (parseInt(value?.approximate_amount) < min_value) {
                        min_value = value?.approximate_amount
                    }
                } else {
                    min_value = value?.approximate_amount
                }
            })
            item.no_of_courts = item?.court_details ? item?.court_details?.length : 0
            item.starting_amount = min_value ? min_value : 0
        })
        if (error) throw error;

        return data;
    } catch (error) {
        return error;
    }
};

export const getActiveGroundListByLocation = async (city) => {
    try {
        let result = await FetchData('ground_details', ["*"]).eq("isgroundactive", true).eq("location", city).order('id', { ascending: false });
        const { data, error } = result;

        data?.map(item => {
            let min_value;
            item.court_details?.map(value => {
                if (min_value) {
                    if (parseInt(value?.approximate_amount) < min_value) {
                        min_value = value?.approximate_amount
                    }
                } else {
                    min_value = value?.approximate_amount
                }
            })
            item.no_of_courts = item?.court_details ? item?.court_details?.length : 0
            item.starting_amount = min_value ? min_value : 0
        })
        if (error) throw error;

        return data;
    } catch (error) {
        return error;
    }
};

export const getGroundListByOwner = async (uid) => {
    try {
        let result = await FetchData('ground_details', ["*"]).eq("owner", uid).order('id', { ascending: false });
        const { data, error } = result;

        data?.map(item => {
            let min_value;
            item.court_details?.map(value => {
                if (min_value) {
                    if (parseInt(value?.approximate_amount) < min_value) {
                        min_value = value?.approximate_amount
                    }
                } else {
                    min_value = value?.approximate_amount
                }
            })

            item.no_of_courts = item?.court_details ? item?.court_details?.length : 0
            item.starting_amount = min_value ? min_value : 0
        })
        if (error) throw error;

        return data;
    } catch (error) {
        return error;
    }
};

export const getGroundDataById = async (id) => {
    try {
        let { data: ground_details, error } = await SUPABASE_CLIENT.from('ground_details').select('*').eq("id", id);

        ground_details?.map(item => {
            let min_value;
            item?.court_details?.map(value => {
                if (min_value) {
                    if (parseInt(value?.approximate_amount) < min_value) {
                        min_value = value?.approximate_amount
                    }
                } else {
                    min_value = value?.approximate_amount
                }
            })

            item.no_of_courts = item?.court_details ? item?.court_details?.length : 0
            item.starting_amount = min_value ? min_value : 0
        })
        if (error) throw error;

        return ground_details;
    } catch (error) {
        return error;
    }
};

export const updateGroundDataByGroundId = async (userdata, id) => {
    try {
        let result = await UpdateData('ground_details', userdata, { conditionKey: "id", conditionValue: id })
        
        const { data, error } = result;

        if (error) throw error;

        return data;
    } catch (error) {
        return error;
    }
};



// nash
export const createGround = async (uuid, groundData) => {
    try {
        // const imageUrlList = await Promise.all(
        //     groundData.images ? Array.from(groundData.images).map(item => groundimageuplaod(uuid, item)) : []
        // );
 
        // groundData.images = imageUrlList;
        const { data, error } = await InsertData('ground_details', groundData);
        if (error) throw error;
 
        return data;
    } catch (error) {
        return error;
    }
}

export const timeFilterground = async (location, start_time, end_time) => {
    try {

        const {data: locationground_data, error} = await FetchData('ground_details', ['id']).ilike('location', location).order('id', { ascending: false });

        const locationBased_grdid = locationground_data?.map(item => item.id)

        const {data: allgrounddata, err} = await FetchData('ground_details', ['*']).ilike('location', location)

        if (start_time && end_time) {

            // const start = moment("2024-01-11T07:30:00").format("YYYY-MM-DDThh:mm:ss");
            // const end = moment("2024-01-12T09:30:00").format("YYYY-MM-DDThh:mm:ss");

            const start = moment(start_time).add(6, "hours").add(30, "minutes").format("YYYY-MM-DDThh:mm:ss");
            const end = moment(end_time).add(6, "hours").add(30, "minutes").format("YYYY-MM-DDThh:mm:ss");

            const {data: event_datalist} = await FetchData('events', ['ground_id', 'court_id', 'start', 'end', 'id']).in('ground_id', locationBased_grdid).order('id', { ascending: false });

            let filterdata = event_datalist?.filter((event) => { 
                return (moment(event.start).format("YYYY-MM-DD") == moment(start).format("YYYY-MM-DD") || moment(event.end).format("YYYY-MM-DD") == moment(end).format("YYYY-MM-DD"));
            });

            let filterdata2 = filterdata?.filter((event) => { 
                return (moment(event?.start).toDate() <= moment(start).toDate() && moment(start).toDate() <= moment(event?.end).toDate()) || (moment(event?.start).toDate() <= moment(end).toDate() && moment(end).toDate() <= moment(event?.end).toDate())
            });

            const event_data = filterdata2;

            const needrmv_id = {}
            event_data?.map(item => {
                if (item.ground_id in needrmv_id == false) {
                    needrmv_id[item.ground_id] = []
                }
                needrmv_id[item.ground_id].push(item.court_id)
            })
            
            let needrmsids = []
            Object.keys(needrmv_id).map(item => {
                needrmsids.push({ ground_id: item, court_id: needrmv_id[item] })
            })

            return {groundData: allgrounddata, eventCourt: needrmsids}
        } else {
            return {groundData: allgrounddata, eventCourt:[]}
        }
    } catch (error) {
        return error;
    }
}

// export const timeFilterground = async (location, start_time, end_time) => {
//     try {

//         const locationground_data = await FetchData('ground_details', ['id']).ilike('location', location)

//         const locationBased_grdid = locationground_data?.data.map(item => item?.id)

//         const allgrounddata = await FetchData('ground_details', ['*']).ilike('location', location)

//         if (start_time && end_time) {

//             const start = start_time.toLocaleDateString() + " " + start_time.toLocaleTimeString();
//             const end = end_time.toLocaleDateString() + " " + end_time.toLocaleTimeString();

//             // const event_data = await FetchData('events', ['ground_id', 'court_id']).in('ground_id', locationBased_grdid).gte('start', start_time).lte('end', end_time)
//             const event_data = await FetchData('events', ['ground_id', 'court_id']).in('ground_id', locationBased_grdid).gte('start', "2024-01-09T14:00").lte('end', "2024-01-09T16:00")

            
//             const needrmv_id = {}
//             event_data?.data.map(item => {
//                 if (item.ground_id in needrmv_id == false) {
//                     needrmv_id[item.ground_id] = []
//                 }
//                 needrmv_id[item.ground_id].push(item.court_id)
//             })
//             let needrmsids = []
//             Object.keys(needrmv_id).map(item => {
//                 needrmsids.push({ ground_id: item, court_id: needrmv_id[item] })
//             })
//         } else {
//             return allgrounddata?.data
//         }
//     } catch (error) {
//         return error;
//     }
// }

//nashrin
const groundimageuplaod = async (uuid, image) => {
    try {
        const { data, error } = await SUPABASE_CLIENT.storage
            .from('turfImages')
            .upload(`${uuid}/${image.fileName}`, image, {
                cacheControl: '3600',
                upsert: true,
            });
 
        if (error) throw error;
 
        const { data: url } = await SUPABASE_CLIENT.storage.from('turfImages').getPublicUrl(data.path);
        return url?.publicUrl;
    } catch (error) {
        return error;
    }
};
 
export const updateGroundImage = async (uuid, imageUpload, groundId) => {
    try {
        const imageUrlList = await Promise.all(
            imageUpload ? Array.from(imageUpload).map(item => groundimageuplaod(uuid, item)) : []
        );
        let tempgrddetails = await getGroundDataById(groundId);
        tempgrddetails = tempgrddetails[0];
        let imagelist = tempgrddetails?.images ? tempgrddetails?.images : [];
        imagelist = imagelist.concat(imageUrlList);
         tempgrddetails.images = imagelist;
        const ground_data = await updateGroundDataByGroundId(tempgrddetails, groundId);
        return ground_data;
    } catch (error) {
        return error;
    }
};

export const deleteGroundImage = async (url, groundId) => {
    const data = await getGroundDataById(groundId)
    let index = data?.[0]?.images.indexOf(url)
    data?.[0]?.images?.splice(index, 1)
    const updateData =  await updateGroundDataByGroundId(data[0], groundId)
    return updateData
};
