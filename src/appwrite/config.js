import conf from '../conf/conf.js';
import { Client, ID, Databases, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    date;
    prises;
    extendedPrise;
    contriPrise;
    extendedContriPrise;
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.date = new Date().toISOString()
        this.prises = 0
        this.extendedPrise = 0
        this.contriPrise = 0
        this.extendedContriPrise = 0
    }

    async createRationLists(documents) {
        try {
            const promises = documents.map((doc) => 
                this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    ID.unique(),
                    doc
                )
            );
            const results = await Promise.all(promises);
            console.log("All documents uploaded successfully:", results);
            return true;
        } catch (error) {
            console.error("Error uploading documents:", error);
            return false
        }
    }

    async updateRasanList(documentId, {Category, Date, Item, Price, Quantity}){
        try {
             await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId,
                {
                    Date,
                    Item,
                    Quantity,
                    Price,
                    Category,
                },
            )
            return true;
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
            return false;
        }
    }

    async deleteRasanList(documentId){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getRasanLists(queries){
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    queries,
                    Query.greaterThanEqual('Date', startOfMonth), 
                    Query.lessThanEqual('Date', endOfMonth),
                ]
            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    async getExtendedRasanList2(){
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.limit(100000),
                    Query.greaterThanEqual('Date', startOfMonth), 
                    Query.lessThanEqual('Date', endOfMonth),
                ]
            )
            this.prises = 0
            const prices = response.documents.map((doc, length) => (
                this.prises += doc.Price
            ))
            return this.prises;
            
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    async getExtendedRasanList(queries){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    async getUserLists() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteUserListId,
                [
                    Query.limit(1000),
                ]
            )
        } catch (error) {
            console.log("Appwrite serive :: getuserlist :: error", error);
            return false
        }
    }

    async createContriAmount({userId, Date, contribution_amount, month}) {
        try {
            
            return  await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteAmountCollectionId,
                    ID.unique(),
                    {
                        userId,
                        Date,
                        contribution_amount,
                        month
                    }
                )
        } catch (error) {
            console.error("Error createContriAmount:", error);
            return false
        }
    }

    async getContriLists(queries) {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteAmountCollectionId,
            [
                Query.limit(10000),
                Query.greaterThanEqual('Date', startOfMonth), 
                Query.lessThanEqual('Date', endOfMonth),
                queries
            ]
        )
        } catch (error) {
            console.log("Appwrite serive :: getContriLists :: error", error);
            return false
        }
    }

    async updateContriList(documentId, {contribution_amount, Date, month, userId}){
        try {
             await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteAmountCollectionId,
                documentId,
                {
                    contribution_amount,
                    Date,
                    month,
                    userId
                },
            )
            return true;
        } catch (error) {
            console.log("Appwrite serive :: updateContriList :: error", error);
            return false;
        }
    }

    async getExtendedContriList(){
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteAmountCollectionId,
                [
                    Query.limit(100000),
                    Query.greaterThanEqual('Date', startOfMonth), 
                    Query.lessThanEqual('Date', endOfMonth),
                ]
            )
            this.contriPrise = 0
            const prices = response.documents.map((doc) => (
                this.contriPrise += doc.contribution_amount
            ))
            return this.contriPrise;
            
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    async getExtendedContriList2(query){
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteAmountCollectionId,
                query
            )

            this.extendedContriPrise = 0
            const prices = response.documents.map((doc) => (
                this.extendedContriPrise += doc.contribution_amount
            ))
            return this.extendedContriPrise;
            
        } catch (error) {
            console.log("Appwrite serive :: getExtendedContriList2 :: error", error);
            return false
        }
    }

    async getExtendedRasanList3(query){
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                query
            )
            this.extendedPrise = 0
            const prices = response.documents.map((doc, length) => (
                this.extendedPrise += doc.Price
            ))
            return this.extendedPrise;
            
        } catch (error) {
            return console.log("Appwrite serive :: getExtendedRasanList3 :: error", error);
        }
    }
}


const service = new Service()
export default service