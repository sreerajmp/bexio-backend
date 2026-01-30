export type ChannelChangeLog = {
  from: string;
  to: string;
  user: number;
  timestamp: string; // ISO string from DB
};

export type InvoiceChannelChangeResult = {
  channel_change_logs: ChannelChangeLog[];
};


export type UserDetails = {
  id: number;
  salutation_type: string;
  firstname: string;
  lastname: string;
  email: string;
  is_superadmin: boolean;
  is_accountant: boolean;
};