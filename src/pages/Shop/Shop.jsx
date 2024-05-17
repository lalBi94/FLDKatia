import "./Shop.scss";
import Layout from "../../Layout/Layout";
import { useEffect, useState } from "react";
import "hover.css";
import { Vortex } from "react-loader-spinner";
import { motion } from "framer-motion";
import { cipherRequest } from "../../services/KTSec/KTSec";
import config from "../../global.json";
import { getItems } from "../../services/API/Items";
import { addToCart } from "../../services/API/Order";
import { useItems } from "../../hooks/useItems";
import { notification } from "antd";
import { Button, Input } from "antd";
import { ConfigProvider } from "antd";
import shop from "../Themes/shop.json";
import { priceAfterPromo } from "../../services/Utils/Utils";
import { PricePromo } from "./../../components/PricePromo/PricePromo";

/**
 * Page de la boutique
 * @return {HTMLElement}
 */
export default function Shop() {
    const [chunked, setChunked] = useState([[]]);
    const [current, setCurrent] = useState(0);
    const [clientId, setClientId] = useState(null);
    const [lockdown, setLockdown] = useState(false);
    const [notif, contextHolder] = notification.useNotification();
    const [dessertMode, setDessertMode] = useState(false);
    const [platMode, setPlatMode] = useState(false);
    const [entreeMode, setEntreeMode] = useState(false);
    const [catChoosen, setCatChoosen] = useState([]);
    const items = useItems();

    const handleDecFilter = () => {
        setCurrent(0);
        const newChunks = computeChunks(
            items.items.sort((a, b) => {
                return b.price - a.price;
            })
        );
        setChunked(newChunks);
    };

    const handleCroFilter = () => {
        setCurrent(0);
        const newChunks = computeChunks(
            items.items.sort((a, b) => {
                return a.price - b.price;
            })
        );
        setChunked(newChunks);
    };

    const handleModeChange = (mode) => {
        setEntreeMode(false);
        setPlatMode(false);
        setDessertMode(false);
        setCurrent(0);

        switch (mode) {
            case "entrée":
                setCatChoosen([...catChoosen, mode]);
                setEntreeMode(!entreeMode);
                break;
            case "plat":
                setCatChoosen([...catChoosen, mode]);
                setPlatMode(!platMode);
                break;
            case "dessert":
                setCatChoosen([...catChoosen, mode]);
                setDessertMode(!dessertMode);
                break;
            default:
                return;
        }

        const stockChunks = items.items.filter(
            (plat) => plat.category.toLowerCase() === mode.toLowerCase()
        );

        if (stockChunks.length > 0) {
            const newChunks = computeChunks(stockChunks);
            setChunked(newChunks);
        } else {
            load().then(() => {
                switch (mode) {
                    case "entrée":
                        setEntreeMode(false);
                        break;
                    case "plat":
                        setPlatMode(false);
                        break;
                    case "dessert":
                        setDessertMode(false);
                        break;
                    default:
                        console.error("uknown command");
                        break;
                }

                openNotif(
                    "À la carte",
                    "Cette categorie est vide",
                    1,
                    "topLeft"
                );
            });
        }
    };

    const handleDessert = () => {
        if (!dessertMode) {
            handleModeChange("dessert");
        } else {
            setDessertMode(false);
            load().then(() => {
                setDessertMode(false);
            });
        }
    };

    const handlePlat = () => {
        if (!platMode) {
            handleModeChange("plat");
        } else {
            load().then(() => {
                setPlatMode(false);
            });
            setPlatMode(false);
        }
    };

    const handleEntree = () => {
        if (!entreeMode) {
            handleModeChange("entrée");
        } else {
            load().then(() => {
                setEntreeMode(false);
            });
        }
    };

    const handleSearch = (e) => {
        setCurrent(0);
        setEntreeMode(false);
        setDessertMode(false);
        setPlatMode(false);

        if (e.target.value === "") {
            load();
            return;
        }

        const stockChunks = [];

        for (let i = 0; i <= chunked.length - 1; ++i) {
            for (let j = 0; j <= chunked[i].length - 1; ++j) {
                if (
                    chunked[i][j].name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                ) {
                    stockChunks.push(chunked[i][j]);
                }
            }
        }

        if (stockChunks.length > 0) {
            const newChunks = computeChunks(stockChunks);
            setChunked(newChunks);
        } else {
            // openNotif(
            //     "A la carte",
            //     `Aucun produit correspondant a ${e.target.value}...`,
            //     1,
            //     "topLeft"
            // );
        }
    };

    /**
     * Devisier le tableau en 8 chunks
     * @param {Array} data Liste d'objets
     * @returns
     */
    const computeChunks = (data) => {
        return data.reduce(
            (acc, _, i, arr) =>
                !(i % 8) ? acc.concat([arr.slice(i, i + 8)]) : acc,
            []
        );
    };

    const handlePageChange = (direction) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrent((prevCurrent) => {
            if (direction === "next") {
                return prevCurrent === chunked.length - 1
                    ? prevCurrent
                    : prevCurrent + 1;
            } else {
                return prevCurrent === 0 ? prevCurrent : prevCurrent - 1;
            }
        });
        setLockdown(false);
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
     * Ajouter un produit au panier
     * @param {*} itemId Identifiant du produit
     * @param {*} qte Quantite du produit
     * @param {HTMLElement} element Tag du bouton selectionne
     * @return {Promise<boolean>}
     */
    const handleAddToCart = (id, qte, element) => {
        const e = element.target;
        e.innerText = "Ajout en cours ...";

        if (!clientId) {
            window.location.href = "/#/gate";
        } else {
            const pack = {
                token: localStorage.getItem("katiacm"),
                id: id,
                qte: qte,
            };

            addToCart(pack).then((res) => {
                setLockdown(false);

                e.innerText = "+ Ajouter au panier";

                if (res.status === 0) {
                    openNotif(
                        "A la Carte",
                        "Votre article a été deplacé dans le panier !",
                        0,
                        "topLeft"
                    );
                } else {
                    openNotif(
                        "A la Carte",
                        "Une erreur est survenue !",
                        1,
                        "topLeft"
                    );
                    return;
                }
            });
        }
    };

    const handleBuy = (id, qte) => {
        const pack = {
            token: localStorage.getItem("katiacm"),
            id: id,
            qte: qte,
        };

        addToCart(pack).then((res) => {
            if (res.status === 0) {
                window.location.href = "/#/cart";
            }
        });

        setLockdown(false);
    };

    const load = async () => {
        let newRes = null;

        if (items.items.length === 0) {
            getItems().then((res) => {
                newRes = computeChunks(res);
                setChunked(newRes);
            });
        } else {
            newRes = computeChunks(items.items);
            setChunked(newRes);
        }
    };

    useEffect(() => {
        load().then(() => {
            if (localStorage.getItem("katiacm")) {
                const toSend = JSON.stringify({
                    token: localStorage.getItem("katiacm"),
                });

                cipherRequest(toSend, `${config.api}/customer/getUserId`).then(
                    (res) => {
                        setClientId(res);
                    }
                );
            }
        });
    }, []);

    return (
        <ConfigProvider theme={shop}>
            <Layout>
                <div id="shop-container">
                    {contextHolder}

                    <div id="advenced-search-container">
                        <div id="search-container">
                            <Input
                                type="search"
                                placeholder="Recherche"
                                onChange={handleSearch}
                            />
                        </div>

                        <div id="filters-cat-container">
                            <Button
                                onClick={handleDessert}
                                className={dessertMode ? "active" : ""}
                            >
                                Dessert
                            </Button>
                            <Button
                                onClick={handlePlat}
                                className={platMode ? "active" : ""}
                            >
                                Plats
                            </Button>
                            <Button
                                onClick={handleEntree}
                                className={entreeMode ? "active" : ""}
                            >
                                Entrée
                            </Button>
                        </div>

                        <div id="filters-price-container">
                            <Button onClick={handleCroFilter}>- au +</Button>
                            <Button onClick={handleDecFilter}>+ au -</Button>
                        </div>
                    </div>

                    <div id="shop-data-container">
                        {chunked[current].length > 0 ? (
                            Object.keys(chunked[current]).map((v, k) => (
                                <motion.div
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    duration={4000}
                                    key={k}
                                >
                                    <div className="item-container">
                                        <img
                                            className="item-imgRef"
                                            src={chunked[current][v].imgRef}
                                            alt={`Image de ${chunked[current][v].name}`}
                                        />

                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="item-hover-actions"
                                        >
                                            <div className="item-hover-actions-blur"></div>

                                            <span className="text">
                                                {chunked[current][v].name}
                                            </span>
                                            <Button
                                                disabled={lockdown}
                                                onClick={(e) => {
                                                    setLockdown(true);

                                                    handleAddToCart(
                                                        chunked[current][v]._id,
                                                        1,
                                                        e
                                                    );
                                                }}
                                                className="item-hover-actions-btn"
                                                aria-label="Ajouter au panier"
                                            >
                                                + Ajouter au panier
                                            </Button>

                                            <Button
                                                disabled={lockdown}
                                                onClick={(e) => {
                                                    setLockdown(true);
                                                    handleBuy(
                                                        chunked[current][v]._id,
                                                        1
                                                    );
                                                }}
                                                className="item-hover-actions-btn diff now"
                                                aria-label={`Acheter (${
                                                    chunked[current][v]
                                                        .promotion > 0
                                                        ? priceAfterPromo(
                                                              chunked[current][
                                                                  v
                                                              ].price,
                                                              chunked[current][
                                                                  v
                                                              ].promotion
                                                          ).toFixed(2)
                                                        : chunked[current][v]
                                                              .price
                                                }€ TTC)`}
                                            >
                                                Acheter (
                                                {chunked[current][v].promotion >
                                                0
                                                    ? priceAfterPromo(
                                                          chunked[current][v]
                                                              .price,
                                                          chunked[current][v]
                                                              .promotion
                                                      ).toFixed(2)
                                                    : chunked[current][v].price}
                                                € TTC)
                                            </Button>
                                        </motion.span>

                                        <span className="item-title">
                                            {chunked[current][v].name}
                                        </span>

                                        {chunked[current][v].promotion > 0 ? (
                                            <PricePromo
                                                oldPrice={
                                                    chunked[current][v].price
                                                }
                                                newPrice={priceAfterPromo(
                                                    chunked[current][v].price,
                                                    chunked[current][v]
                                                        .promotion
                                                ).toFixed(2)}
                                            />
                                        ) : (
                                            `${chunked[current][v].price}€`
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="loader">
                                <Vortex
                                    visible={true}
                                    height="100"
                                    width="100"
                                    radius={1}
                                    ariaLabel="vortex-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="vortex-wrapper"
                                    colors={[
                                        "#fdeb79",
                                        "#ff885e",
                                        "#fdeb79",
                                        "#ff885e",
                                        "#fdeb79",
                                        "#ff885e",
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                    <div className="shop-navigation">
                        <Button
                            disabled={lockdown}
                            className=""
                            onClick={() => {
                                setLockdown(true);
                                handlePageChange("prev");
                            }}
                        >
                            &lt;
                        </Button>

                        <Button
                            disabled={lockdown}
                            className=""
                            onClick={() => {
                                setLockdown(true);
                                handlePageChange("next");
                            }}
                        >
                            &gt;
                        </Button>
                    </div>
                </div>
            </Layout>
        </ConfigProvider>
    );
}
