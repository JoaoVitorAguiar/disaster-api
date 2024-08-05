import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendAlertEmail(email: string, username: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Alerta de ocorrência próxima:',
        template: './alert-email',
        context: {
          username,
        },
      });
      console.log("email enviado com sucesso")
    } catch (error) {
      console.log("erro ao enviar o email")
    }
  }
}
