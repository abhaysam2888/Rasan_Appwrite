import conf from '../conf/conf';
import { Client, Account, ID } from "appwrite";


export class AuthService {
    client = new Client();
    account;
    userID
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.userID = "userID"
            
    }

    async generateOtp(number) {
        try {
            this.userID = ""
            const token = await this.account.createPhoneToken(
                ID.unique(),
                number
            );
            this.userID = token.userId
            console.log(this.userID);
            return token
        } catch (error) {
            throw error;
        }
    }

    async login(secret) {
        try {
            return await this.account.createSession(
                this.userID,
                secret
            );
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService


