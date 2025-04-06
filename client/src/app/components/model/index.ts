export interface AuthInfo {
    email: string;
    username: string;
    password: string;
}

export interface PostOfficeInfo {
    zipCode: string;
    name: string;
    address: string;
    index?: number;
}
