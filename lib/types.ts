export interface ParsedURL {
  domain: string;
  path: string;
  fullPath: string;
  key: string;
  route: string;
}

export type GeoObject = {
  [country: string]: string;
};

export interface Link {
  url: string;
  archived: boolean;
  password?: string;
  expiresAt?: Date;
  ios?: string;
  android?: string;
  geo?: GeoObject;
}

export interface CreateLink {
  domain: string;
  key: string;
  url: string;
  password?: string;
  expiresAt?: string;
  ios?: string;
  android?: string;
  geo?: GeoObject;
}

export interface DeleteLink {
  domain: string;
  key: string;
}
