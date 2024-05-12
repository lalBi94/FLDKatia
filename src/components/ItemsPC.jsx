import { ShopProvider } from "../context/shop-context";

export const ItemsPC = ({ children }) => {
    return <ShopProvider>{children}</ShopProvider>;
};
