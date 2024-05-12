import { InformationsProvider } from "../context/informations-context";

export const InformationsPC = ({ children }) => {
    return <InformationsProvider>{children}</InformationsProvider>;
};
