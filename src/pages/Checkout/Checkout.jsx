import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import "./Checkout.scss";
import { Button, Input, Typography } from "antd";
import { cipherRequest } from "../../services/KTSec/KTSec";
import global from "../../global.json";

export default function Checkout() {
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        setIsLoading(true);

        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        cipherRequest(toSend, `${global.api}/getActiveReservationsOf`).then(
            (res) => {
                console.log(res);
                setIsLoading(false);
            }
        );
    };

    const onChange = (text) => {
        setSearch(text);
    };

    const sharedProps = {
        onChange,
    };
    return (
        <Layout>
            <div id="checkout-container">
                <div id="checkout-title-container">
                    <span id="checkout-title">
                        Entrez un code de réservation
                    </span>
                </div>

                <div id="checkout-ipt-container">
                    <Input.OTP
                        formatter={(str) => str.toUpperCase()}
                        {...sharedProps}
                    />
                </div>

                <div id="checkout-btn-container">
                    <Button onClick={handleSearch} loading={isLoading}>
                        Chercher
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
