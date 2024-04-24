import fs from 'fs-extra'
import path from 'node:path'
import {corTexto} from './util.js'
import {botCriarArquivo, botInfo} from '../database/bot.js'

//NÃO MODIFICAR ESSA PARTE, O .ENV CORRETO ESTÁ NA RAIZ DO PROJETO!!!!!!!!!!!!!!!!

export const criacaoEnv = async ()=>{
      const env = "# CONFIGURAÇÃO DE API KEYS PARA COMANDOS\n\n"+
      "# ACRCLOUD - Coloque abaixo suas chaves do ACRCloud (Reconhecimento de Músicas)\n"+
      "acr_host=??????\n"+
      "acr_access_key=??????\n"+
      "acr_access_secret=??????\n\n"+
      "# DEEPGRAM - Coloque abaixo sua chave do DEEPGRAM (Transcrição de aúdio para texto)\n"+
      "dg_secret_key=??????\n\n"
      await fs.writeFile(path.resolve('.env'), env , 'utf8')
}

//NÃO MODIFICAR ESSA PARTE, O .ENV CORRETO ESTÁ NA RAIZ DO PROJETO!!!!!!!!!!!!!!!!
export const verificarEnv = ()=>{
  try{
    let resposta = {
        acrcloud :{
          resposta: (process.env.acr_host?.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
            ? "A API do ACRCloud ainda não foi configurada corretamente" : "✓ API ACRCloud configurada.",
          cor_resposta: (process.env.acr_host?.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
          ? "#d63e3e" : false
        },
        deepgram : {
          resposta: (process.env.dg_secret_key?.trim() == "??????") ? "A API do DEEPGRAM ainda não foi configurada" : "✓ API DEEPGRAM configurada.",
          cor_resposta: (process.env.dg_secret_key?.trim() == "??????") ? "#d63e3e" : false
        },
      }
  
      console.log("[ENV]", corTexto(resposta.acrcloud.resposta, resposta.acrcloud.cor_resposta))
      console.log("[ENV]", corTexto(resposta.deepgram.resposta, resposta.deepgram.cor_resposta))
  } catch(err){
      err.message = `verificarEnv - ${err.message}`
      throw err
  }
}

export const verificarNumeroDono = async()=>{
    let {numero_dono} = botInfo()
    let resposta = (numero_dono == '') ? "O número do DONO ainda não foi configurado, digite !admin para cadastrar seu número como dono." : "✓ Número do DONO configurado."
    let cor_resposta = (numero_dono == '') ? "#d63e3e" : false
    console.log("[DONO]", corTexto(resposta, cor_resposta))
}

export const criarArquivosNecessarios = async ()=>{
  try {
    const existePastaDatabase = fs.pathExistsSync(path.resolve("database/db"))
    const existePastaTemp = fs.pathExistsSync(path.resolve("temp"))
    const existeBotJson = fs.existsSync(path.resolve("database/db/bot.json")), existeEnv = fs.existsSync(path.resolve('.env')), existeAntiflood = fs.existsSync(path.resolve('database/db/antiflood.json'))
    
    //VERIFICA SE AS PASTAS DATABASE E TEMP EXISTEM
    if(!existePastaDatabase) fs.mkdirSync(path.resolve("database/db"), {recursive: true})
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
      fs.writeFileSync(path.resolve("database/db/antiflood.json"), "[]")
    }
    return true
  } catch(err){
      throw new Error(err)
  }
}
