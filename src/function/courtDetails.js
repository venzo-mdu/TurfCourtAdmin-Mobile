import { FetchData } from "./crud";

export const getCourtDataByCourtId = async (ground_id, court_id) => {
    try {
        const { data, error } = await FetchData('ground_details', ["*"]).eq("id", ground_id);

        const filtered_court = data[0].court_details?.filter((courtData) => { return courtData?.court_id === court_id })

        if (error) throw error;

        return filtered_court;

    } catch (error) {
        return error;
    }
};

export const updateCourtDataByCourtId = async (ground_id, court_data, court_id) => {
    const { data, error } = await FetchData('ground_details', ["*"]).eq("id", ground_id);

    let filtered_court = data[0]?.court_details;

    if (filtered_court == null) {
        filtered_court = []
    }

    if (court_id != '') {
        let current = filtered_court.filter(item => item.court_id == court_id)

        if (current.length) {
            let index = filtered_court.indexOf(current[0])
            filtered_court.splice(index, 1)
        }
    } else {
        let court_id = 0;

        filtered_court.map((item) => {
            if (item.court_id > court_id) {
                court_id = item.court_id
            }
        });

        court_id += 1
        court_data.court_id = court_id
    }

    filtered_court.push(court_data)
    data[0]['court_details'] = filtered_court

    const courtData = await updateGroundDataByGroundId(data[0], ground_id);

    return courtData;
}

export const deleteCourtByCourtId = async (ground_id, court_id) => {
    try {
        const { data, error } = await FetchData('ground_details', ["*"]).eq("id", ground_id);

        const filtered_court = data[0]?.court_details;

        const current = filtered_court.filter((courtData) => { return courtData?.court_id == court_id })
        
        if (current.length) {
            let index = filtered_court.indexOf(current[0])
            filtered_court.splice(index, 1)
        }

        if (error) throw error;

        data[0]['court_details'] = filtered_court;

        const courtData = await updateGroundDataByGroundId(data[0], ground_id);

        return courtData;

    } catch (error) {
        return error;
    }
};