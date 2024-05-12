import React, { useEffect, useState } from "react";
import { getItems } from "./../services/API/Items";

const init = {
    items: [],
    isEmpty: true,
};

export const ShopContext = React.createContext(init);

export const ShopProvider = ({ children }) => {
    const [itemsG, setItemsG] = useState(init);

    useEffect(() => {
        if (itemsG.isEmpty) {
            getItems().then((res) => {
                setItemsG({ ...itemsG, items: res, isEmpty: false });
            });
        }
    }, [itemsG]);

    return (
        <ShopContext.Provider value={itemsG}>{children}</ShopContext.Provider>
    );
};
