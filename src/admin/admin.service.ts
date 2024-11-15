// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  // Simulação de dados (depois, integrar ao banco de dados)
  private statistics = {
    totalDoctors: 10,
    totalPatients: 50,
    totalAppointments: 200,
    totalRevenue: 5000,
    completedAppointments: 180,
    canceledAppointments: 20,
  };

  getStatistics() {
    return this.statistics;
  }
}
