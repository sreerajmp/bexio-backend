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
export interface ContactListTypes {
  id: number;
  nr: string;
  contact_type_id: number;

  address_addition: string | null;
  birthday: string | null;
  city: string | null;
  contact_branch_ids: string | null;
  contact_group_ids: string | null;
  country_id: number | null;
  fax: string | null;
  house_number: string | null;

  is_lead: boolean;

  language_id: number | null;
  mail: string | null;
  mail_second: string | null;

  name_1: string | null;
  name_2: string | null;

  owner_id: number | null;

  phone_fixed: string | null;
  phone_fixed_second: string | null;
  phone_mobile: string | null;

  postcode: string | null;
  remarks: string | null;

  salutation_form: string | null;
  salutation_id: number | null;

  skype_name: string | null;
  street_name: string | null;

  title_id: number | null;

  updated_at: string;
  url: string | null;
  user_id: number | null;
}

export interface ContactResponse {
  status: number;
  data: ContactListTypes[];
}
