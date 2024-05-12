import React, { useEffect, useState } from "react";
import { cipherRequest } from "../services/KTSec/KTSec";
import config from "../global.json";

const init = {
    _id: "",
    firstname: "",
    lastname: "",
    email: "",
    fidelityPoint: 0,
    type: "",
    iat: 0,
    exp: 0,
    isEmpty: true,
};

export const UserContext = React.createContext(init);

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(init);

    const getInfo = async () => {
        const toSend = JSON.stringify({
            token: localStorage.getItem("katiacm"),
        });

        const request = await cipherRequest(
            toSend,
            `${config.api}/customer/getInfo`
        );

        return request.data;
    };

    useEffect(() => {
        if (userData.isEmpty) {
            getInfo().then((res) => {
                setUserData((prevInformations) => ({
                    ...prevInformations,
                    ...res,
                    isEmpty: false,
                }));
            });
        }
    }, [userData]);

    return (
        <UserContext.Provider value={userData}>{children}</UserContext.Provider>
    );
};
