const initialState = {
    router: {"location": null},
    userAccount: {
        loginPage: {
            errorMessage: "",
        },
        registerPage: {
            isUserRegistered: false,
            errorMessage: "",
        }

    },
    users: [],
    alertInformationPage: {
        messages: [],
        lastMessage: null,
        messageHasBeenSent: null
    }
};

export default initialState;
