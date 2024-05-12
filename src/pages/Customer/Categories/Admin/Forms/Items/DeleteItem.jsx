import { useEffect, useState } from "react";
import "../popup.scss";
import { deleteItems, getItems } from "../../../../../../services/API/Items";

/**
 * [ADMIN FEATURES] Supprimer un produit
 * @param {{handleClose: <void>}} param0 Fonction qui fermera ce formulaire
 * @return {HTMLElement}
 */
export default function DeleteItem({ handleClose }) {
    const [showedItems, setShowedItems] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItems, _] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        getItems().then((res) => {
            setItems(res);
            setShowedItems(res);
        });
    }, []);

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
            setStatus(res.status);
        });
    };

    return (
        <div className="popup-container">
            <span className="popup-title">Supprimer des Produits</span>

            {status === 0 ? (
                <p className="succes">Produit(s) supprimés avec succes !</p>
            ) : null}

            {status === 1 ? (
                <p className="error">Une erreur est survenue !</p>
            ) : null}

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
                <button className="btn hvr-shrink" onClick={handleDelete}>
                    Supprimer
                </button>
                <button className="btn hvr-shrink" onClick={handleClose}>
                    Quitter
                </button>
            </div>
        </div>
    );
}