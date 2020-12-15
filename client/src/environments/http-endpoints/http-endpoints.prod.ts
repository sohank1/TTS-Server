export class HttpEndpoints {
    public BASE_URL = 'https://tts-api-prod.herokuapp.com';
    public LOGIN = `${this.BASE_URL}/login`;
    public LOGOUT = `${this.BASE_URL}/logout`;

    public ME = `${this.BASE_URL}/me`;
    public CONTENT = `${this.BASE_URL}/content`;
}