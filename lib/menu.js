module.exports = {
    menuPrincipal : ()=>{
        return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽ 
|
|>---- ☾ 🤖 *MENU PRINCIPAL* 🤖☽
|
|- Digite um dos comandos abaixo:
|
|- *!menu* 0 -> Informação
|- *!menu* 1 -> Figurinhas
|- *!menu* 2 -> Utilidades
|- *!menu* 3 -> Downloads
|- *!menu* 4 -> Grupo
|- *!menu* 5 -> Diversão
|- *!menu* 6 -> Créditos
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
    },

    menuFigurinhas: ()=>{
        return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽ 
|
|>- Guia : *!comando* guia
|
|>---- ☾ 🖼️ *FIGURINHAS* 🖼️☽
|
|- *!s* - Transfome uma IMAGEM/GIF/VIDEO em *sticker*.
|- *!s* 1 - Transfome uma IMAGEM/GIF/VIDEO em *sticker circular*.
|- *!s* 2 - Transfome uma IMAGEM/GIF/VIDEO em *sticker sem cortar*.
|- *!simg* - Transforme um STICKER NÃO ANIMADO em *foto*.
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
    },

    menuInfoSuporte: ()=>{
        return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽ 
|
|>- Guia : *!comando* guia
|
|>---- ☾ ❓ *INFO/SUPORTE* ❓☽
|
|- *!info* - Informações do bot e contato do dono.
|- *!reportar* [mensagem] - Reporte um problema para o dono.
|- *!meusdados* - Exibe seus dados de uso .
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
    },

    menuDownload: ()=>{
        return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽ 
|
|>- Guia : *!comando* guia
|
|>---- ☾ 📥 *DOWNLOADS* 📥☽
|
|- *!play* [nome-musica] - Faz download de uma música e envia.
|- *!yt* [nome-video] - Faz download de um video do Youtube e envia.
|- *!fb* [link-post] - Faz download de um video do Facebook e envia.
|- *!ig* [link-post] - Faz download de um video/foto do Instagram e envia.
|- *!tw* [link-tweet] - Faz download de um video/foto do Twitter e envia.
|- *!tk* [link-tiktok] - Faz download de um video do Tiktok e envia.
|- *!img* [tema-imagem] - Faz download de uma imagem e envia.
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
    },

    menuUtilidades: ()=>{
        return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽
|
|>- Guia : *!comando* guia
|
|>---- ☾ ⚒️ *UTILITÁRIOS* ⚒️☽
|
|- *!voz* [idioma] [mensagem] - Transforma texto em audio.
|- *!audio* [tipo-edicao] - Responda um audio com este comando para fazer a edição.
|- *!qualmusica* - Responda um audio/video para identificar a música.
|- *!letra* [nome-musica] - Envia a letra da música que você digitar.
|- *!anime* -  Identifica o anime por foto de uma cena.
|- *!tabela* -  Mostra tabela com letras para criação de nicks.
|- *!traduz* [idioma] [texto] - Traduz um texto para o idioma escolhido.
|- *!ddd* - Responda alguém para ver o estado/região.
|- *!pesquisa* [tema] - Faz uma rápida pesquisa na internet.
|- *!clima* [cidade] - Mostra a temperatura atual.
|- *!noticias* - Obtem noticias atuais.
|- *!moeda* [real|dolar|euro] [valor] - Converte o valor de uma determinada moeda para outras.
|- *!calc* [expressão-matemática] - Calcula alguma conta que queira fazer.
|- *!rastreio* [código-rastreio] - Rastreamento dos CORREIOS.
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
    },

    menuGrupo: (isGroupAdmin)=>{
        if(isGroupAdmin){
            return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽ 
|
|>- Guia : *!comando* guia
|
|>---- ☾ 👨‍👩‍👧‍👦 *GRUPO* 👨‍👩‍👧‍👦☽ 
|
|-- ☾ GERAL ☽
|
|- *!status* - Vê os recursos ligados/desligados.
|- *!regras* - Exibe a descrição do grupo com as regras.
|- *!adms* - Lista todos administradores.
|- *!fotogrupo* - Altera foto do grupo
|- *!mt* [mensagem] - Marca todos MEMBROS/ADMINS com uma mensagem.
|- *!mm* [mensagem] - Marca os MEMBROS com uma mensagem.
|- *!dono* - Mostra dono do grupo.
|
|-- ☾ CONTROLE DE ATIVIDADE ☽
|
|- *!contador* - Liga/desliga o contador de atividade (Mensagens).
|- *!atividade* @marcarmembro - Mostra a atividade do usuário no grupo. 
|- *!alterarcont* [quantidade] @membro - Altera a quantidade de mensagens de um membro.
|- *!imarcar* 1-50 - Marca todos os inativos com menos de 1 até 50 mensagens.
|- *!ibanir* 1-50 - Bane todos os inativos com  menos de 1 até 50 mensagens.
|- *!topativos* 1-50 - Marca os membros mais ativos em um ranking de 1-50 pessoas.
|
|-- ☾ BLOQUEIO DE COMANDOS ☽ 
|
|- *!bcmd* [comando1 comando2 etc] - Bloqueia os comandos escolhidos no grupo.
|- *!dcmd* [comando1 comando2 etc] - Desbloqueia os comandos escolhidos no grupo.
|
|-- ☾ LISTA NEGRA ☽ 
|
|- *!blista* +55 (21) 9xxxx-xxxx - Adiciona o número na lista negra do grupo.
|- *!dlista* +55 (21) 9xxxx-xxxx - Remove o número na lista negra do grupo.
|- *!listanegra* - Exibe a lista negra do grupo.
|
|-- ☾ RECURSOS ☽ 
|
|- *!mutar* - Ativa/desativa o uso de comandos.
|- *!autosticker* - Ativa/desativa a criação automática de stickers.
|- *!alink* - Ativa/desativa o anti-link.
|- *!bv* - Ativa/desativa o bem-vindo.
|- *!afake* - Ativa/desativa o anti-fake.
|- *!aflood* - Ativa/desativa o anti-flood.
|
|-- ☾ ADMINISTRATIVO ☽
|
|- *!add* +55 (21) 9xxxx-xxxx - Adiciona ao grupo.
|- *!ban* @marcarmembro - Bane do grupo.
|- *!f* - Abre/fecha o grupo.
|- *!promover* @marcarmembro - Promove a ADM.
|- *!rebaixar* @marcaradmin - Rebaixa a MEMBRO.
|- *!link* - Exibe o link do grupo.
|- *!rlink* - Redefine o link do grupo.
|- *!apg* - Apaga mensagem do BOT.
|- *!bantodos* - Bane todos os membros.
|
|-- ☾ ENQUETE ☽
|
|- *!enquete* pergunta,opcao1,opcao2,etc.. - Abre uma enquete com uma pergunta e as opçôes.
|
|-- ☾ ETC.. ☽
|
|- *!roletarussa* - Expulsa um membro aleatório do grupo.
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
        } else {
            return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽ 
|
|>- Guia : *!comando* guia
|
|>---- ☾ 👨‍👩‍👧‍👦 *GRUPO* 👨‍👩‍👧‍👦☽
|
|-- ☾ GERAL ☽
|- *!regras* - Exibe a descrição do grupo com as regras.
|- *!adms* - Lista todos administradores.
|- *!dono* - Mostra dono do grupo.
|
|--☾ ENQUETE ☽
|- *!enquete* pergunta,opcao1,opcao2,etc.. - Abre uma enquete com uma pergunta e as opçôes.
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
        }
    },

    menuDiversao:(isGroup)=>{
        if(isGroup){
            return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ❣ 
|
|>- Guia : *!comando* guia
|
|>---- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote* - Exibe o mascote.
|- *!caracoroa* - Decide no cara ou coroa.
|- *!ppt* [pedra, papel, tesoura] - Pedra, papel ou tesoura.
|- *!viadometro* - Mede o nível de viadagem de alguma pessoa.
|- *!detector* - Detecta mentiras utilizando uma IA avançada.
|- *!casal* - Seleciona aleatoriamente um casal.
|- *!fch* - Gera uma frase contra a humanidade.
|- *!gadometro* - Mencione um membro ou responda ele para descobrir.
|- *!chance* - Calcula a chance de algo acontecer.
|- *!bafometro* - Mede o nível de álcool de uma pessoa.
|- *!top5* [tema] - Ranking dos Top 5 com o tema que você escolher.
|- *!par* @pessoa1 @pessoa2 - Mede o nivel de compatibilidade entre 2 pessoas.
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
        } else {
            return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽ 
|
|>- Guia : *!comando* guia
|
|>---- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote* - Exibe o mascote.
|- *!chance* - Calcula a chance de algo acontecer.
|- *!fch* - Gera uma frase contra a humanidade.
|- *!caracoroa* - Decide no cara ou coroa.
|- *!ppt* [pedra, papel, tesoura] - Pedra, papel ou tesoura.
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
        }
    },

//NÃO REMOVA ESSA PARTE DE CRÉDITOS, PENSE NO TRABALHO E ESFORÇO QUE TEMOS PARA MANTER O BOT ATUALIZADO E FUNCIONANDO.
    menuCreditos: ()=>{
        return `☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽ 

Criador do Bot : Leal
Github : https://github.com/victorsouzaleal
`
    },

    menuAdmin: ()=>{
        return `__| ☾ *🤖 ${process.env.NOME_BOT.trim()}®* ☽ 
|
|>- Guia : *!comando* guia
|
|>---- ☾ ⚙️ *ADMINISTRAÇÃO* ⚙️☽
|
|-- ☾ GERAL ☽
|
|- *!infocompleta* - Informação completa do BOT.
|- *!ping* - Informação do sistema e de tempo de resposta.
|- *!bloquear* @usuario  - Bloqueia o usuário mencionado.
|- *!desbloquear* @usuario  - Desbloqueia o usuário mencionado.
|- *!listablock*  - Lista todos os usuários bloqueados.
|- *!fotobot* - Altera foto do BOT
|- *!estado* [online, offline ou manutencao]  - Seleciona o estado atual do bot.
|- *!bcgrupos* [mensagem] - Faz um anúncio com uma mensagem somente para os GRUPOS.
|- *!desligar* - Desliga o bot.
|
|-- ☾ BLOQUEIO DE COMANDOS ☽ 
|
|- *!bcmdglobal* [comando1 comando2 etc] - Bloqueia os comandos escolhidos globalmente.
|- *!dcmdglobal* [comando1 comando2 etc] - Desbloqueia os comandos escolhidos globalmente.
|
|-- ☾ BOT USUÁRIOS ☽
|
|- *!verdados* @usuario - Mostra os dados do usuario cadastrado no bot.
|- *!tipos* - Mostra todos os tipos de usuário disponíveis.
|- *!alterartipo* [tipo] @usuario - Muda o tipo de conta do usuário.
|- *!limpartipo* [tipo] @usuario - Limpa todos os usuários desse tipo e transforma em usuarios comuns.
|- *!usuarios* [tipo]  - Mostra todos os usuários do tipo escolhido.
|
|-- ☾ CONTROLE/LIMITE ☽
|
|- *!pvliberado* - Ativa/desativa os comandos em mensagens privadas.
|- *!autostickerpv* - Ativa/desativa a criação automática de stickers no privado.
|- *!taxalimite* [qtd-comandos] [tempo-bloqueio] - Ativa/desativa a taxa de comandos por minuto.
|- *!limitediario* - Ativa/desativa o limite diario de comandos por dia.
|- *!limitarmsgs* [qtd-msgs] [intervalo] - Ativa/desativa o limite de mensagens privadas em um intervalo.
|- *!mudarlimite* [tipo] [novo-limite] - Muda o limite de comandos por dia de um tipo de usuário.
|- *!rtodos* - Reseta os comandos diários de todos.
|- *!r* @usuario - Reseta os comandos diários de um usuário.
|
|-- ☾ GRUPOS ☽
|
|- *!grupos* - Mostra os grupos atuais.
|- *!sair* - Sai do grupo.
|- *!sairgrupos* - Sai de todos os grupos.
|- *!entrargrupo* [link-grupo] - BOT entra no grupo.
|- *!rconfig* - Reseta as configurações dos grupos.
|
╰╼❥ ${process.env.NOME_BOT.trim()}® by *${process.env.NOME_ADMINISTRADOR.trim()}*`
    }
}
