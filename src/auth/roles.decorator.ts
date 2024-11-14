import { SetMetadata } from '@nestjs/common';

/**
 * Define os roles permitidos para acessar uma rota.
 * @param roles Lista de roles permitidos
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
