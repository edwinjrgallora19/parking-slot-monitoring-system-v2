import api from "./api";

export const loginUser = async (email, password) => {

    const response = await api.post(
        `/Auth/login?email=${email}&password=${password}`
    );

    return response.data;
};

export const registerUser = async (name, email, password) => {

    const response = await api.post(
        `/Auth/register?name=${name}&email=${email}&password=${password}`
    );

    return response.data;
};