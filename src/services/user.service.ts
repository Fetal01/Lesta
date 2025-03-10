import Datastore from "@seald-io/nedb";
const db = new Datastore({filename : './storage/users.db', autoload: true})
import { User } from "../interfaces/user.interface.js";

export class UserService{

    async getUser (userId : string){
        const doc : any  = await db.findOneAsync({id: userId})
        return doc as User | null
    }

    async getUsers(){
        const doc : any = await db.findAsync({})
        return doc as User[]
    }

    async registerUser(userId: string, name?: string|null){
        const isRegistered = await this.isUserRegistered(userId)

        if(isRegistered) return 

        const user : User = {
            id : userId,
            name,
            commands: 0,
            receivedWelcome: false,
            admin: false
        }
        return db.insertAsync(user)
    }

    async isUserRegistered(userId: string){
        const user = await this.getUser(userId)
        return (user != null)
    }

    async setAdmin(userId : string){
        await this.resetAdmins()
        return db.updateAsync({id : userId}, {$set: {admin : true}})
    }

    async getAdmin(){
        const doc : any = await db.findOneAsync({admin : true})
        return doc as User | null
    }

    async getAdminId(){
        const owner = await this.getAdmin()
        return owner?.id
    }

    setName(userId : string, name : string){
        return db.updateAsync({id: userId}, {$set:{name}})
    }

    private resetAdmins(){
        return db.updateAsync({admin: true}, {$set: {admin: false}}, {multi: true})
    }

    setReceivedWelcome(userId: string, status = true){
        return db.updateAsync({id : userId}, {$set : {receivedWelcome : status}})
    }

    increaseUserCommandsCount(userId: string){
        return db.updateAsync({id : userId}, {$inc: {commands: 1}})
    }
}