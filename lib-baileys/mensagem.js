const {generateWAMessageFromContent, getContentType} = require('@whiskeysockets/baileys')
const pino  = require("pino")

module.exports ={
    // TRADUZIR CONTEUDO DA MENSAGEM PARA A BIBLIOTECA BAILEYS
    messageData : async(m) =>{
        try {
            m = m.messages[0]
            let messageData = {}
            let type = getContentType(m.message)
            let quotedMsg = type == module.exports.MessageTypes.extendedText && m.message.extendedTextMessage?.contextInfo?.quotedMessage != undefined

            messageData = {
                sender : m.key.participant || m.key.remoteJid ,
                username : m.pushName,
                broadcast : m.key.remoteJid == "status@broadcast",
                caption : m.message[type].caption,
                messageId : m.key.id,
                body : m.message.conversation || m.message.extendedTextMessage?.text,
                id: m,
                type,
                t : m.messageTimestamp,
                mentionedJidList: m.message[type].contextInfo?.mentionedJid || [],
                mimetype: m.message[type].mimetype,
                mediaUrl: m.message[type].url,
                fromMe : m.key.fromMe,
                chatId: m.key.remoteJid,
                isGroupMsg : m.key.remoteJid.includes("@g.us"),
                isMedia : type == module.exports.MessageTypes.image || type == module.exports.MessageTypes.video,
                seconds : m.message[type].seconds,
                quotedMsg
            }

            if(quotedMsg) {
                let quotedType = getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage)
                messageData.quotedMsgObj = generateWAMessageFromContent(m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid, m.message.extendedTextMessage.contextInfo.quotedMessage , { logger : pino() })
                messageData.quotedMsgObjInfo = {
                    type : getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage),
                    sender : m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid,
                    body : m.message.extendedTextMessage.contextInfo.quotedMessage?.conversation || m.message.extendedTextMessage.contextInfo.quotedMessage?.extendedTextMessage?.text,
                    caption : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.caption,
                    url : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.url,
                    mimetype : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.mimetype,
                    seconds: m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.seconds
                }
            }
            return messageData
        } catch (err) {
            console.log(err)
            return m
        }
    },

    MessageTypes : {
        text : "conversation",
        extendedText : "extendedTextMessage",
        image: "imageMessage",
        document: "documentMessage",
        video: "videoMessage",
        sticker: "stickerMessage",
        audio: "audioMessage"
    }

}

