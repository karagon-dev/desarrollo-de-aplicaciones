export const radiusTokens = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  full: '9999px',
} as const;

export type RadiusToken = keyof typeof radiusTokens;

export const radiusCssVarMap: Record<RadiusToken, string> = {
  sm: '--radius-sm',
  md: '--radius-md',
  lg: '--radius-lg',
  full: '--radius-full',
};
