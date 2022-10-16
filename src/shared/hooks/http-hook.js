import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequest = useRef([]);

    const sendRequest = useCallback(async (
        url,
        method = "GET",
        body = null,
        headers = {}
    ) => {
        setisLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequest.current.push(httpAbortCtrl);
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setisLoading(false);
            return data;

        } catch (error) {
            setError(error.message)
            setisLoading(false);
            throw error;
        }
    }, []);

    const clearError = () => { setError() };

    useEffect(() => {
        return () => {
            activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, [])

    return { isLoading, error, sendRequest, clearError }
};