import { useState, useEffect } from "react";
import { getItems, modifyItem } from "../../../../../../services/API/Items";
import { Button, Input, notification } from "antd";
import "../popup.scss";

/**
 * [ADMIN FEATURES] Modifier un produit
 * @param {{handleClose: <void>}} param0 Fonction qui fermera ce formulaire
 * @return {HTMLElement}
 */
export default function ModifyItem({ handleClose }) {
    const [showedItems, setShowedItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});
    const [modifyName, setModifyName] = useState("");
    const [modifyPrice, setModifyPrice] = useState("");
    const [modifyPromotion, setModifyPromotion] = useState("");
    const [modifyImgRef, setModifyImgRef] = useState("");
    const [notif, contextNotif] = notification.useNotification();

    const handleSearch = async (e) => {
        const str = e.target.value;

        if (str.length === 0) {
            showItems();
            return;
        }

        const items = await getItems();
        const toDisplay = items.filter((e) =>
            e.name.toLowerCase().includes(str.toLowerCase())
        );

        setShowedItems(toDisplay);
    };

    /**
     * Nom du produit
     * @param {Event} e
     */
    const handleModifyName = (e) => {
        setModifyName(e.target.value);
    };

    /**
     * Url de l'image du produit
     * @param {Event} e
     */
    const handleModifyImgRef = (e) => {
        setModifyImgRef(e.target.value);
    };

    /**
     * Prix du produit
     * @param {Event} e
     */
    const handleModifyPrice = (e) => {
        setModifyPrice(parseFloat(e.target.value));
    };

    /**
     * Promotion du produit
     * @param {Event} e
     */
    const handleModifyPromotion = (e) => {
        setModifyPromotion(e.target.value);
    };

    /**
     * Selectionner un produit
     * @param {*} item Produit selectionne
     */
    const handleSelect = (item) => {
        if (JSON.stringify(item) === JSON.stringify(selectedItem)) {
            setSelectedItem({});
        } else {
            setSelectedItem(item);
        }
    };

    /**
     * Modifier le produit selectionner
     * @return {void}
     */
    const handleModify = () => {
        const pack = {
            name: modifyName.length > 0 ? modifyName : selectedItem.name,
            price: modifyPrice ? modifyPrice : selectedItem.price,
            promotion:
                modifyPromotion.length > 0
                    ? modifyPromotion
                    : selectedItem.promotion,
            imgRef:
                modifyImgRef.length > 0 ? modifyImgRef : selectedItem.imgRef,
            id: selectedItem._id,
            token: localStorage.getItem("katiacm"),
        };

        modifyItem(pack).then((res) => {
            if (res.status === 0) {
                openNotif(
                    "Administration",
                    "Produit modifié avec succès",
                    0,
                    "topLeft"
                );
                showItems();
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

    const showItems = () => {
        getItems().then((res) => {
            setShowedItems(res);
        });
    };

    useEffect(() => {
        showItems();
    }, []);

    return (
        <div className="popup-container">
            {contextNotif}

            <Input
                onChange={handleSearch}
                type="text"
                placeholder="Rechercher un produit"
            />

            <span className="popup-title">Modifier un Produit</span>

            <div className="popup-list-w-actions">
                {showedItems.length > 0
                    ? Object.keys(showedItems).map((v, k) => (
                          <div
                              className={`popup-list-data ${
                                  selectedItem._id === showedItems[v]._id
                                      ? "active"
                                      : ""
                              }`}
                              key={k}
                              onClick={() => {
                                  handleSelect(showedItems[v]);
                              }}
                          >
                              <img
                                  className="popup-list-data-img"
                                  src={showedItems[v].imgRef}
                                  alt={`Image de ${showedItems[v].name}`}
                              />
                              <span className="popup-list-data-name">
                                  {showedItems[v].name} ({showedItems[v].price}
                                  €)
                              </span>
                          </div>
                      ))
                    : null}
            </div>

            {selectedItem._id ? (
                <div className="popup-modify">
                    <img
                        className="popup-modify-img"
                        src={selectedItem.imgRef}
                        alt={`Image de ${showedItems.name}`}
                    />
                    <Input
                        onChange={handleModifyImgRef}
                        type="text"
                        className=""
                        placeholder={`URL de l'image: ${selectedItem.imgRef}`}
                    />
                    <Input
                        onChange={handleModifyName}
                        type="text"
                        className=""
                        placeholder={`Nom: ${selectedItem.name}`}
                    />
                    <Input
                        onChange={handleModifyPrice}
                        type="number"
                        className=""
                        placeholder={`Prix: ${selectedItem.price}`}
                    />
                    <Input
                        onChange={handleModifyPromotion}
                        type="number"
                        className=""
                        placeholder={`Promotion: ${selectedItem.promotion}`}
                    />
                </div>
            ) : null}

            <div className="popup-btn-container">
                <Button className="" onClick={handleModify}>
                    Modifier
                </Button>
                <Button danger className="" onClick={handleClose}>
                    Quitter
                </Button>
            </div>
        </div>
    );
}
