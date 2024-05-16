import Layout from "../../Layout/Layout";
import "./Home.scss";
import "swiper/css";
import "swiper/css/pagination";
import HomeMadeImg from "../../assets/homemade.png";
import Fresh from "../../assets/fresh.png";
import Exclu from "../../assets/exclu.jpg";
import Driver from "../../assets/driver.png";
import Banner from "../../assets/banner.jpg";
import { Link } from "react-router-dom";
import NoData from "../../assets/no-data.webp";

/**
 * Page d'accueil
 * @return {HTMLElement}
 */
export default function Home() {
    return (
        <Layout>
            <div id="home-container">
                <div id="main-container">
                    <h2 id="title">
                        Bienvenue chez{" "}
                        <span className="brand hvr-bob">
                            Les Delices de Katia
                        </span>{" "}
                        !
                    </h2>
                    <img id="banner-img" src={Banner} alt="" />
                </div>

                <div id="bottom-side">
                    <div id="process-container">
                        <h2 id="process-title">
                            Comment ca{" "}
                            <span className="work hvr-bob">fonctionne</span> ?
                        </h2>
                        <div id="textpro-container">
                            <p>
                                Notre site marchand offre une expérience unique
                                pour les clients du marché de Fontainebleau.
                            </p>{" "}
                            <p>
                                Voici comment ça fonctionne : creez un compte
                                client dans <Link to="/gate">"Portail"</Link>{" "}
                                puis parcourez notre sélection d'articles
                                disponibles et ajoutez-les à votre panier a la
                                page <Link to="/shop">"A la carte"</Link>.
                            </p>
                            <p>
                                Une fois votre commande confirmée dans la page{" "}
                                <Link to="/cart">"Panier"</Link>, vous recevrez
                                un QR Code et un code de réservation unique.
                                (Retrouvez votre code dans{" "}
                                <Link to="/customer">"Mes réservations"</Link>{" "}
                                sur votre espace client si vous le perdez.)
                            </p>
                            <p>
                                Présentez simplement ces codes à notre équipe
                                sur notre stand au marché pour récupérer vos
                                articles réservés.
                            </p>
                            <p>
                                Nous sommes impatients de vous accueillir et de
                                vous offrir une expérience de shopping
                                personnalisée !
                            </p>
                            <p>
                                Notez qu'un ou plusieurs articles peuvent ne
                                plus etre disponible.
                            </p>
                            <p>
                                Si vous avez des questions, n'hésitez pas à nous
                                contacter.
                            </p>
                        </div>
                    </div>

                    <div id="atouts-container">
                        <h2 id="atouts-title">
                            Nos <span className="atouts hvr-bob">atouts</span>
                        </h2>

                        <div id="labels-container">
                            <div className="label">
                                <a
                                    href="https://www.economie.gouv.fr/entreprises/fait-maison"
                                    className="logo-container"
                                    target="_blank"
                                >
                                    <img
                                        className="logo"
                                        src={HomeMadeImg}
                                        alt="Logo fait maison"
                                    />
                                </a>
                                <span className="text">
                                    Découvrez notre cuisine fait maison :
                                    fraîcheur, qualité et saveur garanties
                                </span>
                            </div>

                            <div className="label">
                                <div
                                    href="https://www.inc-conso.fr/content/que-signifie-la-mention-produits-frais-avec-familles-rurales#:~:text=C'est%2D%C3%A0%2Ddire,'ils%20contiennent%2C%20sont%20interdits."
                                    className="logo-container"
                                    target="_blank"
                                >
                                    {" "}
                                    <img
                                        className="logo"
                                        src={Fresh}
                                        alt="Logo produit frai"
                                    />
                                </div>
                                <span className="text">
                                    Nos produits frais proviennent parfois même
                                    directement des commerçants du marché.{" "}
                                </span>
                            </div>

                            <div className="label">
                                <div className="logo-container">
                                    <img
                                        className="logo"
                                        src={Exclu}
                                        alt="Logo execlusivite"
                                    />
                                </div>
                                <span className="text">
                                    Explorez nos recettes exclusives et uniques
                                    !
                                </span>
                            </div>

                            <div className="label">
                                <div className="logo-container">
                                    <img
                                        className="logo"
                                        src={Driver}
                                        alt="Logo livraison"
                                    />
                                </div>
                                <span className="text">
                                    Nous assurons une livraison rapide dans la
                                    ville de Fontainebleau de H1 a H2 du J1 a
                                    J2.
                                </span>
                            </div>

                            <div className="label">
                                <a
                                    href="https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on"
                                    className="logo-container"
                                    target="_blank"
                                >
                                    <img
                                        className="logo"
                                        src={NoData}
                                        alt="Logo de non-prise de donnees"
                                    />
                                </a>

                                <span className="text">
                                    Nous ne collectons aucune donnée sauf pour
                                    les comptes utilisateurs où nous devons
                                    stocker des données dans une base de
                                    données.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
