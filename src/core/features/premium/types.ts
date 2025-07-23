export enum PremiumStatus {
  active = 'active',
  inactive = 'inactive',
  processing = 'processing',
}

export type CheckPremiumStatusArgs = {
  email: string;
};

export type ProcessTransactionIdArgs = {
  email: string;
  transactionId: string;
};
