import { useState } from "react";
import { cipherRequest } from "../../../../../../services/KTSec/KTSec";
import "../popup.scss";
import config from "../../../../../../global.json";
import { getAddress } from "../../../../../../services/API/Us";

export default function ChangeCoords({ handleClose }) {
    const [status, setStatus] = useState(null);
    const [selected, setSelected] = useState(null);
    const [adress, setAddress] = useState("");
    const [linkToMap, setLinkToMap] = useState("");
    const [tel, setTel] = useState("");

    const handleSelected = (e) => {
        setStatus(null);
        setSelected(e.target.id);
    };

    const handleAddress = (e) => {
        setStatus(null);
        setAddress(e.target.value);
    };

    const handleLinkToMap = (e) => {
        setStatus(null);
        setLinkToMap(e.target.value);
    };

    const handleTel = (e) => {
        setStatus(null);
        setTel(e.target.value);
    };

    const handleSend = (e) => {
        setStatus(null);

        const toSend = {
            token: localStorage.getItem("katiacm"),
        };

        switch (selected) {
            case "address": {
                getAddress().then((v) => {
                    toSend.value = {
                        value: adress,
                        linktomap: v.linktomap,
                    };
                });

                cipherRequest(
                    JSON.stringify(toSend),
                    `${config.api}/us/updateAddress`
                ).then((res) => {
                    if (res.status === 0) {
                        setStatus("Adresse change avec succes.");
                    } else {
                        setStatus("Une erreur est survenue.");
                    }
                });

                return;
            }

            case "tel": {
                toSend.value = tel;

                cipherRequest(
                    JSON.stringify(toSend),
                    `${config.api}/us/updateTel`
                ).then((res) => {
                    if (res.status === 0) {
                        setStatus("Numero de telephone change avec succes.");
                    } else {
                        setStatus("Une erreur est survenue.");
                    }
                });

                return;
            }

            case "linktomap": {
                getAddress().then((v) => {
                    toSend.value = {
                        value: v.value,
                        linktomap: linkToMap,
                    };
                });

                cipherRequest(
                    JSON.stringify(toSend),
                    `${config.api}/us/updateAddress`
                ).then((res) => {
                    if (res.status === 0) {
                        setStatus(
                            "Lien conduisant a une map change avec succes."
                        );
                    } else {
                        setStatus("Une erreur est survenue.");
                    }
                });

                return;
            }
        }
    };

    return (
        <div className="popup-container">
            <span className="popup-title">Changer les valeurs de </span>

            <div className="popup-list-w-actions">
                <div
                    id="tel"
                    onClick={handleSelected}
                    className={`popup-list-data ${
                        selected === "tel" ? "active" : ""
                    }`}
                >
                    Numero de telephone
                </div>
                <div
                    id="address"
                    onClick={handleSelected}
                    className={`popup-list-data ${
                        selected === "address" ? "active" : ""
                    }`}
                >
                    Adresse
                </div>

                <div
                    id="linktomap"
                    onClick={handleSelected}
                    className={`popup-list-data ${
                        selected === "linktomap" ? "active" : ""
                    }`}
                >
                    Lien vers adresse
                </div>
            </div>

            {selected ? (
                selected === "address" ? (
                    <input
                        type="text"
                        placeholder="Nouvelle adresse"
                        className="ipt"
                        onChange={handleAddress}
                    />
                ) : null
            ) : null}

            {selected ? (
                selected === "tel" ? (
                    <input
                        type="text"
                        placeholder="Nouveau numero"
                        className="ipt"
                        onChange={handleTel}
                    />
                ) : null
            ) : null}

            {selected ? (
                selected === "linktomap" ? (
                    <input
                        type="text"
                        placeholder="Nouveau lien menant a l'adresse"
                        className="ipt"
                        onChange={handleLinkToMap}
                    />
                ) : null
            ) : null}

            {status ? <span className="succes">{status}</span> : null}

            <div className="popup-btn-container">
                <button className="btn hvr-shrink" onClick={handleClose}>
                    Quitter
                </button>

                <button className="btn hvr-shrink" onClick={handleSend}>
                    Envoyer
                </button>
            </div>
        </div>
    );
}
