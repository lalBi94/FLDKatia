import axios from "axios";
import global from "../../global.json";

export const addReservation = async (settings) => {
    try {
        const formData = new FormData();
        formData.append("token", settings.token);
        formData.append("items_list", JSON.stringify(settings.items_list));

        const query = await axios.post(
            `${global.api}/reservation/addReservation`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return query.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};
