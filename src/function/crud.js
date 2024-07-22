import { SUPABASE_CLIENT } from "../supabase/supabase";

const FetchData = (table, requiredFields = []) => {
    return SUPABASE_CLIENT.from(table).select(requiredFields.length ? requiredFields.join(",") : "*");
}

const FetchDataById = (table, id) => {
    return FetchData(table).eq("id", id);
}

const InsertData = async (table, userdata) => {
    return await SUPABASE_CLIENT.from(table).insert(userdata).select();
}

const UpdateData = async (table, data, condition) => {
    const { conditionKey, conditionValue } = condition;
    return await SUPABASE_CLIENT.from(table).update(data).eq(conditionKey, conditionValue).select().order('id');
}

const DeleteData = async (table, condition) => {
    const { conditionKey, conditionValue } = condition;
    return await SUPABASE_CLIENT.from(table).delete().eq(conditionKey, conditionValue);
}

export  { FetchData, FetchDataById, InsertData, UpdateData, DeleteData };
