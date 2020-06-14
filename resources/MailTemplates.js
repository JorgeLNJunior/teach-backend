const moment = require('moment')

const userRegistration = (user) => {

  const id = user.id
  const username = user.username
  const email = user.email
  const code = user.activation_code

  const date = moment(user.created_at).locale('pt-br').format('LL')
  const productionBaseURL = 'https://teach-project.netlify.app'
  //const developmentBaseURL = 'http://localhost:3333'

  const msg = {
    to: email,
    from: 'noreply@teach.com',
    subject: 'Confirmação de email',
    html: `<h2> Olá ${username} </h2>\n
      <p>
        Bem-vindo(a) a Teach, por favor confirme seu endereço de email para que
        sua conta possa ser utilizada.
      </p>\n

      <b>Nome: ${username}</b><br>\n
      <b>Email: ${email }</b><br>\n
      <b>Data de registro: ${date}</b><br>\n

      <br>\n

      <a href="${productionBaseURL}/activate/?id=${id}&code=${code}" target="_blank">
        <button>Ativar conta</button>
      </a>\n
    `
  }

  return msg

}

const passwordRecovery = (user) => {

  //Observações
  //O botão deve redirecionar o usuário ao frontend onde ele deve inserir os dados
  //mas como ele ainda não está finalizado não haverá o redirecionamento

  const id = user.id
  const username = user.username
  const email = user.email

  const msg = {
    to: email,
    from: 'noreply@teach.com',
    subject: 'Recuperação de senha',
    html: `<h2> Olá ${username} </h2>\n
      <p>
        Esqueceu sua senha? Por favor clique no botão abaixo
        para recuperá-la
      </p>\n

      <br>\n

      <a href="http://google.com" target="_blank">
        <button>Recuperar senha</button>
      </a>\n
    `
  }

  return msg

}



module.exports = { userRegistration, passwordRecovery }
