import { proxy } from "valtio/vanilla";

export const state = proxy({
    feeds: [],
    posts: [],
    form: {
        url:'', 
        isValid: true,
        errorMessage:'', 
        isSubmitting: false,
        isSuccess: false,

    }, 
    language: 'ru',
})