import fs from 'fs-extra'
import path from 'node:path'
import moment from "moment-timezone"
import {obterMensagensTexto} from './msgs.js'
import {obterGuias} from './guias.js'
import chalk from 'chalk'
import {obterBotVariaveis} from '../db-modulos/dados-bot-variaveis.js'
import {criacaoEnv} from './env.js'
import {botCriarArquivo} from '../db-modulos/bot.js'


export const erroComandoMsg = (comando) =>{
  var msgs_texto = obterMensagensTexto()
  return criarTexto(msgs_texto.geral.cmd_erro, comando, comando)
}

export const corTexto = (texto, cor)=>{
    return !cor ? chalk.green(texto) : chalk.hex(cor)(texto)
}

export const guiaComandoMsg = (tipo,comando)=>{
  let guias = obterGuias(), {prefixo, nome_bot, nome_adm} = obterBotVariaveis()
  comando = comando.replace(prefixo, "")
  return guias[tipo][comando]
}

export const criarTexto = (texto, ...params)=>{
  for(let i = 0; i < params.length; i++){
      texto = texto.replace(`{p${i+1}}`, params[i])
  }
  return texto
}

export const timestampParaData = (timestampMsg)=>{
    return moment(timestampMsg).format('DD/MM HH:mm:ss')
}

export const obterTempoRespostaSeg = (timestampMensagem) => {
    var tResposta = moment.now() - timestampMensagem
    return (tResposta/1000).toFixed(2)
}

export const consoleComando = (isGroup, categoria, comando, hex, timestampMsg, nomeUsuario, nomeChat)=>{
    var tMensagem = timestampParaData(timestampMsg)
    var tResposta = obterTempoRespostaSeg(timestampMsg)
    if(isGroup){
      console.log('\x1b[1;31m~\x1b[1;37m>', corTexto(`[GRUPO - ${categoria}]`, hex), tMensagem, corTexto(comando), 'de', corTexto(nomeUsuario), 'em', corTexto(nomeChat), `(${corTexto(`${tResposta}s`)})`)
    } else {
      console.log('\x1b[1;31m~\x1b[1;37m>', corTexto(`[PRIVADO - ${categoria}]`, hex), tMensagem, corTexto(comando), 'de', corTexto(nomeUsuario), `(${corTexto(`${tResposta}s`)})`)
    }
}

export const primeiraLetraMaiuscula = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const removerNegritoComando = (comando)=>{
    return comando.replace(/\*/gm, "").trim()
}

export const obterNomeAleatorio =(ext)=>{
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

export const consoleErro = (msg, tipo_erro = "API")=>{
  console.error(corTexto(`[${tipo_erro}]`,"#d63e3e"), msg)
}

export const criarArquivosNecessarios = async ()=>{
    try {
      const existePastaDatabase = fs.pathExistsSync(path.resolve("database"))
      const existePastaTemp = fs.pathExistsSync(path.resolve("temp"))
      const existeBotJson = fs.existsSync(path.resolve("database/bot.json")), existeEnv = fs.existsSync(path.resolve('.env')), existeAntiflood = fs.existsSync(path.resolve('database/antiflood.json'))
      
      //VERIFICA SE AS PASTAS DATABASE E TEMP EXISTEM
      if(!existePastaDatabase) fs.mkdirSync(path.resolve("database"), {recursive: true})
      if(!existePastaTemp) fs.mkdirSync(path.resolve("temp"), {recursive: true})

      //SE NÃO PRECISAR CRIAR NENHUM ARQUIVO NECESSÁRIO, RETORNE
      if(existeBotJson && existeEnv && existeAntiflood) return false

      if(!existeBotJson){
        //CRIA O ARQUIVO COM AS INFORMAÇÕES INICIAIS DO BOT
        await botCriarArquivo()
      }
      if(!existeEnv) {
        //CRIA O ARQUIVO .ENV
        await criacaoEnv()
      }
      if(!existeAntiflood){
        //CRIAR O ARQUIVO JSON DO ANTIFLOOD
        await fs.writeFile(path.resolve("database/antiflood.json"), "[]")
      }
      return true
    } catch(err){
        throw new Error(err)
    }
}