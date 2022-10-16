import { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState()
    const [tokenExpDate, settokenExpDate] = useState();
    const [userId, setuserId] = useState(null);
    const [isCheckingAuth, setisCheckingAuth] = useState(false);

    const login = useCallback((userId, token, expirationDate) => {
        setToken(token);
        // Current date + 1 hour (Set timer for token)
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        settokenExpDate(tokenExpirationDate);
        // Store token in local storage 
        localStorage.setItem(
            'userData',
            JSON.stringify(
                {
                    userId: userId,
                    token: token,
                    tokenExpirationDate: tokenExpirationDate.toISOString()
                })
        );
        setuserId(userId);
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        settokenExpDate(null);
        setuserId(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpDate) {
            const remainingTime = tokenExpDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [logout, token, tokenExpDate]);


    // Check token in local storage
    useEffect(() => {
        setisCheckingAuth(true);
        // JSON to object
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.tokenExpirationDate) > new Date() //Checking if the expiration time is grater than current time
        ) {
            setisCheckingAuth(false);
            login(storedData.userId, storedData.token, new Date(storedData.tokenExpirationDate));
        };
        setisCheckingAuth(false);
    }, [login]);

    return { token, login, logout, userId, isCheckingAuth };
}