import React, { useEffect, useState } from "react";
import { getTel, getAddress } from "../services/API/Us";

const init = {
    tel: "",
    address: { linktomap: "", value: "" },
    isEmpty: true,
};

export const InformationsContext = React.createContext(init);

export const InformationsProvider = ({ children }) => {
    const [informations, setInformations] = useState(init);

    const handleStart = async () => {
        const res1 = await getTel();
        const res2 = await getAddress();

        return { tel: res1.tel, address: res2 };
    };

    useEffect(() => {
        if (informations.isEmpty) {
            handleStart().then((res) => {
                setInformations((prevInformations) => ({
                    ...prevInformations,
                    tel: res.tel,
                    address: res.address,
                    isEmpty: false,
                }));
            });
        }
    }, []);

    return (
        <InformationsContext.Provider value={informations}>
            {children}
        </InformationsContext.Provider>
    );
};
