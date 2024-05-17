import { useState } from "react";
import "./MyAccount.scss";
import "hover.css";
import { cipherRequest } from "../../../../services/KTSec/KTSec";
import config from "../../../../global.json";
import { Tag, Button, Input, notification } from "antd";

/**
 * Visualiser les informations du client
 * @param {{data: {}}} param0
 * @return {HTMLElement}
 */
export default function MyAccount({ data }) {
    const [firstNameM, setFirstNameM] = useState("");
    const [lastNameM, setLastNameM] = useState("");
    const [emailM, setEmailM] = useState("");
    // const [passwordM, setPasswordM] = useState("");
    const [isModify, setIsModify] = useState({
        firstname: false,
        lastname: false,
        password: false,
        email: false,
    });
    const [notif, notifContext] = notification.useNotification();

    const handleIsModify = (field) => {
        setIsModify({ ...isModify, [field]: !isModify[field] });
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
     * Email du client
     * @param {Event} e
     */
    const handleEmail = (e) => {
        setEmailM(e.target.value);
    };

    /**
     * Prenom du client
     * @param {Event} e
     */
    const handleFirstname = (e) => {
        setFirstNameM(e.target.value);
    };

    /**
     * Nom de famille du client
     * @param {Event} e
     */
    const handleLastname = (e) => {
        setLastNameM(e.target.value);
    };

    /**
     * Changer une des inputs
     * @param {"email"|"firstname"|"lastname"|} what Mode de changement
     */
    const changeData = (what) => {
        switch (what) {
            case "firstname": {
                const toSend = JSON.stringify({
                    firstname: firstNameM,
                    token: localStorage.getItem("katiacm"),
                });
                cipherRequest(
                    toSend,
                    `${config.api}/customer/changeFirstname`
                ).then((status) => {
                    switch (status.data.status) {
                        case 0: {
                            openNotif(
                                "Espace client",
                                "Votre prénom a bien été changé avec succès. Veuillez vous reconnecter pour voir les modifications.",
                                0,
                                "topLeft"
                            );
                            break;
                        }

                        case 1: {
                            openNotif(
                                "Espace client",
                                "Une erreur est survenue lors du changement de votre prénom. Veuillez réessayer ultérieurement ou contacter le support technique.",
                                1,
                                "topLeft"
                            );
                            break;
                        }
                    }
                });

                setFirstNameM("");
                handleIsModify("firstname");
                break;
            }

            case "lastname": {
                const toSend = JSON.stringify({
                    lastname: lastNameM,
                    token: localStorage.getItem("katiacm"),
                });
                cipherRequest(
                    toSend,
                    `${config.api}/customer/changeLastname`
                ).then((status) => {
                    switch (status.data.status) {
                        case 0: {
                            openNotif(
                                "Espace client",
                                "Votre nom de famille a bien été changé avec succès. Veuillez vous reconnecter pour voir les modifications.",
                                0,
                                "topLeft"
                            );
                            break;
                        }

                        case 1: {
                            openNotif(
                                "Espace client",
                                "Une erreur est survenue lors du changement de votre nom de famille. Veuillez réessayer ultérieurement ou contacter le support technique.",
                                1,
                                "topLeft"
                            );
                            break;
                        }
                    }
                });

                setLastNameM("");
                handleIsModify("lastname");
                break;
            }

            case "email": {
                const toSend = JSON.stringify({
                    email: emailM,
                    token: localStorage.getItem("katiacm"),
                });
                cipherRequest(
                    toSend,
                    `${config.api}/customer/changeEmail`
                ).then((status) => {
                    switch (status.data.status) {
                        case 0: {
                            openNotif(
                                "Espace client",
                                "Votre email a bien été changé avec succès. Veuillez vous reconnecter pour voir les modifications.",
                                0,
                                "topLeft"
                            );
                            break;
                        }

                        case 1: {
                            openNotif(
                                "Espace client",
                                "Une erreur est survenue lors du changement de votre email. Veuillez réessayer ultérieurement ou contacter le support technique.",
                                1,
                                "topLeft"
                            );
                            break;
                        }

                        case 2: {
                            openNotif(
                                "Espace client",
                                "Cette adresse mail n'est pas disponible ou n'est pas conforme.",
                                1,
                                "topLeft"
                            );
                            break;
                        }
                    }
                });

                setEmailM("");
                handleIsModify("email");
                break;
            }
        }
    };

    return (
        <div id="myaccount-container">
            {notifContext}

            {!isModify.firstname ? (
                <div className="data-container data">
                    <span>{data.firstname}</span>
                    <span
                        className="data-modifier hvr-shrink"
                        onClick={() => handleIsModify("firstname")}
                    >
                        🖊️
                    </span>
                </div>
            ) : (
                <div className="data-container data">
                    <Input
                        type="texte"
                        onChange={handleFirstname}
                        placeholder={data.firstname}
                    />
                    <div className="data-modif-btns">
                        <Button
                            className=""
                            onClick={() => changeData("firstname")}
                        >
                            Modifier
                        </Button>
                        <Button
                            className=""
                            danger
                            onClick={() => handleIsModify("firstname")}
                        >
                            Annuler
                        </Button>
                    </div>
                </div>
            )}

            {!isModify.lastname ? (
                <div className="data-container data">
                    <span>{data.lastname}</span>
                    <span
                        className="data-modifier hvr-shrink"
                        onClick={() => handleIsModify("lastname")}
                    >
                        🖊️
                    </span>
                </div>
            ) : (
                <div className="data-container data">
                    <Input
                        type="texte"
                        onChange={handleLastname}
                        placeholder={data.lastname}
                    />
                    <div className="data-modif-btns">
                        <Button
                            className=""
                            onClick={() => changeData("lastname")}
                        >
                            Modifier
                        </Button>
                        <Button
                            className=""
                            danger
                            onClick={() => handleIsModify("lastname")}
                        >
                            Annuler
                        </Button>
                    </div>
                </div>
            )}

            {!isModify.email ? (
                <div className="data-container data">
                    <span>{data.email}</span>
                    <span
                        className="data-modifier hvr-shrink"
                        onClick={() => handleIsModify("email")}
                    >
                        🖊️
                    </span>
                </div>
            ) : (
                <div className="data-container data">
                    <Input
                        type="texte"
                        onChange={handleEmail}
                        placeholder={data.email}
                    />
                    <div className="data-modif-btns">
                        <Button
                            className=""
                            onClick={() => changeData("email")}
                        >
                            Modifier
                        </Button>
                        <Button
                            className=""
                            danger
                            onClick={() => handleIsModify("email")}
                        >
                            Annuler
                        </Button>
                    </div>
                </div>
            )}

            <div className="data-container data">
                <span>*********</span>
                <span className="data-modifier">🖊️</span>
            </div>

            <div className="data-container">
                <Tag color="#00b96b">ID #{data._id}</Tag>
            </div>
        </div>
    );
}
