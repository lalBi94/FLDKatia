import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import "./Checkout.scss";
import { Button, Input, notification } from "antd";
import { cipherRequest } from "../../services/KTSec/KTSec";
import global from "../../global.json";

export default function Checkout() {
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [reservation, setReservation] = useState({});
    const [notif, contexteHandler] = notification.useNotification();

    const supplyForHandler = (reservation) => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            id: reservation.user_id,
        });

        cipherRequest(toSend, `${global.api}/customer/getInfoBy`).then(
            (res) => {
                setReservation({ ...reservation, user_data: res.data });
                console.log({ ...reservation, user_data: res.data });
            }
        );

        setIsLoading(false);
    };

    /**
     * Ouvrir la Notif
     * @param {string} title Titre de la popup (non implemente encore)
     * @param {string} message Le contenu
     * @param {0|1} status 1: Erreur 0: Succes
     * @param {string} placement topLeft, ...
     */
    const openNotif = (title, message, status, placement) => {
        notif[status === 0 ? "success" : status === 1 ? "error" : "info"]({
            message: title,
            description: message,
            placement,
        });
    };

    const handleSearch = () => {
        setIsLoading(true);

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            code: search,
        });

        cipherRequest(toSend, `${global.api}/reservation/getRFromCode`).then(
            (res) => {
                console.log(res);

                if (res.status === 0) {
                    supplyForHandler(res.info);
                } else {
                    openNotif(
                        "Caisse",
                        "Le code ne pointe pas vers une commande existante",
                        1,
                        "topLeft"
                    );
                }
            }
        );
    };

    const onChange = (text) => {
        setSearch(text);
    };

    const sharedProps = {
        onChange,
    };
    return (
        <Layout>
            <div id="checkout-container">
                <div id="checkout-title-container">
                    <span id="checkout-title">
                        Entrez un code de réservation
                    </span>
                </div>

                <div id="checkout-ipt-container">
                    <Input.OTP
                        formatter={(str) => str.toUpperCase()}
                        {...sharedProps}
                    />
                </div>

                <div id="checkout-btn-container">
                    <Button onClick={handleSearch} loading={isLoading}>
                        Chercher
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
