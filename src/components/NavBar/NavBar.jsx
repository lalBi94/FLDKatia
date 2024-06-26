import { Link } from "react-router-dom";
import "./NavBar.scss";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import "hover.css";

/**
 * Navigation bar normal/burger du site
 * @return {HTMLElement}
 */
export default function NavBar() {
    const [isLogged, setIsLogged] = useState(false);
    const [inBurger, setInBurger] = useState(false);
    const [theme, setTheme] = useState("");

    useEffect(() => {
        const page = location.href.split("/").pop();

        switch (page) {
            case "home": {
                setTheme("home");
                break;
            }
            case "shop": {
                setTheme("shop");
                break;
            }
            case "cart": {
                setTheme("cart");
                break;
            }
            case "gate": {
                setTheme("gate");
                break;
            }
            case "customer": {
                setTheme("customer");
                break;
            }
        }

        setIsLogged(localStorage.getItem("katiacm"));
    }, []);

    /**
     * Activer ou non le mode Burger
     */
    const handleInBuger = () => {
        setInBurger(!inBurger);
    };

    /**
     * Retourner a la page d'accueil
     */
    const goToHome = () => {
        window.location.href = "/#/home";
    };

    const [links, _] = useState({
        logo: (
            <li className="nav-element">
                <img
                    className="nav-link img"
                    src={logo}
                    alt="Logo des delices de Katia"
                    onClick={goToHome}
                />
            </li>
        ),

        about: (
            <li className="nav-element resp">
                <Link
                    className="nav-link hvr-wobble-bottom title-spe-font-semibold"
                    to="/about"
                >
                    A Propos
                </Link>
            </li>
        ),

        home: (
            <li className="nav-element resp">
                <Link
                    className="nav-link hvr-wobble-bottom title-spe-font-semibold"
                    to="/home"
                >
                    Accueil
                </Link>
            </li>
        ),

        shop: (
            <li className="nav-element resp">
                <Link
                    className="nav-link hvr-wobble-bottom title-spe-font-semibold"
                    to="/shop"
                >
                    À la carte
                </Link>
            </li>
        ),

        gate: (
            <li className="nav-element resp">
                <Link
                    className="nav-link hvr-wobble-bottom title-spe-font-semibold"
                    to="/gate"
                >
                    Portail
                </Link>
            </li>
        ),

        instance_client: (
            <li className="nav-element resp">
                <Link
                    className="nav-link hvr-wobble-bottom title-spe-font-semibold"
                    to="/customer"
                >
                    Espace Client
                </Link>
            </li>
        ),

        burger: (
            <li id="burger" onClick={handleInBuger}>
                ☰
            </li>
        ),

        cart: (
            <li className="nav-element resp">
                <Link
                    className="nav-link spe title-spe-font-semibold hvr-wobble-bottom"
                    to="/cart"
                >
                    Panier
                </Link>
            </li>
        ),
    });

    return (
        <nav id="nav-container">
            <ul id="nav-elements-container">
                {links.logo}

                <div id="nav-elements-main" className={theme}>
                    {links.home}
                    {links.shop}

                    {isLogged ? links.cart : null}

                    {!isLogged ? links.gate : null}

                    {isLogged ? links.instance_client : null}
                    {links.about}
                </div>

                {links.burger}
            </ul>

            {inBurger ? (
                <div id="burger-container">
                    <span id="burger-close" onClick={handleInBuger}>
                        ×
                    </span>

                    {links.home}
                    {links.shop}
                    {isLogged ? links.cart : null}
                    {!isLogged ? links.gate : links.instance_client}
                    {links.about}
                </div>
            ) : null}
        </nav>
    );
}
