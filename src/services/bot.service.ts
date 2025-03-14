import { Bot } from "../interfaces/bot.interface.js"
import { CategoryCommand } from "../interfaces/command.interface.js"
import path from "node:path"
import fs from 'fs-extra'
import moment from "moment-timezone"
import { buildText, commandExist } from "../lib/util.js"
import getCommands from "../commands/list.commands.js"

export class BotService {
    private pathJSON = path.resolve("storage/bot.json")

    constructor(){
        const storageFolderExists = fs.pathExistsSync(path.resolve("storage"))
        const jsonFileExists = fs.existsSync(this.pathJSON)
        
        if (!storageFolderExists) fs.mkdirSync(path.resolve("storage"), {recursive: true})
        if (!jsonFileExists) this.initBot()
    }

    private updateBot(bot : Bot){
        fs.writeFileSync(this.pathJSON, JSON.stringify(bot))
    }

    private initBot(){
        const bot : Bot = {
            started : 0,
            host_number: '',
            name: "LBOT",
            author_sticker: "Leal",
            pack_sticker: "LBOT Sticker",
            prefix: "!",
            executed_cmds: 0,
            autosticker: false,
            commands_pv: true, 
            block_cmds: [],    
            command_rate:{
                status: false,
                max_cmds_minute: 5,
                block_time: 60,
                users: [],
                limited_users: []
            },
            api_keys:{
                deepgram: {
                    secret_key: null
                },
                acrcloud: {
                    host: null,
                    access_key: null,
                    secret_key: null
                }
            }
        }

        this.updateBot(bot)
    }

    public startBot(hostNumber : string){
        let bot = this.getBot()
        bot.started = moment.now()
        bot.host_number = hostNumber
        this.updateBot(bot)
    }

    public getBot(){
        return JSON.parse(fs.readFileSync(this.pathJSON, {encoding: "utf-8"})) as Bot
    }

    public setNameBot(name: string){
        let bot = this.getBot()
        bot.name = name
        return this.updateBot(bot)
    }

    public setAuthorSticker(name: string){
        let bot = this.getBot()
        bot.author_sticker = name
        return this.updateBot(bot)
    }

    public setPackSticker(name: string){
        let bot = this.getBot()
        bot.pack_sticker = name
        return this.updateBot(bot)
    }
    
    public setPrefix(prefix: string){
        let bot = this.getBot()
        bot.prefix = prefix
        return this.updateBot(bot)
    }

    public incrementExecutedCommands(){
        let bot = this.getBot()
        bot.executed_cmds++
        return this.updateBot(bot)
    }


    // Recursos do BOT
    // Auto-Sticker
    public setAutosticker(status: boolean){
        let bot = this.getBot()
        bot.autosticker = status
        return this.updateBot(bot)
    }

    // Comandos no PV
    public setCommandsPv(status: boolean){
        let bot = this.getBot()
        bot.commands_pv = status
        return this.updateBot(bot)
    }

    // Taxa de comandos
    public setCommandRate(status: boolean, maxCommandsMinute: number, blockTime: number){
        let bot = this.getBot()
        bot.command_rate.status = status
        bot.command_rate.max_cmds_minute = maxCommandsMinute
        bot.command_rate.block_time = blockTime
        return this.updateBot(bot)
    }

    public setDeepgramApiKey(secret_key: string){
        let bot = this.getBot()
        bot.api_keys.deepgram.secret_key = secret_key
        return this.updateBot(bot)
    }

    public setAcrcloudApiKey(host: string, access_key: string, secret_key: string){
        let bot = this.getBot()
        bot.api_keys.acrcloud.host = host
        bot.api_keys.acrcloud.access_key = access_key
        bot.api_keys.acrcloud.secret_key = secret_key
        return this.updateBot(bot)
    }

