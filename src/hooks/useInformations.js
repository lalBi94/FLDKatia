import React from "react";
import { InformationsContext } from "../context/informations-context";

export const useInformations = () => {
    return React.useContext(InformationsContext);
};
