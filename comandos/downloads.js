//REQUERINDO MÓDULOS
const fs = require('fs-extra')
const msgs_texto = require('../lib/msgs')
const {criarTexto, erroComandoMsg, removerNegritoComando, consoleErro} = require("../lib/util")
const api = require("../lib/api")
const socket = require("../lib-translate/socket-functions")
const {MessageTypes}  = require("../lib-translate/message")
const axios = require("axios")
const path = require('path')


module.exports = downloads = async(c,messageTranslated) => {
    try{
        const { type, id, chatId, quotedMsg, body, caption} = messageTranslated
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')

        switch(command){      
            case "!play":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,erroComandoMsg(command),id)
                    var usuarioTexto = body.slice(6).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(videoInfo == null) return await socket.reply(c, chatId, msgs_texto.downloads.play.nao_encontrado, id)
                    if(videoInfo.duration > 300000) return await socket.reply(c, chatId, msgs_texto.downloads.play.limite, id)
                    var mensagemEspera = criarTexto(msgs_texto.downloads.play.espera, videoInfo.title, videoInfo.durationFormatted)
                    await socket.reply(c, chatId, mensagemEspera, id)
                    var caminhoAudio = await api.obterYTMP3(videoInfo.id)
                    await socket.replyFile(c, MessageTypes.audio, chatId, caminhoAudio, '', id, 'audio/mpeg')
                    fs.unlinkSync(caminhoAudio)
                } catch(err){
                    if (fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio) 
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "!yt":
                try{
                    if(args.length === 1) return await socket.reply(c,chatId,erroComandoMsg(command),id)
                    var usuarioTexto = body.slice(4).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(videoInfo == null) return await socket.reply(c, chatId,msgs_texto.downloads.yt.nao_encontrado,id)
                    if(videoInfo.duration > 300000) return await socket.reply(c, chatId,msgs_texto.downloads.yt.limite,id)
                    var mensagemEspera = criarTexto(msgs_texto.downloads.yt.espera, videoInfo.title, videoInfo.durationFormatted)
                    await socket.reply(c, chatId, mensagemEspera, id)
                    var caminhoVideo = await api.obterYTMP4(videoInfo.id)
                    await socket.replyFile(c, MessageTypes.video, chatId, caminhoVideo, '', id, 'video/mp4')
                    fs.unlinkSync(caminhoVideo)
                } catch(err){
                    if (fs.existsSync(caminhoVideo)) fs.unlinkSync(caminhoVideo)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!fb":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var usuarioURL = body.slice(4).trim(), resultadosMidia = await api.obterMidiaFacebook(usuarioURL)
                    await socket.replyFileFromUrl(c, MessageTypes.video, chatId, resultadosMidia.sd, '', id, 'video/mp4')
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                } 
                break

            case "!ig":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,erroComandoMsg(command),id)
                    await socket.reply(c, chatId, msgs_texto.downloads.ig.espera, id)
                    var usuarioTexto = body.slice(4).trim(), indexEscolhido = 0, resultadosMidia = await api.obterMidiaInstagram(usuarioTexto)
                    if(args.length > 2) {
                        indexEscolhido = args[2]
                        if(isNaN(indexEscolhido)) return await socket.reply(c, chatId,erroComandoMsg(command),id)
                        indexEscolhido = indexEscolhido - 1
                        if(resultadosMidia[indexEscolhido] == undefined) return await socket.reply(c, chatId, msgs_texto.downloads.ig.nao_encontrado, id)
                    }
                    var igResponse = await axios.get(resultadosMidia[indexEscolhido].download_link,  { responseType: 'arraybuffer' })
                    var bufferIg = Buffer.from(igResponse.data, "utf-8")
                    if(igResponse.headers['content-type'] == "image/jpeg"){
                        await socket.replyFileFromBuffer(c, MessageTypes.image, chatId, bufferIg, '', id)
                    } else if(igResponse.headers['content-type'] == "video/mp4"){
                        await socket.replyFileFromBuffer(c, MessageTypes.video, chatId, bufferIg, '', id, 'video/mp4')
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!tw":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,erroComandoMsg(command),id)
                    await socket.reply(c, chatId,msgs_texto.downloads.tw.espera,id)
                    var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaTwitter(usuarioTexto)
                    if(!resultadosMidia.found) return await socket.reply(c, chatId, msgs_texto.downloads.tw.nao_encontrado, id)
                    if(resultadosMidia.type == "image"){
                        await socket.replyFileFromUrl(c, MessageTypes.image, chatId, resultadosMidia.media[0].url, resultadosMidia.text, id)
                    } else if(resultadosMidia.type == "video"){
                        await socket.replyFileFromUrl(c, MessageTypes.video, chatId, resultadosMidia.media[0].url, resultadosMidia.text, id, "video/mp4")
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!tk":
                try{
                    if(args.length === 1) return await socket.reply(chatId,erroComandoMsg(command),id)
                    var usuarioTexto = body.slice(4).trim(), resultadoTiktok= await api.obterMidiaTiktok(usuarioTexto)
                    var tkResponse = await axios.get(resultadoTiktok.url,  { responseType: 'arraybuffer' })
                    var bufferTk = Buffer.from(tkResponse.data, "utf-8")
                    await socket.replyFileFromBuffer(c, MessageTypes.video, chatId, bufferTk, '', id, "video/mp4")
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case '!img':
                try{
                    if(quotedMsg || (type != MessageTypes.text && type != MessageTypes.extendedText) || args.length === 1) {
                        return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    }
                    var usuarioTexto = body.slice(5).trim(), imagensUrl = await api.obterImagens(usuarioTexto), imagemValida = false
                    while(imagemValida == false){
                        try{
                            var imgResponse = await axios.get(imagensUrl[Math.floor(Math.random() * imagensUrl.length)].url,  { responseType: 'arraybuffer' })
                            var bufferImg = Buffer.from(imgResponse.data, "utf-8")
                            await socket.replyFileFromBuffer(c, MessageTypes.image, chatId, bufferImg, '', id)
                            imagemValida = true
                        } catch {
                            imagemValida = false
                        }
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
        }
    } catch(err){
        consoleErro(err, "DOWNLOADS")
    }
}