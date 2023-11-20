import React, { createContext, useState, useContext } from "react";

const UserRecordsContext = createContext();

export const useUserRecords = () => {
    return useContext(UserRecordsContext);
};

export const UserRecordsProvider = ({ children }) => {
    const [userRecords, setUserRecords] = useState([]);

    return (
        <UserRecordsContext.Provider value={{ userRecords, setUserRecords }}>
            {children}
        </UserRecordsContext.Provider>
    );
};
