const db = require('../db-modulos/database')
const obterMensagensTexto = require("./msgs")
const {botInfo} = require("../db-modulos/bot")
const {criarTexto, consoleErro} = require("./util")
const socket = require("../lib-baileys/socket-funcoes")
const socketdb = require("../lib-baileys/socket-db-funcoes")
const {MessageTypes}  = require("../lib-baileys/mensagem")

module.exports = antiFlood = async (c, messageTranslated) => {
    try{
        const {chatId, sender, isGroupMsg, chat} = messageTranslated
        const botNumber = await socketdb.getHostNumberFromBotJSON()
        const groupId = isGroupMsg ? chatId : ''
        const groupAdmins = isGroupMsg ? await socketdb.getGroupAdminsFromDb(groupId) : ''
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false
        const msgs_texto = obterMensagensTexto()
        if(isGroupMsg){
            const afl_status = await socketdb.getGroupInfoFromDb(groupId)
            if(afl_status.antiflood){
                if (!isBotGroupAdmins || (await db.grupoInfoAntiFlood(groupId) == undefined)) {
                    await db.alterarAntiFlood(groupId,false)
                } else {
                    let flood = await db.addMsgFlood(groupId,sender)
                    if(flood) {
                        if(!groupAdmins.includes(sender)) {
                            await socket.removeParticipant(c, groupId, sender)
                            await socket.sendTextWithMentions(c,chatId, criarTexto(msgs_texto.geral.resposta_ban, sender.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antiflood.motivo, process.env.NOME_BOT), [sender])
                            return false
                        }
                    } 
                }
            }
        }
        return true
    } catch(err){
        err.message = `antiFlood - ${err.message}`
        consoleErro(err, "ANTI-FLOOD")
        return true
    }
}

