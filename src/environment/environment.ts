import "dotenv/config";

class Dev {
    public TTS_DISCORD_SERVER_ID = '570349873337991203';

    public PORT = 8000;
    public BASE_URL = `http://localhost:${this.PORT}`;
    public CALLBACK_URL = `${this.BASE_URL}/login/redirect`;

    public CLIENT_BASE_URL = `http://localhost:4200`;
    public CLIENT_DASHBOARD_URL = `${this.CLIENT_BASE_URL}/dashboard`;
}

class Prod {
    public TTS_DISCORD_SERVER_ID = '570349873337991203';

    public PORT = process.env.PORT;
    public BASE_URL = `https://tts-api-prod.herokuapp.com`
    public CALLBACK_URL = `${this.BASE_URL}/login/redirect`;

    public CLIENT_BASE_URL = `https://tts.app.netlify.app`;
    public CLIENT_DASHBOARD_URL = `${this.CLIENT_BASE_URL}/dashboard`

}

export let environment: Dev | Prod = new Dev();

if (process.env.NODE_ENV === "production") environment = new Prod();
