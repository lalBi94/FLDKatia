import React from "react";
import { UserContext } from "../context/user-context";

export const useUser = () => {
    return React.useContext(UserContext);
};
