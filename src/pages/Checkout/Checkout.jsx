import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import "./Checkout.scss";
import { Button, Input, notification, ConfigProvider, Card, Tag } from "antd";
import { cipherRequest } from "../../services/KTSec/KTSec";
import global from "../../global.json";
import { priceAfterPromo } from "../../services/Utils/Utils";
import checkout from "../Themes/cart.json";

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

    const handleConfirm = () => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: reservation._id,
        });

        cipherRequest(
            toSend,
            `${global.api}/reservation/desactivateReservations`
        ).then((res) => {
            if (res.status === 0) {
                openNotif(
                    "Caisse",
                    "Reservation recupere par le client !",
                    0,
                    "topLeft"
                );

                setReservation({ ...reservation, status: false });
            } else {
                openNotif(
                    "Caisse",
                    "Une erreur est survenue, si vous voyez ce message, contactez moi au +33 7 45 22 10 60",
                    1,
                    "topLeft"
                );
            }
        });
    };

    const handleReActive = () => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            reservation_id: reservation._id,
        });

        cipherRequest(
            toSend,
            `${global.api}/reservation/activateReservations`
        ).then((res) => {
            if (res.status === 0) {
                openNotif("Caisse", "Reservation reactiver !", 0, "topLeft");

                setReservation({ ...reservation, status: true });
            } else {
                openNotif(
                    "Caisse",
                    "Une erreur est survenue, si vous voyez ce message, contactez moi au +33 7 45 22 10 60",
                    1,
                    "topLeft"
                );
            }
        });
    };

    const noCommand = () => {
        openNotif(
            "Caisse",
            "Le code ne pointe pas vers une commande existante",
            1,
            "topLeft"
        );

        setIsLoading(false);
    };

    const handleSearch = () => {
        setIsLoading(true);

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            code: search,
        });

        cipherRequest(toSend, `${global.api}/reservation/getRFromCode`)
            .then((res) => {
                if (res.status === 0) {
                    supplyForHandler(res.info);
                } else {
                    noCommand();
                }
            })
            .catch((err) => {
                noCommand();
            });
    };

    const onChange = (text) => {
        setSearch(text);
    };

    const sharedProps = {
        onChange,
    };

    const redirect = () => {
        window.location.href = "/#/home";
    };

    useEffect(() => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${global.api}/customer/getInfo`)
            .then((res) => {
                if (res.status === 0 && res.data.type === "admin") {
                } else {
                    redirect();
                }
            })
            .catch((err) => {
                console.error(err);
                redirect();
            });
    }, []);

    return (
        <ConfigProvider theme={checkout}>
            <Layout>
                {contexteHandler}
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

                    {reservation.items_list ? (
                        <Card
                            id="card-container"
                            title={`Commande de ${reservation.user_data.firstname} ${reservation.user_data.lastname}`}
                            style={{
                                width: 300,
                            }}
                        >
                            <Tag
                                color={
                                    reservation.status ? "#349734" : "#cb4a4a"
                                }
                            >
                                {reservation.status ? "Active" : "Non-active"}
                            </Tag>

                            <div id="items-container">
                                {Object.keys(reservation.items_list).map(
                                    (e, i) => (
                                        <div className="items">
                                            <span>
                                                x{reservation.items_list[e].qte}
                                            </span>
                                            <span>
                                                {" "}
                                                {
                                                    reservation.items_list[e]
                                                        .name
                                                }{" "}
                                                (
                                                {reservation.items_list[e]
                                                    .promotion > 0
                                                    ? `${priceAfterPromo(
                                                          reservation
                                                              .items_list[e]
                                                              .price,
                                                          reservation
                                                              .items_list[e]
                                                              .promotion
                                                      ).toFixed(
                                                          2
                                                      )}€ = ${reservation.items_list[
                                                          e
                                                      ].price.toFixed(2)}€ - ${
                                                          reservation
                                                              .items_list[e]
                                                              .promotion
                                                      }%`
                                                    : `${reservation.items_list[
                                                          e
                                                      ].price.toFixed(2)}€`}
                                                )
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>

                            <span>
                                Pour un total de{" "}
                                <b>{reservation.total.toFixed(2)}€</b>
                            </span>

                            {reservation.status ? (
                                <Button onClick={handleConfirm}>
                                    Confirmer la commande
                                </Button>
                            ) : (
                                <Button onClick={handleReActive}>
                                    Reactiver la commande
                                </Button>
                            )}
                        </Card>
                    ) : null}
                </div>
            </Layout>
        </ConfigProvider>
    );
}
