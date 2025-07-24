export enum PremiumStatus {
  active = 'active',
  inactive = 'inactive',
  processing = 'processing',
}

export interface UserEmail {
  email: string;
}

export interface PremiumArgs extends UserEmail {
  transactionId: string;
}
