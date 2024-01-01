export interface SWRError extends Error {
  status: number;
  info: string;
}
