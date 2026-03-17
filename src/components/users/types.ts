export type RoleOption = "USER" | "ADMIN" | "REPRESENTATIVE";

export interface RepProvince {
  region: string;
  whatsappNumber: string;
  active: boolean;
}

export interface BaseUser {
  id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  photo?: string;
  roles?: any[]; // backend may send strings or objects
  listings?: any[];
  notifications?: any[];
  auditLogs?: any[];
  feedbacks?: any[];
  representatives?: Array<RepProvince>;
  contacts?: any;
  metadata?: any;
  address?: any;
  createdAt?: string;
}

export interface CreateUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  photoFile?: File | null;
  role: RoleOption | "";
  representativeInfo: RepProvince[];
  contacts: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  metadata: {
    preferredLanguage: string;
    company: string;
    tags: string[];
  };
}

export const emptyRepProvince = (): RepProvince => ({
  region: "",
  whatsappNumber: "",
  active: true,
});
