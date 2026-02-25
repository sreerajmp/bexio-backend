import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route or controller as public (no cookie auth required).
 * Usage: @SkipAuth() above a method or class.
 */
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
