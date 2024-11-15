import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Statistics } from './entities/statistics.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Endpoint para obter estatísticas administrativas.
   * @returns Estatísticas gerais do sistema.
   */
  @Get('statistics')
  async getStatistics(): Promise<Statistics> {
    return this.adminService.getStatistics();
  }
}
