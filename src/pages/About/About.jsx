import "./About.scss";
import Layout from "./../../Layout/Layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAddress, getTel } from "../../services/API/Us";
import { useInformations } from "../../hooks/useInformations";
import { Input, Button, notification, Checkbox } from "antd";
import { cipherRequest } from "../../services/KTSec/KTSec";
import global from "../../global.json";

export default function About() {
    const [tel, setTel] = useState("██████");
    const [address, setAddress] = useState({
        linktomap: "",
        value: "██████",
    });
    const informations = useInformations();
    const [notif, notifContext] = notification.useNotification();
    const [acceptCheck, setAcceptCheck] = useState(false);
    const [object, setObject] = useState("");
    const [contact, setContact] = useState("");
    const [request, setRequest] = useState("");
    const [sendLoader, setSendLoader] = useState(false);

    const handleObject = (e) => {
        setObject(e.target.value);
    };

    const handleContact = (e) => {
        setContact(e.target.value);
    };

    const handleRequest = (e) => {
        setRequest(e.target.value);
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

    const handleSupport = () => {
        // A voir ??
        // if (!localStorage.getItem("katiacm")) {
        //     openNotif(
        //         "Support",
        //         "Vous devez etre connecte pour envoyer un message au support",
        //         1,
        //         "topLeft"
        //     );
        //     return;
        // }

        setSendLoader(true);

        if (
            object.trim().length === 0 ||
            contact.trim().length === 0 ||
            request.trim().length === 0
        ) {
            openNotif(
                "Support",
                "Tous les champs doivent être remplis !",
                1,
                "topLeft"
            );
            return;
        }

        const toSend = JSON.stringify({
            from: localStorage.getItem("katiacm"),
            content: request,
            objet: object,
            contact,
        });

        console.log(toSend);

        cipherRequest(toSend, `${global.api}/support/sendMessage`)
            .then((res) => {
                console.log(res);
                if (res.status === 0) {
                    openNotif(
                        "Support",
                        "Votre message a été envoyé avec succès !",
                        0,
                        "topLeft"
                    );
                } else {
                    openNotif(
                        "Support",
                        "Une erreur est survenue !",
                        1,
                        "topLeft"
                    );
                }

                setSendLoader(false);
            })
            .catch((err) => {
                openNotif("Support", "Une erreur est survenue !", 1, "topLeft");
                setSendLoader(false);
            });
    };

    useEffect(() => {
        if (informations.tel.length === 0) {
            getTel().then((res) => {
                setTel(res.tel);
            });

            getAddress().then((res) => {
                setAddress({ linktomap: res.linktomap, value: res.value });
            });
        } else {
            setTel(informations.tel);
            setAddress(informations.address);
        }
    }, []);

    const handleAcceptCheck = () => {
        setAcceptCheck(!acceptCheck);
    };

    return (
        <Layout>
            {notifContext}
            <div id="about-container">
                <div id="map-container">
                    <h3 id="map-title">Localisation</h3>
                    <p id="map-google-address">
                        <Link to={address ? address.linktomap : null}>
                            {address ? address.value : null}
                        </Link>
                    </p>
                    <div className="mapouter">
                        <div className="gmap_canvas">
                            <iframe
                                width="550"
                                height="550"
                                id="gmap_canvas"
                                src="https://maps.google.com/maps?q=Pl.+de+la+R%C3%A9publique%2C+77300+Fontainebleau&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                title="Google Map"
                            ></iframe>
                            <a href="https://timenowin.net/">online clock</a>
                            <br />
                            <a href="https://www.analarmclock.com/"></a>
                            <br />
                            <style>
                                {`
                                    .mapouter {
                                    position: relative;
                                    text-align: right;
                                    height: 550px;
                                    width: 550px;
                                    }
                                    .gmap_canvas {
                                    overflow: hidden;
                                    background: none !important;
                                    height: 550px;
                                    width: 550px;
                                    }
                                `}
                            </style>
                            <a href="https://www.embedmaps.co">
                                custom google maps embed
                            </a>
                        </div>
                    </div>{" "}
                </div>

                <div id="left-side-container">
                    <div id="contact-container">
                        <h3 id="contact-title">Coordonnées</h3>

                        <div id="contact-list">
                            <span className="contact-el">
                                Numéro de téléphone ➜ {tel ? tel : null}
                            </span>
                            <span className="contact-el">
                                Adresse mail ➜ abdellikatia@gmail.com
                            </span>
                        </div>
                    </div>

                    <div id="support-container">
                        <h3 id="support-title">Support en ligne</h3>
                        <div id="support-content">
                            <div id="support-ipts">
                                <Input
                                    placeholder="Objet"
                                    type="text"
                                    maxLength={20}
                                    onC
                                    showCount
                                    onChange={handleObject}
                                />
                                <Input
                                    placeholder="Un moyen de vous contacter"
                                    type="text"
                                    maxLength={15}
                                    showCount
                                    onChange={handleContact}
                                />
                                <Input.TextArea
                                    placeholder="Votre requete"
                                    type="text"
                                    maxLength={350}
                                    onChange={handleRequest}
                                    showCount
                                />
                            </div>

                            <div id="support-checkbox">
                                <Checkbox
                                    onChange={handleAcceptCheck}
                                    checked={acceptCheck}
                                >
                                    En cochant cette case, vous vous engagez à
                                    utiliser ce service de contact de manière
                                    responsable{" "}
                                </Checkbox>
                            </div>

                            <div id="support-btns">
                                <Button
                                    onClick={handleSupport}
                                    loading={sendLoader}
                                    disabled={!acceptCheck}
                                >
                                    Envoyer
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
