const { userRegistration } = require('../../resources/MailTemplates')
const SgMail = require('@sendgrid/mail')

class UserRegistration {

  constructor(user) {
    this.user = user
  }

  async sendVerificationEmail() {

    const data = userRegistration(this.user)

    SgMail.setApiKey(process.env.SENDGRID_API_KEY)

    SgMail.send(data)

  }

}

module.exports = UserRegistration
