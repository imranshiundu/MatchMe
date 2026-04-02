export type loginFormData = {
    email : string;
    password : string;
}

export type serverAuthResponse = {
    token? : string;
    message? : string;
}

export type registrationData = {
    email : string,
    password: string,
    repeatPassword: string
}