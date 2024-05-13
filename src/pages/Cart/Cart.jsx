import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { cipherRequest } from "../../services/KTSec/KTSec";
import "./Cart.scss";
import { Vortex } from "react-loader-spinner";
import { Link } from "react-router-dom";
import "hover.css";
import RCode from "../../components/RCode/RCode";
import config from "../../global.json";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { moinsOne, plusOne, removeItem } from "../../services/API/Order";
import { getOrdersOf, removeAllOrdersOf } from "../../services/API/Order";
import { addReservation } from "../../services/API/Reservation";
import { notification, Button, ConfigProvider } from "antd";
import cart from "../Themes/cart.json";

const emptySpan = (
    <p>
        Panier vide ! <br />
        <br /> Dirigez-vous vers <Link to="/shop">"A la carte"</Link> pour faire
        des reservations.
    </p>
);

/**
 * Panier du client
 * @return {HTMLElement}
 */
export default function Cart() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [codeQR, setCodeQR] = useState(null);
    const [notif, contextHolder] = notification.useNotification();
    const [loader, setLoader] = useState(true);
    const [toDisplay, setToDisplay] = useState(null);
    const [haveSomething, setHaveSomething] = useState(false);

    /**
     * Retourner a la boutique
     */
    const goShop = () => {
        location.href = "/shop";
    };

    /**
     * Creation du tableau / fetching des items
     */
    const display = () => {
        const pack = {
            token: localStorage.getItem("katiacm"),
        };

        getOrdersOf(pack).then((res) => {
            if (res.status === 1) {
                localStorage.removeItem("katiacm");
                window.location.href = "/#/gate";
                setLoader(false);
                return;
            }

            if (res.data.length === 0) {
                setLoader(false);
                setHaveSomething(false);
                setToDisplay(emptySpan);
                return;
            } else {
                setHaveSomething(true);
            }

            setItems(res.data);

            const tab_columns = [
                {
                    label: "Nom du produit",
                    field: "name",
                },
                {
                    label: "Quantité",
                    field: "qte",
                },
                {
                    label: "Prix",
                    field: "price",
                },
                {
                    label: "Action",
                    field: "action",
                },
            ];

            const tab_rows = [];

            for (let i = 0; i <= res.data.length - 1; ++i) {
                tab_rows.push({
                    name: (
                        <div className="name-container">
                            <span className="name">{res.data[i].name}</span>
                            {res.data[i].promotion > 0 ? (
                                <span className="promo">
                                    {res.data[i].promotion}%
                                </span>
                            ) : null}
                        </div>
                    ),
                    qte: <span className="qte">x{res.data[i].qte}</span>,
                    price: (
                        <span className="price">
                            {res.data[i].promotion > 0
                                ? (
                                      (res.data[i].price -
                                          (res.data[i].price *
                                              res.data[i].promotion) /
                                              100) *
                                      res.data[i].qte
                                  ).toFixed(2)
                                : (res.data[i].price * res.data[i].qte).toFixed(
                                      2
                                  )}
                            €
                        </span>
                    ),
                    action: (
                        <div className="tab-actions">
                            <button
                                className="tab-btn plus hvr-shrink"
                                onClick={() => {
                                    handlePlusOne(res.data[i]._id);
                                }}
                            >
                                +
                            </button>

                            <button
                                className="tab-btn minus hvr-shrink"
                                onClick={() => {
                                    handleMoinsOne(
                                        res.data[i]._id,
                                        res.data[i].qte
                                    );
                                }}
                            >
                                -
                            </button>

                            <button
                                className="tab-btn remove"
                                onClick={() => {
                                    handleRemoveItem(res.data[i]._id);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ),
                });
            }

            setToDisplay(
                <MDBTable responsive={true}>
                    <MDBTableHead columns={tab_columns} />
                    <MDBTableBody rows={tab_rows} />
                </MDBTable>
            );

            calculTotal(res.data);
            setLoader(false);
        });
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

    /**
     * Envoyer le panier dans les reservations (et le supprimer ensuite)
     * @return {void}
     */
    const buy = () => {
        setLoader(true);

        const pack = {
            token: localStorage.getItem("katiacm"),
            items_list: items,
        };

        addReservation(pack)
            .then((res) => {
                if (res.status === 0) {
                    setCodeQR({
                        codeqr: res.codeqr,
                        text: res.codetxt,
                        total: res.total,
                    });

                    openNotif(
                        "Panier",
                        "Votre réservation a bien été pris en compte ! Il ne vous reste plus qu'a présenter ce code au marché et le tour est joué !",
                        0,
                        "topLeft"
                    );

                    setToDisplay(null);
                    setTotal(0);
                } else if (res.status === 2) {
                    openNotif(
                        "Panier",
                        "Vous avez depassé le quota autorisé ! (max. 3 réservations)",
                        1,
                        "topLeft"
                    );
                }

                setLoader(false);
            })
            .catch((err) => {
                console.error(err);
                openNotif(
                    "Panier",
                    "Veuillez ressayer dans 30 minutes.",
                    1,
                    "topLeft"
                );
                setLoader(false);
            });
    };

    /**
     * Supprimer un produit du panier
     * @param {string} id Identifiant du produit
     * @return {void}
     */
    const handleRemoveItem = (id) => {
        setLoader(true);

        const pack = {
            token: localStorage.getItem("katiacm"),
            id: id,
        };

        removeItem(pack).then((res) => {
            setLoader(false);

            if (res.status === 0) {
                openNotif("", "Article retiré avec succes !", 0);
                display();
            } else {
                openNotif(
                    "",
                    "Un probleme est survenue lors de la suppresion de l'article !",
                    1
                );
            }
        });
    };

    /**
     * Supprimer l'integralite du panier
     * @return {void}
     */
    const clearCart = () => {
        setLoader(true);

        const pack = {
            token: localStorage.getItem("katiacm"),
        };

        removeAllOrdersOf(pack).then((res) => {
            if (res.status === 0) {
                openNotif(
                    "Panier",
                    "Votre panier a bien été supprimé !",
                    0,
                    "topLeft"
                );
                setToDisplay(null);
                setItems(null);
            }

            setLoader(false);
        });
    };

    /**
     * Augmenter ou baisser la quantite
     * @param {string} id Identifiant du produit
     * @return {void}
     */
    const handlePlusOne = (id) => {
        const pack = {
            token: localStorage.getItem("katiacm"),
            id: id,
        };

        plusOne(pack).then((res) => {
            if (res.status === 0) {
                openNotif(
                    "Ajout dans le panier",
                    "Vous venez d'augmenter la quantite d'un produit",
                    0,
                    "topLeft"
                );
                display();
            } else {
                openNotif(
                    "Ajout dans le panier",
                    "Un probleme est survenu lors de votre action",
                    1,
                    "topLeft"
                );
            }
        });
    };

    /**
     * Reduire la quantite 1 a 1
     * @param {string} id Identifiant du produit
     * @param {number} count Quantite du produit
     * @return {void}
     */
    const handleMoinsOne = (id, count) => {
        const pack = {
            token: localStorage.getItem("katiacm"),
            id: id,
        };

        if (parseInt(count, 10) === 1) {
            removeItem(pack).then((res) => {
                openNotif(
                    "Panier",
                    "Produit supprime du panier avec succes",
                    0,
                    "topLeft"
                );

                display();
            });

            return;
        }

        moinsOne(pack).then((res) => {
            if (res.status === 0) {
                openNotif(
                    "Ajout dans le panier",
                    "Vous venez de diminuer la quantite d'un produit",
                    0,
                    "topLeft"
                );

                display();
            } else {
                openNotif(
                    "Ajout dans le panier",
                    "Un probleme est survenu lors de votre action",
                    1,
                    "topLeft"
                );
            }
        });
    };

    /**
     * Calculer le total du panier
     * @param {Array<{}>} data
     */
    const calculTotal = (data) => {
        const parsedData = data.map((item) => {
            return {
                price: parseFloat(item.price),
                qte: parseInt(item.qte),
                promotion: parseInt(item.promotion),
            };
        });

        const total = parsedData.reduce((acc, item) => {
            return (
                acc +
                (item.promotion > 0
                    ? item.price - (item.price * item.promotion) / 100
                    : item.price) *
                    item.qte
            );
        }, 0);

        setTotal(total.toFixed(2));
    };

    useEffect(() => {
        if (!localStorage.getItem("katiacm")) {
            window.location.href = "/#/gate";
        }

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${config.api}/customer/getInfo`).then((res) => {
            if (!res) {
                localStorage.removeItem("katiacm");
                window.location.href = "/#/gate";
            }
        });

        display();
    }, []);

    return (
        <ConfigProvider theme={cart}>
            <Layout>
                {contextHolder}

                {codeQR ? (
                    <div id="codeQR-big-container">
                        <h2>
                            Votre commande a été validée.
                            <br />
                            <span id="codeQR-thx">
                                Merci pour votre achat !
                            </span>
                        </h2>

                        <table id="codeQR-container">
                            <thead id="codeQR-headers">
                                <tr id="codeQR-headers-line">
                                    <th className="codeQR-header">Code QR</th>
                                    <th className="codeQR-header">
                                        Code de reservation
                                    </th>
                                    <th className="codeQR-header">
                                        Montant (TTC)
                                    </th>
                                </tr>
                            </thead>

                            <tbody id="codeQR-datas">
                                <tr id="codeQR-datas-line">
                                    <td className="codeQR-data">
                                        <img
                                            src={codeQR.codeqr}
                                            alt={`Code QR contenant le texte : ${codeQR.text}`}
                                        />
                                    </td>

                                    <td className="codeQR-data res">
                                        <RCode code={codeQR.text} />
                                    </td>

                                    <td className="codeQR-data">
                                        <span>{codeQR.total}€</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Link
                            id="codeQR-redirection"
                            className="hvr-shrink"
                            to="/customer"
                        >
                            Aller sur votre <b>Espace Client</b>
                        </Link>
                    </div>
                ) : null}

                {loader ? (
                    <div className="loader">
                        <Vortex
                            visible={true}
                            height="100"
                            width="100"
                            radius={1}
                            ariaLabel="vortex-loading"
                            wrapperStyle={{}}
                            wrapperClass="vortex-wrapper"
                            colors={[
                                "#cedbfe",
                                "#fecfef",
                                "#cedbfe",
                                "#fecfef",
                                "#cedbfe",
                                "#fecfef",
                            ]}
                        />
                    </div>
                ) : null}

                {toDisplay ? (
                    <div id="cart-table-container">
                        {toDisplay}

                        {haveSomething ? (
                            <div id="cart-total-container">
                                <div id="cart-total-btns">
                                    <Button
                                        className=""
                                        onClick={() => {
                                            buy();
                                        }}
                                    >
                                        Réserver ({total}€ TTC)
                                    </Button>

                                    <button
                                        className="cart-back-btn"
                                        onClick={goShop}
                                    >
                                        Retourner à la boutique
                                    </button>

                                    <Button
                                        danger
                                        className="cart-clear-btn"
                                        onClick={clearCart}
                                    >
                                        Vider
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </Layout>
        </ConfigProvider>
    );
}
