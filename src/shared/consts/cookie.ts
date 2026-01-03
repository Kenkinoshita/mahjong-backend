export const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE_FLAG == 'true' ? true : false,
  domain: process.env.COOKIE_ACCEPT_DOMAIN || '',
  // sameSite: process.env.COOKIE_SECURE_FLAG == 'true' ? ('none' as const) : ('strict' as const),
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 day
  path: '/',
};

export const cookieNames = {
  tokenName: process.env.TOKEN_NAME_COOKIE_NAME || 'accessToken',
};
