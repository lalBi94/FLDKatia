import { Button, Input, notification } from "antd";
import { useState, useEffect } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import config from "../../../../../../global.json";
import "../popup.scss";

export default function ModifyItem({ handleClose }) {
    const [notif, contextNotif] = notification.useNotification();
    const [selectedItem, setSelectedItem] = useState({});
    const [messages, setMessages] = useState([]);
    const [supressLoader, setSupressLoader] = useState(false);
    const [allSupressLoader, setAllSupressLoader] = useState(false);

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

    const handleDelete = () => {
        setSupressLoader(true);

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            id: selectedItem._id,
        });

        cipherRequest(toSend, `${config.api}/support/deleteMessage`).then(
            (res) => {
                if (res.status === 0) {
                    openNotif(
                        "Administration",
                        `Le message portant l'objet de ${selectedItem.objet} vient d'etre supprimé.`,
                        0,
                        "topLeft"
                    );

                    setMessages(
                        messages.filter((m) => m._id !== selectedItem._id)
                    );

                    setSelectedItem({});
                } else {
                    openNotif(
                        "Administration",
                        `Une erreur est survenue lors de la suppression de ${selectedItem.objet}.`,
                        1,
                        "topLeft"
                    );
                }
                setSupressLoader(false);
            }
        );
    };

    const handleDeleteAll = () => {
        setAllSupressLoader(true);
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
            id: selectedItem._id,
        });

        cipherRequest(toSend, `${config.api}/support/deleteAll`).then((res) => {
            if (res.status === 0) {
                openNotif(
                    "Administration",
                    `La messagerie a été vidée avec succès !`,
                    0,
                    "topLeft"
                );
                setMessages([]);
                setSelectedItem({});
            } else {
                openNotif(
                    "Administration",
                    `Une erreur est survenue lors de la suppression de tous les messages.`,
                    1,
                    "topLeft"
                );
            }

            setAllSupressLoader(false);
        });
    };

    const handleSelect = (item) => {
        if (JSON.stringify(item) === JSON.stringify(selectedItem)) {
            setSelectedItem({});
        } else {
            setSelectedItem(item);
        }
    };

    useEffect(() => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${config.api}/support/getMessages`).then(
            (res) => {
                if (res.status === 0) {
                    setMessages(res.data);
                }
            }
        );
    }, []);

    return (
        <div className="popup-container">
            {contextNotif}

            <span className="popup-title">Support</span>

            <div className="popup-list-w-actions">
                {messages.length > 0 ? (
                    Object.keys(messages).map((m, k) => (
                        <div
                            className={`popup-list-data ${
                                selectedItem._id === messages[m]._id
                                    ? "active"
                                    : ""
                            }`}
                            key={k}
                            onClick={() => {
                                handleSelect(messages[m]);
                            }}
                        >
                            <div>
                                <b>Objet</b> "{messages[m].objet}" de{" "}
                                <b>{messages[m]._id}</b>
                            </div>
                        </div>
                    ))
                ) : (
                    <span>Pas de message pour le moment !</span>
                )}
            </div>

            {selectedItem._id ? (
                <div className="popup-modify">
                    <h4>Objet ➜ {selectedItem.objet}</h4>

                    <p>{selectedItem.content}</p>
                    <h4>Contact ➜ {selectedItem.contact}</h4>
                </div>
            ) : null}
            <div className="popup-btn-container">
                {selectedItem._id ? (
                    <Button
                        danger
                        loading={supressLoader}
                        onClick={handleDelete}
                    >
                        Supprimer
                    </Button>
                ) : null}

                {messages.length > 0 ? (
                    <Button
                        loading={allSupressLoader}
                        danger
                        onClick={handleDeleteAll}
                    >
                        Tout supprimer
                    </Button>
                ) : null}

                <Button danger className="" onClick={handleClose}>
                    Quitter
                </Button>
            </div>
        </div>
    );
}
