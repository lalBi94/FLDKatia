import axios from "axios";
import global from "../../global.json";

export const getTel = async () => {
    const query = await axios.get(`${global.api}/us/getTel`);
    return query.data;
};

export const getAddress = async () => {
    const query = await axios.get(`${global.api}/us/getAddress`);
    return query.data;
};
