import axios from "axios";
import global from "../../global.json";

/**
 * Ajouter un item dans le panier
 * @param {{token: string, id: string, qte: number}} settings
 * @return {Promise<{status: 0|1}>}
 */
export const addToCart = async (settings) => {
    try {
        const formData = new FormData();
        formData.append("token", settings.token);
        formData.append("id", settings.id);
        formData.append("qte", settings.qte);

        const query = await axios.post(
            `${global.api}/order/addToCart`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: formData,
            }
        );

        return query.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

/**
 * Retirer un produit du panier (peu importe la qte)
 * @param {{id: string}} settings
 * @return {Promise<{status: 0|1}>}
 */
export const removeItem = async (settings) => {
    try {
        const query = await axios.delete(`${global.api}/order/removeItem`, {
            data: settings,
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
 * Faire un +1 sur un produit de la commande
 * @param {{token: string, id: string}} settings
 * @return {Promise<{status: 0|1}>}
 */
export const plusOne = async (settings) => {
    try {
        const query = await axios.put(
            `${global.api}/order/plusOne`,
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
 * Faire un -1 sur un produit de la commande
 * @param {{token: string, id: string}} settings
 * @return {Promise<{status: 0|1}>}
 */
export const moinsOne = async (settings) => {
    try {
        const query = await axios.put(
            `${global.api}/order/moinsOne`,
            JSON.stringify(settings),
            {
                data: settings,
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
 * Recuperer le panier d'un utilisateur
 * @param {{token: string}} settings
 * @return {Promise<{status: 0|1, data: {}}>}
 */
export const getOrdersOf = async (settings) => {
    try {
        const formData = new FormData();
        formData.append("token", settings.token);

        const query = await axios.post(
            `${global.api}/order/getOrdersOf`,
            formData,
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
 * Vider le panier d'un utilisateur
 * @param {{token: string}} settings
 * @return {Promise<{}>}
 */
export const removeAllOrdersOf = async (settings) => {
    try {
        const query = await axios.delete(
            `${global.api}/order/removeAllOrdersOf`,
            {
                data: settings,
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
