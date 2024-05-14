import { useState, useRef } from "react";
import "../popup.scss";
import "hover.css";
import { setItem } from "../../../../../../services/API/Items";
import { Button, Input, notification } from "antd";

/**
 * [ADMIN FEATURES] Creer un produit
 * @param {{handleClose: <void>}} param0 Fonction qui fermera ce formulaire
 * @return {HTMLElement}
 */
export default function CreateItem({ handleClose }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [promotion, setPromotion] = useState("");
    const [imgRef, setImgRef] = useState(null);
    const [category, setCategory] = useState("");
    const [notif, contextNotif] = notification.useNotification();

    const [refs, _] = useState({
        name: useRef(null),
        price: useRef(null),
        promotion: useRef(null),
        imgRef: useRef(null),
        category: useRef(null),
    });

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
     * Nom du produit
     * @param {Event} e
     */
    const handleName = (e) => {
        setName(e.target.value);
    };

    /**
     * Prix du produit
     * @param {Event} e
     */
    const handlePrice = (e) => {
        setPrice(e.target.value);
    };

    /**
     * Categorie du produit
     * @param {Event} e
     */
    const handleCategory = (e) => {
        setCategory(e.target.value);
    };

    /**
     * Promotion du produit
     * @param {Event} e
     */
    const handlePromotion = (e) => {
        setPromotion(e.target.value);
    };

    /**
     * Url de l'image du produit
     * @param {Event} e
     */
    const handleImgRef = (e) => {
        e.preventDefault();

        const image = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const fileExtension = image.name.split(".").pop();
            if (
                !["jpg", "jpeg", "png", "gif", "tiff"].includes(
                    fileExtension.toLowerCase()
                )
            ) {
                return;
            }

            setImgRef(reader.result);
        };

        if (image) {
            reader.readAsDataURL(image);
        }
    };

    /**
     * Creer le produit
     * @return {void}
     */
    const handleCreateItem = () => {
        if (!name || !price || !promotion || !imgRef) {
            return;
        }

        setItem({
            imgRef: imgRef.split(",")[1],
            token: localStorage.getItem("katiacm"),
            name: name,
            price: price,
            promotion: promotion,
            category: category,
        }).then((res) => {
            if (res.status === 0) {
                openNotif(
                    "Administration",
                    "Produit cree avec succes !",
                    0,
                    "topLeft"
                );
            } else {
                openNotif(
                    "Administration",
                    "Une erreur est survenue...",
                    1,
                    "topLeft"
                );
            }
        });
    };

    /**
     * Vider les champs
     * @return {void}
     */
    const handleClear = () => {
        for (const e in refs) {
            refs[e].current.value = "";
        }

        setImgRef(null);
    };

    return (
        <div className="popup-container">
            {contextNotif}
            <span className="popup-title">Création de Produit</span>

            {imgRef ? <img className="preview" src={imgRef} alt="" /> : null}

            <Input
                ref={refs.name}
                onChange={handleName}
                className="ipt"
                type="text"
                placeholder="Nom"
            />
            <Input
                ref={refs.price}
                onChange={handlePrice}
                className="ipt"
                min={0}
                type="number"
                placeholder="Prix"
            />
            <Input
                ref={refs.promotion}
                onChange={handlePromotion}
                className="ipt"
                type="number"
                placeholder="Promo (0 si non)"
                min={0}
                max={100}
            />

            <input
                ref={refs.imgRef}
                onChange={handleImgRef}
                type="file"
                accept="image/*"
                placeholder="Url de l'image"
            />

            <div className="popup-custom-2-entity">
                <span className="text">Catégorie</span>

                <select ref={refs.category} onChange={handleCategory}>
                    <option value="Entrée">Entrée</option>
                    <option value="Plat">Plat</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Autres">Autres</option>
                </select>
            </div>

            <div className="popup-btn-container">
                <Button className="" onClick={handleCreateItem}>
                    Creer
                </Button>
                <Button danger className="" onClick={handleClose}>
                    Quitter
                </Button>
                <Button danger className="" onClick={handleClear}>
                    Vider
                </Button>
            </div>
        </div>
    );
}
