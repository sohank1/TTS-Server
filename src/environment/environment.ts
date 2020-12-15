import "dotenv/config";

class Dev {
    public TTS_DISCORD_SERVER_ID = '570349873337991203';

    public PORT = 8000;
    public BASE_URL = `http://localhost:${this.PORT}/api`;
    public OAUTH_URL = 'https://discord.com/api/oauth2/authorize?client_id=678712272209575946&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Flogin%2Fredirect&response_type=code&scope=identify%20guilds'
    public REDIRECT_URL = `${this.BASE_URL}/login/redirect`;

    public CLIENT_BASE_URL = `http://localhost:${this.PORT}`;
    public CLIENT_DASHBOARD_URL = `${this.CLIENT_BASE_URL}/dashboard`;
    public CLIENT_LOADING_URL = (code: string) => `${this.CLIENT_BASE_URL}/loading?code=${code}`;
}

class Prod {
    public TTS_DISCORD_SERVER_ID = '570349873337991203';

    public PORT = process.env.PORT;
    public BASE_URL = `https://tts-api-prod.herokuapp.com/api`;
    public OAUTH_URL = 'https://discord.com/api/oauth2/authorize?client_id=678712272209575946&redirect_uri=https%3A%2F%2Ftts-api-prod.herokuapp.com%2Flogin%2Fredirect&response_type=code&scope=identify%20guilds'
    public REDIRECT_URL = `${this.BASE_URL}/login/redirect`;

    public CLIENT_BASE_URL = `https://tts-api-prod.herokuapp.com`;
    public CLIENT_DASHBOARD_URL = `${this.CLIENT_BASE_URL}/dashboard`
    public CLIENT_LOADING_URL = (code: string) => `${this.CLIENT_BASE_URL}/loading?code=${code}`;

}

export let environment: Dev | Prod = new Dev();

if (process.env.NODE_ENV === "production") environment = new Prod();
