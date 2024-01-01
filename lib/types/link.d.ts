import { Link } from "@prisma/client";

type WithoutPassword<T> = Omit<T, "password">;

export interface DomainKey {
  domain: string;
  key: string;
}

export type WithPassword = {
  password: string | null;
};

export type WithHasPassword<T> = T & {
  hasPassword: boolean;
};

export type TLink = WithoutPassword<WithHasPassword<Link>>;

export interface RedisLink {
  url: string;
  archived: boolean;
  password?: string;
  expiresAt?: Date;
  ios?: string;
  android?: string;
  geo?: GeoObject;
}

export type GeoObject = {
  [country: string]: string;
};

export interface FindLinksParams {
  domain?: string;
  sort?: string;
  page?: number;
  perPage?: number;
  showArchived?: boolean;
  search?: string;
}
