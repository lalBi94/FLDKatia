import { useEffect, useState } from "react";
import "../popup.scss";
import { deleteItems, getItems } from "../../../../../../services/API/Items";
import { Button, notification } from "antd";

/**
 * [ADMIN FEATURES] Supprimer un produit
 * @param {{handleClose: <void>}} param0 Fonction qui fermera ce formulaire
 * @return {HTMLElement}
 */
export default function DeleteItem({ handleClose }) {
    const [showedItems, setShowedItems] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [notif, contextNotif] = notification.useNotification();

    /**
     * Supprimer les produits selectionnes
     * @return {void}
     */
    const handleDelete = () => {
        if (selectedItems.length === 0) {
            return;
        }

        const pack = {
            token: localStorage.getItem("katiacm"),
            data: selectedItems,
        };

        deleteItems(pack).then((res) => {
            if (res.status === 0) {
                openNotif(
                    "Administration",
                    "Retrait d'un ou des produits réussi",
                    0,
                    "topLeft"
                );

                const newShowed = showedItems.filter(
                    (item) => !selectedItems.includes(item._id)
                );

                setShowedItems(newShowed);
                setSelectedItems([]);

                handleClose();
            } else {
                openNotif(
                    "Administration",
                    "Une erreur est survenue !",
                    1,
                    "topLeft"
                );
            }
        });
    };

    useEffect(() => {
        getItems().then((res) => {
            setItems(res);
            setShowedItems(res);
        });
    }, []);

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
     * Ajouter les produits selectionnes dans selectedItems
     * @param {number} id Identifiant du produit dans la liste
     */
    const handleSelect = (id) => {
        if (selectedItems.indexOf(id) >= 0) {
            selectedItems.splice(selectedItems.indexOf(id), 1);
        } else {
            selectedItems.push(id);
        }
    };

    return (
        <div className="popup-container">
            {contextNotif}
            <span className="popup-title">Supprimer des Produits</span>

            <div className="popup-list-w-actions">
                {showedItems.length > 0
                    ? Object.keys(showedItems).map((v, k) => (
                          <div className="popup-list-data" key={k}>
                              <img
                                  className="popup-list-data-img"
                                  src={showedItems[v].imgRef}
                                  alt={`Image de ${showedItems[v].name}`}
                              />
                              <span className="popup-list-data-name">
                                  {showedItems[v].name} ({items[v].price}€)
                              </span>
                              <input
                                  type="checkbox"
                                  onClick={() => {
                                      handleSelect(showedItems[v]._id);
                                  }}
                              />
                          </div>
                      ))
                    : null}
            </div>

            <div className="popup-btn-container">
                <Button danger onClick={handleDelete}>
                    Supprimer
                </Button>
                <Button danger onClick={handleClose}>
                    Quitter
                </Button>
            </div>
        </div>
    );
}
