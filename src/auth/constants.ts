export const jwtConstants = {
  secret: process.env.JWT_KEY || 'secretKeydsn2020',
  JWT_expiresIn: process.env.JWT_expiresIn || '90000s',
  refreshSecret: process.env.JWT_REFRESH_KEY || 'secretvckdfmldlmcvkdlmllKeydsn2020',
  JWT_refresh_expiresIn: process.env.JWT_refresh_expiresIn || '3200000s',
};


export enum LoginRole {
  MASTER_ADMIN = "MASTER_ADMIN",
  CSI_ADMIN = "CSI_ADMIN",
  ORG_ADMIN = "ORG_ADMIN",
  ORG_USER = "ORG_USER",
  AUDITOR = "AUDITOR",
  DEO = "DEO"
}