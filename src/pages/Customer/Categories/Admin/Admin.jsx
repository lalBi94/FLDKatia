import "./Admin.scss";
import { useEffect, useState } from "react";
import CreateItem from "./Forms/Items/CreateItem";
import DeleteItem from "./Forms/Items/DeleteItem";
import ModifyItem from "./Forms/Items/ModifyItem";
import ShowReservation from "./Forms/Customers/ShowReservations";
import ShowReservationsActive from "./Forms/Caisse/ShowReservationsActive";
import { cipherRequest } from "../../../../services/KTSec/KTSec";
import config from "../../../../global.json";
import axios from "axios";
import "hover.css";
import { getItemsLength } from "../../../../services/API/Items";
import ChangeCoords from "./Forms/Us/ChangeCoords";
import { Button } from "antd";

/**
 * [ADMIN FEATURES] Administration du site
 * @return {HTMLElement}
 */
export default function Admin() {
    const [form, setForm] = useState(null);
    const [solde, setSolde] = useState({ av: "██████", ca: "██████" });
    const [nbItems, setNbItems] = useState("██████");
    const [nbCustomer, setNbCustomer] = useState("██████");

    /**
     * Ouvrir/Fermer le formulaire
     * @return {void}
     */
    const handleCloseForm = () => {
        setForm(null);
    };

    const handleGetStats = () => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${config.api}/reservation/getSolde`).then(
            (res) => {
                setSolde({ av: res.av.toFixed(2), ca: res.ca.toFixed(2) });
            }
        );

        getItemsLength().then((res) => {
            setNbItems(parseInt(res.n));
        });

        axios.post(`${config.api}/customer/getCustomersLength`).then((res) => {
            setNbCustomer(parseInt(res.data.n));
        });
    };

    /**
     * Faire poper un formulaire
     * @param {string} what
     */
    const handleForm = (what) => {
        switch (what) {
            case "create_item": {
                setForm(<CreateItem handleClose={handleCloseForm} />);
                break;
            }

            case "delete_item": {
                setForm(<DeleteItem handleClose={handleCloseForm} />);
                break;
            }

            case "modify_item": {
                setForm(<ModifyItem handleClose={handleCloseForm} />);
                break;
            }

            case "show_reservation": {
                setForm(<ShowReservation handleClose={handleCloseForm} />);
                break;
            }

            case "check_code": {
                setForm(<CheckCode handleClose={handleCloseForm} />);
                break;
            }

            case "show_reservations_active": {
                setForm(
                    <ShowReservationsActive handleClose={handleCloseForm} />
                );
                break;
            }

            case "coords": {
                setForm(<ChangeCoords handleClose={handleCloseForm} />);
                break;
            }
        }

        window.scrollTo(0, 0);
    };

    useEffect(() => {
        handleGetStats();
    }, []);

    return (
        <div id="admin-container">
            {form ? <div id="admin-form-popup">{form}</div> : null}

            <div className="admin-category">
                <h3 className="admin-category-title">En Caisse</h3>
                <div className="admin-category-btns">
                    <Button
                        className=""
                        onClick={() => {
                            handleForm("show_reservations_active");
                        }}
                    >
                        Voir les réservations courantes
                    </Button>
                </div>

                <h3 className="admin-category-title">
                    Données utiles
                    <Button className="" onClick={handleGetStats}>
                        ↺
                    </Button>
                </h3>

                <div id="admin-solde">
                    <span id="admin-solde-CA">
                        Recette <br /> <nobr>[ {solde.ca} € ]</nobr>
                    </span>
                    <span id="admin-solde-AV">
                        A Venir <br /> <nobr>[ {solde.av} € ]</nobr>
                    </span>
                    <span id="admin-solde-O">
                        Nombre d'inscrits <br /> <nobr>[ {nbCustomer} ]</nobr>
                    </span>
                    <span id="admin-solde-O">
                        Nombre de produits <br /> <nobr>[ {nbItems} ]</nobr>
                    </span>
                </div>

                <h3 className="admin-category-title">Produits</h3>
                <div className="admin-category-btns">
                    <Button
                        onClick={() => {
                            handleForm("create_item");
                        }}
                        className=""
                    >
                        Créer un Produit
                    </Button>

                    <Button
                        onClick={() => {
                            handleForm("delete_item");
                        }}
                        className=""
                    >
                        Supprimer des Produits
                    </Button>

                    <Button
                        onClick={() => {
                            handleForm("modify_item");
                        }}
                        className=""
                    >
                        Modifier un Produit
                    </Button>
                </div>
            </div>

            <div className="admin-category">
                <h3 className="admin-category-title">Clients</h3>

                <div className="admin-category-btns">
                    <Button
                        className=""
                        onClick={() => {
                            handleForm("show_reservation");
                        }}
                    >
                        Voir les reservations
                    </Button>
                </div>
            </div>

            <div className="admin-category">
                <h3 className="admin-category-title">Support</h3>

                <div className="admin-category-btns">
                    <Button className="">Voir les tickets (non impl)</Button>
                    <Button
                        className=""
                        onClick={() => {
                            handleForm("coords");
                        }}
                    >
                        Modifier les coordonnees
                    </Button>
                </div>
            </div>
        </div>
    );
}
