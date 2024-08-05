import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

export const RoleUser = Reflector.createDecorator<Role>();
