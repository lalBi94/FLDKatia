import { useContext, useEffect, useState } from "react";
import { SHA512 } from "crypto-js";
import "./Gate.scss";
import Layout from "../../Layout/Layout";
import config from "../../global.json";
import { cipherRequest } from "../../services/KTSec/KTSec";
import { Vortex } from "react-loader-spinner";
import CGU from "../../assets/CGU.pdf";
import { Input, Button, notification, Checkbox } from "antd";
import { ConfigProvider } from "antd";
import gate from "../Themes/customer_and_gate.json";

/**
 * Portal de connexion/inscription
 * @return {HTMLElement}
 */
export default function Gate() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conmfirmPassword, setConfirmPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [lockDown, setLockDown] = useState(false);
    const [loader, setLoader] = useState(false);
    const [cguCheck, setCguCheck] = useState(false);
    const [notif, contexteHandler] = notification.useNotification();

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

    useEffect(() => {
        if (localStorage.getItem("katiacm")) {
            window.location.href = "/#/customer";
        }
    }, []);

    /**
     * Les CGU
     * @param {Event} e
     */
    const handleCguCheck = (e) => {
        setCguCheck(e.target.checked);
    };

    /**
     * Nom de famille du futur client
     * @param {Event} e
     */
    const handleFirstname = (e) => {
        setFirstname(e.target.value);
    };

    /**
     * Prenom du futur client
     * @param {Event} e
     */
    const handleLastname = (e) => {
        setLastname(e.target.value);
    };

    /**
     * Email du futur client
     * @param {Event} e
     */
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    /**
     * Mot de passe du futur client
     * @param {Event} e
     */
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    /**
     * Confirmation du mot de passe du futur client
     * @param {Event} e
     */
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    /**
     * Switch -> Login
     */
    const handleLogin = () => {
        setIsLogin(true);
    };

    /**
     * Switch -> Register
     */
    const handleRegister = () => {
        setIsLogin(false);
    };

    /**
     * Envoyer le forumlaire d'inscription
     * @return {void}
     */
    const handleRegisterSubmit = () => {
        setLockDown(true);
        setLoader(true);

        if (
            firstname.length === 0 ||
            lastname.length === 0 ||
            password.length === 0 ||
            conmfirmPassword.length === 0 ||
            email.length === 0 ||
            !cguCheck
        ) {
            openNotif(
                "Inscription",
                "Vous devez remplir tous les champs !",
                1,
                "topLeft"
            );
            setLoader(false);
            setLockDown(false);
            return;
        }

        if (!/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            openNotif("Inscription", "Email invalide", 1, "topLeft");
            setLoader(false);
            setLockDown(false);
            return;
        }

        if (conmfirmPassword !== password) {
            openNotif(
                "Inscription",
                "Les deux mots de passe ne sont pas identique.",
                1,
                "topLeft"
            );
            setLoader(false);
            setLockDown(false);
            return;
        }

        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{6,})$/.test(password)) {
            openNotif(
                "Inscription",
                "Votre mot de passe doit contenir 6 caracteres, une majuscule et un charactere special.",
                1,
                "topLeft"
            );
            setLoader(false);
            setLockDown(false);
            return;
        }

        const hash = SHA512(password).toString();
        const toSend = JSON.stringify({
            firstname,
            lastname,
            email,
            password: hash,
        });

        cipherRequest(toSend, `${config.api}/customer/register`).then(
            (data) => {
                switch (data.status) {
                    case 0: {
                        localStorage.setItem("katiacm", data.token);
                        window.location.href = "/#/customer";
                        break;
                    }

                    case 1: {
                        break;
                    }

                    case 2: {
                        break;
                    }
                }

                setLoader(false);
                setLockDown(false);
            }
        );
    };

    /**
     * Envoyer le forumlaire de connexion
     * @return {void}
     */
    const handleLoginSubmit = () => {
        setLockDown(true);
        setLoader(true);

        if (email.length === 0 || password.length === 0) {
            openNotif(
                "Connexion",
                "Vous devez remplir tous les champs !",
                1,
                "topLeft"
            );
            return;
        }

        const hash = SHA512(password).toString();
        const toSend = JSON.stringify({ email, password: hash });

        cipherRequest(toSend, `${config.api}/customer/login`).then((token) => {
            if (token) {
                localStorage.setItem("katiacm", token);
                window.location.href = "/#/customer";
            } else {
                openNotif(
                    "Connexion",
                    "Compte utilisateur introuvable ...",
                    1,
                    "topLeft"
                );
            }

            setLoader(false);
            setLockDown(false);
        });
    };

    return (
        <ConfigProvider theme={gate}>
            <Layout>
                <div id="gate-container">
                    {contexteHandler}
                    <div id="selector">
                        <Button className="" onClick={handleLogin}>
                            Connexion
                        </Button>

                        <Button onClick={handleRegister} className="">
                            Inscription
                        </Button>
                    </div>
                    {isLogin ? (
                        <div id="login-container">
                            <h3>Connexion</h3>

                            <Input
                                className="ipt"
                                onChange={handleEmail}
                                type="email"
                                placeholder="E-mail"
                                disabled={lockDown}
                            />

                            <Input
                                type="password"
                                className="ipt"
                                maxLength={50}
                                placeholder="Mot de passe"
                                onChange={handlePassword}
                                disabled={lockDown}
                            />

                            <Button
                                loading={loader}
                                onClick={handleLoginSubmit}
                                className="login-btn"
                                disabled={lockDown}
                            >
                                Se connecter
                            </Button>
                        </div>
                    ) : (
                        <div id="register-container">
                            <h3>Inscription</h3>
                            <Input
                                className="ipt"
                                onChange={handleFirstname}
                                type="text"
                                placeholder="Prenom"
                                disabled={lockDown}
                            />
                            <Input
                                className="ipt"
                                onChange={handleLastname}
                                type="text"
                                placeholder="Nom"
                                disabled={lockDown}
                            />
                            <Input
                                className="ipt"
                                onChange={handleEmail}
                                type="email"
                                placeholder="E-mail"
                                disabled={lockDown}
                            />
                            <Input
                                className="ipt"
                                onChange={handlePassword}
                                type="password"
                                placeholder="Mot de passe"
                                disabled={lockDown}
                            />
                            <Input
                                className="ipt"
                                onChange={handleConfirmPassword}
                                type="password"
                                placeholder="Confirmation le mot de passe"
                                disabled={lockDown}
                            />

                            <Checkbox
                                checked={cguCheck}
                                disabled={lockDown}
                                onChange={handleCguCheck}
                            >
                                {" "}
                                En cliquant sur "S'inscrire", vous acceptez les{" "}
                                <a href={CGU} download={true}>
                                    CGU
                                </a>
                            </Checkbox>

                            <Button
                                loading={loader}
                                onClick={handleRegisterSubmit}
                                className="register-btn"
                                disabled={!cguCheck}
                            >
                                S'inscrire
                            </Button>
                        </div>
                    )}
                </div>
            </Layout>
        </ConfigProvider>
    );
}
