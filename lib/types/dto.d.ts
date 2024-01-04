import { GeoObject } from ".";

export interface LinkProps {
  domain: string;
  key: string;
  url: string;
  archived: boolean;
  password: string | null;
  expiresAt: string | null;
  ios: string | null;
  android: string | null;
  geo: GeoObject | null;
}

export type CreateEditLink = Omit<LinkProps, "archived">;
export type EditLink = Omit<CreateEditLink, "password">;
export type CreateLink = CreateEditLink;
