import { SUPABASE_CLIENT } from "../supabase/supabase";

export const uploadFile = async (uuid, name, file, bucketName) => {
    try {
        const { data, error } = await SUPABASE_CLIENT.storage.from(bucketName).upload(`${uuid}/${name}`, file, {
            cacheControl: '3600',
            upsert: true,
        });
 
        if (error) throw error;
 
        const { data: url } = await SUPABASE_CLIENT.storage.from(bucketName).getPublicUrl(data.path);
        return url;
    } catch (error) {
        return errorNotifier(error);
    }
};

export const deleteFile = async (name, bucketName) => {
    try {

        let pathName=Array.isArray(name)?name:[name]

        const { data, error } = await SUPABASE_CLIENT.storage.from(bucketName).remove(pathName);

        if (error) throw error;

        return true;
    } catch (error) {
        return errorNotifier(error);
    }
}