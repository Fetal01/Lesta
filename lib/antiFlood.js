import * as gruposdb from '../database/grupos.js'
import {criarTexto, consoleErro} from './util.js'
import * as socket from '../baileys/socket-funcoes.js'
import * as grupos from '../controle/gruposControle.js'


export const antiFlood = async (c, mensagemInfoCompleta) => {
    try{
        const {msgs_texto} = mensagemInfoCompleta
        const {groupId, groupAdmins, isBotGroupAdmins} = mensagemInfoCompleta.grupo
        const {chatId, sender, isGroupMsg} = mensagemInfoCompleta.mensagem
        if(!isGroupMsg) return true
        const afl_status = await grupos.obterGrupoInfo(groupId)
        if(!afl_status.antiflood) return true

        if (!isBotGroupAdmins || (await gruposdb.grupoInfoAntiFlood(groupId) == undefined)) {
            await gruposdb.alterarAntiFlood(groupId,false)
        } else {
            let flood = await gruposdb.addMsgFlood(groupId,sender)
            if(flood) {
                if(!groupAdmins.includes(sender)) {
                    await socket.removeParticipant(c, groupId, sender)
                    await socket.sendTextWithMentions(c,chatId, criarTexto(msgs_texto.geral.resposta_ban, sender.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antiflood.motivo, process.env.NOME_BOT), [sender])
                    return false
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

