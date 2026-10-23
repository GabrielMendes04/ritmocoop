# RitmoCoop: como colocar no ar

Cada pessoa da empresa cria a própria conta, com e-mail e senha, e confirma o e-mail por um link antes de entrar. Quem cria a empresa vira o **chefe** e recebe um **código**. Os funcionários usam esse código para entrar na empresa. A área de cada pessoa (tarefas, rotina, calendário, hábitos e anotações) é privada: nem o chefe consegue abrir. Para passar algo a alguém, usa-se a aba **Mensagens**.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | O app inteiro |
| `firebase-config.js` | As chaves do seu projeto do Firebase (você preenche) |
| `firestore.rules` | As regras de segurança que deixam cada área privada |
| `manifest.webmanifest`, `sw.js`, `icons/` | Instalar no celular/computador e abrir sem internet |

## 1. Criar o projeto no Firebase (uns 10 minutos)

1. Entre em https://console.firebase.google.com e clique em **Adicionar projeto**. Nome: `ritmocoop`. Pode desligar o Google Analytics.
   - Use um projeto **novo**, separado do Ritmo, para as contas dos dois apps não se misturarem.
2. Menu **Criação > Authentication > Vamos começar**. Em **Método de login**, escolha **E-mail/senha**, ative a primeira chave e salve.
   - Depois clique em **Adicionar novo fornecedor > Google**, ative, escolha o e-mail de suporte e salve. Assim dá para entrar também com a conta Google.
3. Menu **Criação > Firestore Database > Criar banco de dados**.
   - Local: `southamerica-east1 (São Paulo)`.
   - Modo: **produção**.
4. Ainda no Firestore, abra a aba **Regras**, apague o que estiver lá, cole todo o conteúdo de `firestore.rules` e clique em **Publicar**.
5. Clique na engrenagem > **Configurações do projeto** > em **Seus apps**, clique no ícone **Web** (`</>`). Apelido: `RitmoCoop`. Não marque o Hosting. Clique em **Registrar app**.
6. Copie os valores do `firebaseConfig` que aparecem na tela e cole no arquivo `firebase-config.js`, no lugar dos textos `COLE_AQUI...` e `SEU-PROJETO`.

## 2. Publicar no GitHub Pages (igual ao Ritmo)

1. No GitHub, crie um repositório público chamado `ritmocoop`.
2. Envie **todos os arquivos desta pasta** para a raiz do repositório (o `index.html` precisa ficar na raiz, junto da pasta `icons`).
3. No repositório: **Settings > Pages > Build and deployment**. Em **Branch**, escolha `main` e a pasta `/ (root)`, depois salve.
4. Em 1 ou 2 minutos o app fica em: `https://gabrielmendes04.github.io/ritmocoop/`

## 3. Autorizar o endereço no Firebase

No Firebase: **Authentication > Configurações > Domínios autorizados > Adicionar domínio** e coloque `gabrielmendes04.github.io`.

Isso também faz o link de confirmação do e-mail trazer a pessoa de volta para o app.

## 4. E-mails em português

Em **Authentication > Modelos**, clique no lápis de **Verificação de endereço de e-mail** e de **Redefinição de senha** e escolha o idioma **Português (Brasil)**. Esses são os e-mails que o Firebase manda para confirmar a conta e para criar uma senha nova.

## 5. Primeiro uso

1. O **chefe** abre o app, toca em **Criar conta**, escolhe **Criar uma empresa** e digita o nome da empresa (ex.: Contage). Chega um e-mail com um link: ele toca no link e volta ao app em **Já confirmei**. Só aí a empresa é criada.
2. O código da empresa aparece no Início e na barra lateral (ex.: `K7M2QX`). O chefe passa esse código para a equipe.
3. Cada **funcionário** abre o app, toca em **Criar conta**, escolhe **Entrar numa empresa**, digita o código e confirma o e-mail pelo link.
4. Pronto: cada um entra com o próprio e-mail e senha e vê só a própria área. Todos da empresa aparecem na aba Mensagens.

Esqueceu a senha? Na tela de login, toque em **Esqueci minha senha**. O Firebase manda um e-mail com um link para criar outra.

## Como a privacidade é garantida

Não é só a tela que esconde. As regras do banco (`firestore.rules`) recusam qualquer leitura fora do permitido:

- Quem não confirmou o e-mail não lê nem grava nada.
- `users/{pessoa}` e `users/{pessoa}/data`: só a própria pessoa lê e grava.
- Para entrar numa empresa é preciso um código válido. Só quem criou a empresa pode ser chefe.
- Cada conversa só pode ser lida pelas duas pessoas que estão nela. Mensagens não podem ser apagadas nem editadas, só marcadas como lidas ou aceitas por quem recebeu.

## O que ainda não tem

- Remover alguém da empresa pela tela. Por enquanto, apague a pessoa em **Firestore > companies > (empresa) > members**, e a conta em **Authentication**, se quiser.
- Trocar nome, cargo ou e-mail pela tela.
- Avisos (notificações) quando chega mensagem com o app fechado.

## Custos

O plano gratuito do Firebase (Spark) dá conta de uma empresa pequena com folga: são 50 mil leituras e 20 mil gravações por dia, e o login por e-mail é gratuito para dezenas de milhares de pessoas por mês.
