export const isUserAuthenticated = () => {
    return sessionStorage.getItem("sessionId") !== null;
};
