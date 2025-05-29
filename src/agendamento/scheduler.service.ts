import { Injectable, OnModuleInit } from '@nestjs/common';
import * as schedule from 'node-schedule'; // <- importante!

@Injectable()
export class SchedulerService implements OnModuleInit {
  onModuleInit() {
    // Agendar para rodar a cada 10 segundos
    schedule.scheduleJob('*/10 * * * * *', () => {
      console.log('Mensagem agendada via SchedulerService:', new Date());
    });
  }
}

//* * * * * *
//│ │ │ │ │ └── Dia da semana (0-7)
//│ │ │ │ └──── Mês (1-12)
//│ │ │ └────── Dia do mês (1-31)
//│ │ └──────── Hora (0-23)
//│ └────────── Minuto (0-59)
//└──────────── Segundo (opcional, mas não usado aqui)