import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import config from '../config/index';
import { IS_PUBLIC_KEY } from '../decorators/skip-auth.decorator';

@Injectable()
export class CookieAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // If the route or its controller is decorated with @SkipAuth(), allow through
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(), // method-level check first
            context.getClass(),   // then class-level
        ]);
        if (isPublic) return true;

        const req = context.switchToHttp().getRequest<Request>();
        return !!req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
    }
}
