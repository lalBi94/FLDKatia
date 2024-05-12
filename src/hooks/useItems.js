import React from "react";
import { ShopContext } from "../context/shop-context";

export const useItems = () => {
    return React.useContext(ShopContext);
};
