//REQUERINDO MODULOS
import * as menu from '../lib/menu.js'
import moment from "moment-timezone"
import {criarTexto,erroComandoMsg, timestampParaData, consoleErro} from '../lib/util.js'
import fs from 'fs-extra'
import path from 'node:path'
import * as socket from '../baileys/socket-funcoes.js'
import * as bot from '../controle/botControle.js'
import * as grupos from '../controle/gruposControle.js'
import * as usuarios from '../controle/usuariosControle.js'
import { MessageTypes } from '../baileys/mensagem.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import os from 'node:os'


export const admin = async(c, mensagemInfoCompleta) => {
    try{
        const {msgs_texto, ownerNumber} = mensagemInfoCompleta
        const {botNumber, botInfoJSON} = mensagemInfoCompleta.bot
        const {groupId} = mensagemInfoCompleta.grupo
        const {isOwner, textoRecebido, command, args, id, chatId, isGroupMsg, t, type, mimetype, isMedia, quotedMsg, quotedMsgObj, quotedMsgObjInfo, mentionedJidList } = mensagemInfoCompleta.mensagem
        const {prefixo, nome_bot, nome_adm} = botInfoJSON
        if (!isOwner) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_dono_bot, id)
        const blockNumber = await socket.getBlockedIds(c)
        let cmdSemPrefixo = command.replace(prefixo, "")
        
        switch(cmdSemPrefixo){
            case "admin":
                try{
                    await socket.sendText(c, chatId, await menu.menuAdmin())
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "infocompleta":
                try{
                    var fotoBot = await socket.getProfilePicFromServer(c, botNumber)
                    var version = JSON.parse(fs.readFileSync(path.resolve('package.json'))).version
                    var infoBot = botInfoJSON
                    var expiracaoLimiteDiario = timestampParaData(infoBot.limite_diario.expiracao * 1000)
                    var botInicializacaoData = timestampParaData(infoBot.iniciado)
                    var resposta = criarTexto(msgs_texto.admin.infocompleta.resposta_superior, nome_adm?.trim(), nome_bot?.trim(), botInicializacaoData, version)
                    // AUTO-STICKER
                    resposta += (infoBot.autosticker) ? msgs_texto.admin.infocompleta.resposta_variavel.autosticker.on: msgs_texto.admin.infocompleta.resposta_variavel.autosticker.off
                    // PV LIBERADO
                    resposta += (infoBot.pvliberado) ? msgs_texto.admin.infocompleta.resposta_variavel.pvliberado.on: msgs_texto.admin.infocompleta.resposta_variavel.pvliberado.off
                    // LIMITE COMANDOS DIARIO
                    resposta += (infoBot.limite_diario.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.on,  expiracaoLimiteDiario) : msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.off
                    // LIMITE COMANDOS POR MINUTO
                    resposta += (infoBot.limitecomandos.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.on, infoBot.limitecomandos.cmds_minuto_max, infoBot.limitecomandos.tempo_bloqueio) : msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.off
                    // LIMITE MENSAGENS PV
                    resposta += (infoBot.limitarmensagens.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.limitarmsgs.on, infoBot.limitarmensagens.max, infoBot.limitarmensagens.intervalo) : msgs_texto.admin.infocompleta.resposta_variavel.limitarmsgs.off
                    // BLOQUEIO DE COMANDOS
                    let comandosBloqueados = []
                    for(let comandoBloqueado of infoBot.bloqueio_cmds){
                        comandosBloqueados.push(prefixo+comandoBloqueado)
                    }
                    resposta += (infoBot.bloqueio_cmds.length != 0) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.on, comandosBloqueados.toString()) : msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.off
                    resposta += criarTexto(msgs_texto.admin.infocompleta.resposta_inferior, blockNumber.length, infoBot.cmds_executados, ownerNumber.replace("@s.whatsapp.net", ""))
                    if(fotoBot) await socket.replyFileFromUrl(c, MessageTypes.image, chatId, fotoBot, resposta, id)
                    else await socket.reply(c, chatId, resposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break
                
            case 'entrargrupo':
                try{
                    if (args.length < 2) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var linkGrupo = args[1]
                    var linkValido = linkGrupo.match(/(https:\/\/chat.whatsapp.com)/gi)
                    if (!linkValido) return await socket.reply(c, chatId, msgs_texto.admin.entrar_grupo.link_invalido, id)
                    var idLink = linkGrupo.replace(/(https:\/\/chat.whatsapp.com\/)/gi, '')
                    await socket.joinGroupViaLink(c, idLink).then(async (res)=>{
                        if (res == undefined) await socket.reply(c, chatId, msgs_texto.admin.entrar_grupo.pendente,id)
                        else await socket.reply(c, chatId, msgs_texto.admin.entrar_grupo.entrar_sucesso,id)
                    }).catch(async ()=>{
                        await socket.reply(c, chatId, msgs_texto.admin.entrar_grupo.entrar_erro, id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break

            case 'sair':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    await socket.sendText(c, chatId, msgs_texto.admin.sair.sair_sucesso)
                    await socket.leaveGroup(c, groupId)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'listablock':
                try{
                    if(blockNumber.length == 0) return socket.reply(c, chatId, msgs_texto.admin.listablock.lista_vazia, id)
                    var resposta = criarTexto(msgs_texto.admin.listablock.resposta_titulo, blockNumber.length)
                    for (let i of blockNumber) resposta += criarTexto(msgs_texto.admin.listablock.resposta_itens, i.replace(/@s.whatsapp.net/g,''))
                    await socket.reply(c, chatId, resposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "bcmdglobal":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command) ,id)
                    var usuarioComandos = textoRecebido.slice(12).split(" "), respostaBloqueio = await bot.bloquearComandosGlobal(usuarioComandos)
                    await socket.reply(c, chatId, respostaBloqueio, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "dcmdglobal":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,await erroComandoMsg(command),id)
                    var usuarioComandos = textoRecebido.slice(12).split(" "), respostaDesbloqueio = await bot.desbloquearComandosGlobal(usuarioComandos)
                    await socket.reply(c, chatId, respostaDesbloqueio, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case 'rconfig':
                try{
                    await grupos.resetarGrupos()
                    await socket.reply(c, chatId,msgs_texto.admin.rconfig.reset_sucesso,id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'sairgrupos':
                try{
                    let gruposAtuais = await grupos.obterTodosGruposInfo()
                    for (var grupo of gruposAtuais) await socket.leaveGroup(c, grupo.id_grupo)
                    var resposta = criarTexto(msgs_texto.admin.sairtodos.resposta, gruposAtuais.length)
                    await socket.reply(c, ownerNumber, resposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "bloquear":
                try{
                    var usuariosBloqueados = []
                    if(quotedMsg){
                        usuariosBloqueados.push(quotedMsgObjInfo.sender)
                    } else if(mentionedJidList.length > 1) {
                        usuariosBloqueados = mentionedJidList
                    } else {
                        var numeroInserido = textoRecebido.slice(10).trim()
                        if(numeroInserido.length == 0) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                        usuariosBloqueados.push(numeroInserido.replace(/\W+/g,"")+"@s.whatsapp.net")
                    }
                    for (var usuario of usuariosBloqueados){
                            if(ownerNumber == usuario){
                                await socket.reply(c, chatId, criarTexto(msgs_texto.admin.bloquear.erro_dono, usuario.replace(/@s.whatsapp.net/g, '')), id)
                            } else {
                                if(blockNumber.includes(usuario)) {
                                    await socket.reply(c, chatId, criarTexto(msgs_texto.admin.bloquear.ja_bloqueado, usuario.replace(/@s.whatsapp.net/g, '')), id)
                                } else {
                                    socket.contactBlock(c, usuario)
                                    await socket.reply(c, chatId, criarTexto(msgs_texto.admin.bloquear.sucesso, usuario.replace(/@s.whatsapp.net/g, '')), id)
                                }
                            }
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break      

            case "desbloquear":
                try{
                    let usuariosDesbloqueados = []
                    if(quotedMsg){
                        usuariosDesbloqueados.push(quotedMsgObjInfo.sender)
                    } else if(mentionedJidList.length > 1) {
                        usuariosDesbloqueados = mentionedJidList
                    } else {
                        var numeroInserido = textoRecebido.slice(13).trim()
                        if(numeroInserido.length == 0) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                        usuariosDesbloqueados.push(numeroInserido.replace(/\W+/g,"")+"@s.whatsapp.net")
                    }
                    for (var usuario of usuariosDesbloqueados){
                        if(!blockNumber.includes(usuario)) {
                            await socket.reply(c, chatId, criarTexto(msgs_texto.admin.desbloquear.ja_desbloqueado, usuario.replace(/@s.whatsapp.net/g,'')), id)
                        } else {
                            socket.contactUnblock(c, usuario)
                            await socket.reply(c, chatId, criarTexto(msgs_texto.admin.desbloquear.sucesso, usuario.replace(/@s.whatsapp.net/g,'')), id)
                        }
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "autostickerpv":
                try{
                    var novoEstado = !botInfoJSON.autosticker
                    if(novoEstado){
                        bot.alterarAutoSticker(true)
                        await socket.reply(c, chatId, msgs_texto.admin.autostickerpv.ativado,id)
                    } else {
                        bot.alterarAutoSticker(false)
                        await socket.reply(c, chatId, msgs_texto.admin.autostickerpv.desativado,id)
                    } 
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "pvliberado":
                try{
                    var novoEstado = !botInfoJSON.pvliberado
                    if(novoEstado){
                        bot.alterarPvLiberado(true)
                        await socket.reply(c, chatId, msgs_texto.admin.pvliberado.ativado,id)
                    } else {
                        bot.alterarPvLiberado(false)
                        await socket.reply(c, chatId, msgs_texto.admin.pvliberado.desativado,id)
                    } 
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "fotobot":
                try{
                    if(isMedia || quotedMsg){
                        var dadosMensagem = {
                            tipo : (isMedia) ? type : quotedMsgObjInfo.type,
                            mimetype : (isMedia)? mimetype : quotedMsgObjInfo.mimetype,
                            mensagem: (isMedia) ? id : quotedMsgObj
                        }
                        if(dadosMensagem.tipo == MessageTypes.image){
                            var fotoBuffer = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                            await socket.setProfilePic(c, botNumber, fotoBuffer)
                            await socket.reply(c, chatId, msgs_texto.admin.fotobot.sucesso, id)
                        } else {
                            return socket.reply(c, chatId, await erroComandoMsg(command) , id)
                        }
                    } else {
                        return socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "limitediario":
                try{
                    var novoEstado = !botInfoJSON.limite_diario.status
                    if(novoEstado){
                        bot.alterarLimiteDiario(true)
                        await socket.reply(c, chatId, msgs_texto.admin.limitediario.ativado, id)
                    } else {
                        bot.alterarLimiteDiario(false)
                        await socket.reply(c, chatId, msgs_texto.admin.limitediario.desativado, id)
                    } 
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break

            case "taxalimite":
                try{
                    var novoEstado = !botInfoJSON.limitecomandos.status
                    if(novoEstado){
                        if(args.length !== 3) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                        var qtd_max_minuto = args[1], tempo_bloqueio = args[2]
                        if(isNaN(qtd_max_minuto) || qtd_max_minuto < 3) return await socket.reply(c, chatId,msgs_texto.admin.limitecomandos.qtd_invalida, id)
                        if(isNaN(tempo_bloqueio) || tempo_bloqueio < 10) return await socket.reply(c, chatId,msgs_texto.admin.limitecomandos.tempo_invalido, id)
                        bot.alterarLimitador(true, parseInt(qtd_max_minuto), parseInt(tempo_bloqueio))
                        await socket.reply(c, chatId, msgs_texto.admin.limitecomandos.ativado, id)
                    } else {
                        bot.alterarLimitador(false)
                        await socket.reply(c, chatId, msgs_texto.admin.limitecomandos.desativado, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "nomebot":
                try{
                    if(args.length == 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var usuarioTexto = textoRecebido.slice(9).trim()
                    bot.alterarNomeBot(usuarioTexto)
                    await socket.reply(c, chatId, msgs_texto.admin.nomebot.sucesso, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "nomeadm":
                try{
                    if(args.length == 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var usuarioTexto = textoRecebido.slice(9).trim()
                    bot.alterarNomeAdm(usuarioTexto)
                    await socket.reply(c, chatId, msgs_texto.admin.nomeadm.sucesso, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "nomesticker":
                try{
                    if(args.length == 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var usuarioTexto = textoRecebido.slice(13).trim()
                    bot.alterarNomeFigurinhas(usuarioTexto)
                    await socket.reply(c, chatId, msgs_texto.admin.nomesticker.sucesso, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "prefixo":
                try{
                    if(args.length == 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var usuarioTexto = textoRecebido.slice(9).trim(), prefixosSuportados = ["!", "#", ".", "*"]
                    if(!prefixosSuportados.includes(usuarioTexto)) return await socket.reply(c, chatId, msgs_texto.admin.prefixo.nao_suportado, id)
                    bot.alterarPrefixo(usuarioTexto)
                    await socket.reply(c, chatId, msgs_texto.admin.prefixo.sucesso, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "limitarmsgs":
                try{
                    var novoEstado = !botInfoJSON.limitarmensagens.status
                    if(novoEstado){
                        if(args.length !== 3) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                        let max_msg = args[1], msgs_intervalo = args[2]
                        if(isNaN(max_msg) || max_msg < 3) return await socket.reply(c, chatId, msgs_texto.admin.limitarmsgs.qtd_invalida, id)
                        if(isNaN(msgs_intervalo) || msgs_intervalo < 10) return await socket.reply(c, chatId, msgs_texto.admin.limitarmsgs.tempo_invalido, id)
                        bot.alterarLimitarMensagensPv(true,parseInt(max_msg),parseInt(msgs_intervalo))
                        await socket.reply(c, chatId, msgs_texto.admin.limitarmsgs.ativado, id)
                    } else {
                        bot.alterarLimitarMensagensPv(false)
                        await socket.reply(c, chatId, msgs_texto.admin.limitarmsgs.desativado, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "mudarlimite":
                try{
                    if(!botInfoJSON.limite_diario.status) return await socket.reply(c, chatId, msgs_texto.admin.mudarlimite.erro_limite_diario, id)
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var tipo = args[1].toLowerCase(), qtd = args[2]
                    if(qtd != -1) if(isNaN(qtd) || qtd < 5) return await socket.reply(c, chatId, msgs_texto.admin.mudarlimite.invalido, id)
                    var alterou = await bot.alterarQtdLimiteDiarioTipo(tipo, parseInt(qtd))
                    if(!alterou) return await socket.reply(c, chatId, msgs_texto.admin.mudarlimite.tipo_invalido, id)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.admin.mudarlimite.sucesso, tipo.toUpperCase(), qtd == -1 ? "∞" : qtd), id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "usuarios":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let tipo = args[1].toLowerCase()
                    let usuariosTipo = await usuarios.obterUsuariosTipo(tipo)
                    if(usuariosTipo.length == 0) return await socket.reply(c, chatId, msgs_texto.admin.usuarios.nao_encontrado, id)
                    let respostaItens = ''
                    for (let usuario of usuariosTipo) respostaItens += criarTexto(msgs_texto.admin.usuarios.resposta_item, usuario.nome, usuario.id_usuario.replace("@s.whatsapp.net", ""), usuario.comandos_total)
                    let resposta = criarTexto(msgs_texto.admin.usuarios.resposta_titulo, tipo.toUpperCase(), usuariosTipo.length, respostaItens)
                    await socket.reply(c, chatId, resposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "limpartipo":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var tipo = args[1].toLowerCase()
                    var limpou = await usuarios.limparTipo(tipo)
                    if(!limpou) return await socket.reply(c, chatId, msgs_texto.admin.limpartipo.erro, id)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.admin.limpartipo.sucesso, tipo.toUpperCase()), id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "alterartipo":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let usuario_tipo = ""
                    if(quotedMsg) usuario_tipo = quotedMsgObjInfo.sender
                    else if(mentionedJidList.length === 1) usuario_tipo = mentionedJidList[0]
                    else if(args.length > 2) usuario_tipo = args.slice(2).join("").replace(/\W+/g,"")+"@s.whatsapp.net"
                    else return await socket.reply(c, chatId, await erroComandoMsg(command),id)
                    if(ownerNumber == usuario_tipo) return await socket.reply(c, chatId, msgs_texto.admin.alterartipo.tipo_dono, id)
                    let c_registrado = await usuarios.verificarRegistro(usuario_tipo)
                    if(c_registrado){
                        let alterou = await usuarios.alterarTipoUsuario(usuario_tipo, args[1])
                        if(!alterou) return await socket.reply(c, chatId, msgs_texto.admin.alterartipo.tipo_invalido, id)
                        await socket.reply(c, chatId, criarTexto(msgs_texto.admin.alterartipo.sucesso, args[1].toUpperCase()), id)
                    } else {
                        await socket.reply(c, chatId, msgs_texto.admin.alterartipo.nao_registrado, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
        
            case "tipos":
                try{
                    var tipos = botInfoJSON.limite_diario.limite_tipos, respostaTipos = ''
                    for (var tipo in tipos) respostaTipos += criarTexto(msgs_texto.admin.tipos.item_tipo, msgs_texto.tipos[tipo], tipos[tipo] || "∞")
                    await socket.reply(c, chatId, criarTexto(msgs_texto.admin.tipos.resposta, respostaTipos), id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "rtodos":
                try{
                    if(!botInfoJSON.limite_diario.status) return await socket.reply(c, chatId, msgs_texto.admin.rtodos.erro_limite_diario,id)
                    await usuarios.resetarComandosDia()
                    await socket.reply(c, chatId, msgs_texto.admin.rtodos.sucesso,id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "r":
                try{
                    if(!botInfoJSON.limite_diario.status) return await socket.reply(c, chatId, msgs_texto.admin.r.erro_limite_diario,id)
                    if(quotedMsg){
                        let r_registrado = await usuarios.verificarRegistro(quotedMsgObjInfo.sender)
                        if(r_registrado){
                            await usuarios.resetarComandosDiaUsuario(quotedMsgObjInfo.sender)
                            await socket.reply(c, chatId, msgs_texto.admin.r.sucesso,id)
                        } else {
                            return await socket.reply(c, chatId, msgs_texto.admin.r.nao_registrado,id)
                        }
                    } else if (mentionedJidList.length === 1){
                        let r_registrado = await usuarios.verificarRegistro(mentionedJidList[0])
                        if(r_registrado){
                            await usuarios.resetarComandosDiaUsuario(mentionedJidList[0])
                            await socket.reply(c, chatId, msgs_texto.admin.r.sucesso,id)
                        } else {
                            return await socket.reply(c, chatId, msgs_texto.admin.r.nao_registrado,id)
                        }
                    } else if(args.length >= 1){
                        let r_numero_usuario = ""
                        for (let i = 1; i < args.length; i++){
                            r_numero_usuario += args[i]
                        }
                        r_numero_usuario = r_numero_usuario.replace(/\W+/g,"")
                        let r_registrado = await usuarios.verificarRegistro(r_numero_usuario+"@s.whatsapp.net")
                        if(r_registrado){
                            await usuarios.resetarComandosDiaUsuario(r_numero_usuario+"@s.whatsapp.net")
                            await socket.reply(c, chatId, msgs_texto.admin.r.sucesso,id)
                        } else {
                            await socket.reply(c, chatId, msgs_texto.admin.r.nao_registrado,id)
                        }
                    } else {
                        await socket.reply(c, chatId, await erroComandoMsg(command),id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break  
                
            case "verdados":
                try{
                    var idUsuario = "", dadosUsuario = {}
                    if(quotedMsg) idUsuario = quotedMsgObjInfo.sender
                    else if(mentionedJidList.length === 1) idUsuario = mentionedJidList[0]
                    else if(args.length >= 1) idUsuario =  args.slice(1).join("").replace(/\W+/g,"")+"@s.whatsapp.net"
                    else return await socket.reply(c, chatId, await erroComandoMsg(command),id)
                    var usuarioRegistrado = await usuarios.verificarRegistro(idUsuario)
                    if(usuarioRegistrado) dadosUsuario = await usuarios.obterDadosUsuario(idUsuario)
                    else return await socket.reply(c, chatId,msgs_texto.admin.verdados.nao_registrado,id)
                    var maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite"
                    var tipoUsuario = msgs_texto.tipos[dadosUsuario.tipo]
                    var nomeUsuario =  dadosUsuario.nome || "Ainda não obtido"
                    var resposta = criarTexto(msgs_texto.admin.verdados.resposta_superior, nomeUsuario, tipoUsuario, dadosUsuario.id_usuario.replace("@s.whatsapp.net",""))
                    if(botInfoJSON.limite_diario.status) resposta += criarTexto(msgs_texto.admin.verdados.resposta_variavel.limite_diario.on, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                    resposta += criarTexto(msgs_texto.admin.verdados.resposta_inferior, dadosUsuario.comandos_total)
                    await socket.reply(c, chatId, resposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
                     
            case 'bcgrupos':
                try{
                    if(args.length === 1) return socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let mensagem = textoRecebido.slice(10).trim(), gruposAtuais = await grupos.obterTodosGruposInfo()
                    await socket.reply(c, chatId, criarTexto(msgs_texto.admin.bcgrupos.espera, gruposAtuais.length, gruposAtuais.length) , id)
                    for (var grupo of gruposAtuais) {
                        if (!grupo.restrito_msg) {
                            await new Promise((resolve)=>{
                                setTimeout(async ()=>{
                                    resolve(await socket.sendText(c, grupo.id_grupo, criarTexto(msgs_texto.admin.bcgrupos.anuncio, mensagem)))
                                }, 1000)
                            })
                        }
                    }
                    await socket.reply(c, chatId, msgs_texto.admin.bcgrupos.bc_sucesso , id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break
            
            case "grupos":
                try{
                    let gruposAtuais = await grupos.obterTodosGruposInfo(), resposta = criarTexto(msgs_texto.admin.grupos.resposta_titulo, gruposAtuais.length)
                    for (var grupo of gruposAtuais){
                        var adminsGrupo = grupo.admins
                        var botAdmin = adminsGrupo.includes(botNumber)
                        var linkGrupo = "Não Disponível"
                        if(botAdmin) linkGrupo = await socket.getGroupInviteLink(c, grupo.id_grupo)
                        resposta += criarTexto(msgs_texto.admin.grupos.resposta_itens, grupo.nome, grupo.participantes.length, botAdmin ? "Sim" : "Não", linkGrupo)
                    }
                    await socket.reply(c, chatId, resposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case 'estado':
                try{
                    if(args.length != 2)  return socket.reply(c, chatId,await erroComandoMsg(command),id)
                    switch(args[1]){
                        case 'online':
                            await socket.setMyStatus(c, "< 🟢 Online />")
                            await socket.reply(c, chatId,msgs_texto.admin.estado.sucesso,id)
                            break
                        case 'offline':
                            await socket.setMyStatus(c, "< 🔴 Offline />")
                            await socket.reply(c, chatId,msgs_texto.admin.estado.sucesso,id)
                            break    
                        case 'manutencao':
                            await socket.setMyStatus(c, "< 🟡 Manutenção />")
                            await socket.reply(c, chatId,msgs_texto.admin.estado.sucesso,id)
                            break
                        default:
                            await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break

            case 'desligar':
                try{
                    await socket.reply(c, chatId, msgs_texto.admin.desligar.sucesso, id).then(async()=>{
                        await socket.botLogout(c)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break
            
            case "ping":
                try{
                    let tempoResposta = (moment.now()/1000) - t
                    let memoriaTotal = os.totalmem()/1024000000, memoriaUsada = (os.totalmem() - os.freemem())/1024000000
                    let sistemaOperacional = `${os.type()} ${os.release()}`
                    let nomeProcessador = os.cpus()[0].model
                    let gruposAtuais = await grupos.obterTodosGruposInfo()
                    var contatos = await usuarios.obterDadosTodosUsuarios()
                    await socket.reply(c, chatId, criarTexto(
                    msgs_texto.admin.ping.resposta, 
                    sistemaOperacional, 
                    nomeProcessador, 
                    memoriaUsada.toFixed(2), 
                    memoriaTotal.toFixed(2), 
                    tempoResposta.toFixed(3),
                    contatos.length,
                    gruposAtuais.length,
                    timestampParaData(botInfoJSON.iniciado)), id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'devtest':
                try{
                    //PARA TESTES
                    await converterTextoParaImagem("Testando a conversão")
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

        }
    } catch(err){
        consoleErro(err, "ADMIN")
    }
    
}