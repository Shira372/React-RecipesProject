import { User } from "../moduls/user";
import React, { createContext, useState, useContext, ReactElement } from "react";

// מבנה הקונטקסט שיכלול את כל הנתונים
type UserContextType = {
    user: User;
    setUser: (user: User) => void;
};

// !יצירת קונטקסט-ללא ערך ברירת מחדל
export const UserContext = createContext<UserContextType | undefined>(undefined);

// קומפוננטת הקונטקסט
const UserProvider = ({ children }: { children: ReactElement }) => {
    const [user, setUser] = useState<User>({
        Id: 0,
        Password: "",
        Name: "",
        UserName: "",
        Phone: "",
        Email: "",
        Tz: ""
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// פונקציה בטוחה לשימוש בקונטקסט
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UseUser must be used within a userProvider");
    }
    return context;
};

export default UserProvider;
