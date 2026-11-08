import { afterEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import authCookie from './authCookie';

const originalNodeEnv = process.env.NODE_ENV;

const createResponse = () => {
   const res = {
      cookie: vi.fn(),
   };
   res.clearCookie = express.response.clearCookie.bind(res);

   return res;
};

describe('authentication cookie configuration', () => {
   afterEach(() => {
      if (originalNodeEnv === undefined) {
         delete process.env.NODE_ENV;
      } else {
         process.env.NODE_ENV = originalNodeEnv;
      }
   });

   it.each([
      ['development', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' }],
      ['production', { httpOnly: true, secure: true, sameSite: 'none', path: '/' }],
   ])('uses matching creation and clearing options in %s', (nodeEnv, expectedOptions) => {
      process.env.NODE_ENV = nodeEnv;
      const res = createResponse();

      authCookie.setAuthCookie(res, 'test-token');
      authCookie.clearAuthCookie(res);

      expect(res.cookie).toHaveBeenCalledWith('token', 'test-token', {
         ...expectedOptions,
         maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      expect(res.cookie).toHaveBeenLastCalledWith('token', '', {
         ...expectedOptions,
         expires: new Date(1),
      });
   });
});
