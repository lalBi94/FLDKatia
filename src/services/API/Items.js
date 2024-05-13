import axios from "axios";
import global from "../../global.json";

export const getItemsLength = async () => {
    try {
        const query = await axios.get(`${global.api}/item/getItemsLength`);
        return query.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

/**
 * Modifier un article
 * @param {{id:string,name:string,price:number,promotion:number,imgRef:string,token:string}} settings
 * @return {{status: 0} | null}
 */
export const modifyItem = async (settings) => {
    try {
        const query = await axios.put(
            `${global.api}/item/modifyItem`,
            JSON.stringify(settings),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return query.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

/**
 * Recuperer la liste des articles
 * @return [{}]
 */
export const getItems = async () => {
    try {
        const query = await axios.get(`${global.api}/item/getAllItems`);
        return query.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

/**
 * Supprimer un/des item(s).
 * @param {{data:Array<String>,token:string}} settings
 * @return {{status: number} | null}
 */
export const deleteItems = async (settings) => {
    try {
        const query = await axios.delete(`${global.api}/item/deleteItems`, {
            data: {
                data: settings.data,
                token: settings.token,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        return query.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

/**
 * Ajouter un item
 * @param {{imgRef: string, token: string, name: string, price: number, promotion: number, category: string}} settings Les details de l'item
 * @return {{status: number} | null}
 */
export const setItem = async (settings) => {
    try {
        const formData = new FormData();
        formData.append("imgRef", settings.imgRef);
        formData.append("token", settings.token);
        formData.append("name", settings.name);
        formData.append("price", settings.price);
        formData.append("promotion", settings.promotion);
        formData.append("category", settings.category);

        console.log(settings);

        const query = await axios.post(`${global.api}/item/setItem`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: formData,
        });

        return query.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};
