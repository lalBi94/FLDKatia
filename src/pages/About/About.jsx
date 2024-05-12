import "./About.scss";
import Layout from "./../../Layout/Layout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAddress, getTel } from "../../services/API/Us";
import { useInformations } from "../../hooks/useInformations";

export default function About() {
    const [tel, setTel] = useState("██████");
    const [address, setAddress] = useState({
        linktomap: "",
        value: "██████",
    });
    const informations = useInformations();
    console.log(informations);

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

    return (
        <Layout>
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

                <div id="contact-container">
                    <h3 id="contact-title">Coordonnées</h3>

                    <div id="contact-list">
                        <span className="contact-el">
                            Numero de telephone ➜ {tel ? tel : null}
                        </span>
                        <span className="contact-el">
                            Adresse mail ➜ abdellikatia@gmail.com
                        </span>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
