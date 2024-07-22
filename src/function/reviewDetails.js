import { SUPABASE_CLIENT } from "../supabase/supabase";
import { FetchData, InsertData } from "./crud";

export const createReview = async (review) => {
    try {
        const { data, error } = await InsertData('review', review);

        if (error) throw error;

        return data;
    } catch (error) {
        return error;
    }
};

export const getReviewByGroundId = async (ground_id) => {
    try {

        let { data: review, error } = await SUPABASE_CLIENT.from('review').select('*, user (avatar, username)').eq("ground_id", ground_id);

        var total = 0;

        for (let i = 0; i < review?.length; i++) {
            total += review[i]?.review_star;       
        }

        total = (total/review?.length).toFixed(1);

        if (error) throw error;

        return {review : review, value: total};
    } catch (error) {
        return error;
    }
};

export const getReviewByUserId = async (user_id) => {
    try {

        let { data: review, error } = await SUPABASE_CLIENT.from('review').select('*, ground_details (ground_name, address)').eq("userid", user_id)
        if (error) throw error;
        return review;

    } catch (error) {
        return error;
    }
};
 