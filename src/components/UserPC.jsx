import { UserProvider } from "../context/user-context";

export const UserPC = ({ children }) => {
    return <UserProvider>{children}</UserProvider>;
};