    public isCommandLimitedByRate(userId: string, isAdminBot: boolean, isAdminGroup: boolean){
        let bot = this.getBot()
        const currentTimestamp =  Math.round(moment.now()/1000)
        let isLimitedByRate = false

        //VERIFICA OS USUARIOS LIMITADOS QUE JÁ ESTÃO EXPIRADOS E REMOVE ELES DA LISTA
        for (let i = 0; i < bot.command_rate.limited_users.length; i++){
            if (bot.command_rate.limited_users[i].expiration <= currentTimestamp) bot.command_rate.limited_users.splice(i,1)
        }

        //VERIFICA OS USUARIOS QUE JÁ ESTÃO COM COMANDO EXPIRADOS NO ULTIMO MINUTO
        for (let i = 0; i < bot.command_rate.users.length; i++){
            if (bot.command_rate.users[i].expiration <= currentTimestamp) bot.command_rate.users.splice(i,1)
        }

        //SE NÃO FOR UM USUARIO ADMIN E NÃO FOR ADMINISTRADOR DO GRUPO , FAÇA A CONTAGEM.
        if (!isAdminBot && !isAdminGroup){
            //VERIFICA SE O USUARIO ESTÁ LIMITADO
            let limitedUserIndex = bot.command_rate.limited_users.findIndex(usuario => usuario.id_user == userId)
            //SE O USUÁRIO NÃO ESTIVER LIMITADO
            if (limitedUserIndex === -1){
                //OBTEM O INDICE DO USUARIO NA LISTA DE USUARIOS
                let userIndex = bot.command_rate.users.findIndex(user=> user.id_user == userId)
                //VERIFICA SE O USUARIO ESTÁ NA LISTA DE USUARIOS
                if (userIndex !== -1){
                    bot.command_rate.users[userIndex].cmds++ //ADICIONA A CONTAGEM DE COMANDOS ATUAIS
                    if (bot.command_rate.users[userIndex].cmds >= bot.command_rate.max_cmds_minute){ //SE ATINGIR A QUANTIDADE MAXIMA DE COMANDOS POR MINUTO
                        //ADICIONA A LISTA DE USUARIOS LIMITADOS
                        bot.command_rate.limited_users.push({id_user: userId, expiration: currentTimestamp + bot.command_rate.block_time})
                        bot.command_rate.users.splice(userIndex, 1)
                        isLimitedByRate = true
                    }
                } else {//SE NÃO EXISTIR NA LISTA
                    bot.command_rate.users.push({id_user: userId, cmds: 1, expiration: currentTimestamp+60})
                }
            }
        }

        this.updateBot(bot)
        return isLimitedByRate
    }

    // Bloquear/Desbloquear comandos
    public blockCommandsGlobally(commands : string[]){
        let botInfo = this.getBot()
        const commandsData = getCommands(botInfo)
        const {prefix: prefix} = botInfo
        let blockResponse = commandsData.admin.bcmdglobal.msgs.reply_title
        let categories : CategoryCommand[] = ['sticker', 'utility', 'download', 'fun']

        if (categories.includes(commands[0] as CategoryCommand)) commands = Object.keys(commandsData[commands[0] as CategoryCommand]).map(command => prefix+command)

        for(let command of commands){
            if (commandExist(botInfo, command, 'utility') || commandExist(botInfo, command, 'fun') || commandExist(botInfo, command, 'sticker') || commandExist(botInfo, command, 'download')){
                if (botInfo.block_cmds.includes(command.replace(prefix, ''))){
                    blockResponse += buildText(commandsData.admin.bcmdglobal.msgs.reply_item_already_blocked, command)
                } else {
                    botInfo.block_cmds.push(command.replace(prefix, ''))
                    blockResponse += buildText(commandsData.admin.bcmdglobal.msgs.reply_item_blocked, command)
                }
            } else if (commandExist(botInfo, command, 'group') || commandExist(botInfo, command, 'admin') || commandExist(botInfo, command, 'info') ){
                blockResponse += buildText(commandsData.admin.bcmdglobal.msgs.reply_item_error, command)
            } else {
                blockResponse += buildText(commandsData.admin.bcmdglobal.msgs.reply_item_not_exist, command)
            }
        }

        this.updateBot(botInfo)
        return blockResponse
    }

    public unblockCommandsGlobally(commands: string[]){
        let botInfo = this.getBot()
        const commandsData = getCommands(botInfo)
        const {prefix} = botInfo
        let unblockResponse = commandsData.admin.dcmdglobal.msgs.reply_title
        let categories : CategoryCommand[] | string[] = ['all', 'sticker', 'utility', 'download', 'fun']

        if (categories.includes(commands[0])){
            if (commands[0] === 'all') commands = botInfo.block_cmds.map(command => prefix+command)
            else commands = Object.keys(commandsData[commands[0] as CategoryCommand]).map(command => prefix+command)
        }

        for(let command of commands){
            if (botInfo.block_cmds.includes(command.replace(prefix, ''))) {
                let commandIndex = botInfo.block_cmds.findIndex(command_blocked => command_blocked == command)
                botInfo.block_cmds.splice(commandIndex,1)
                unblockResponse += buildText(commandsData.admin.dcmdglobal.msgs.reply_item_unblocked, command)
            } else {
                unblockResponse += buildText(commandsData.admin.dcmdglobal.msgs.reply_item_not_blocked, command)
            }
        }

        this.updateBot(botInfo)
        return unblockResponse
    }

    public isCommandBlockedGlobally(command: string){
        let botInfo = this.getBot()
        const {prefix} = botInfo
        return botInfo.block_cmds.includes(command.replace(prefix, ''))
    }
}