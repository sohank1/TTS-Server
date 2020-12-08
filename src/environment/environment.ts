import "dotenv/config";

const dev = {
    PORT: 8000,
    CALLBACK_URL: "http://localhost:8000/login/redirect",
};

const prod = {
    PORT: process.env.PORT,
    CALLBACK_URL: "https://tts-api.herokuapp.com/login/redirect",
};

export let environment: typeof dev | typeof prod = dev;

if (process.env.NODE_ENV === "production") environment = prod;