import { ReactNode } from "react";
import { customAlphabet } from "nanoid";

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const uncapitalize = (str: string) =>
  str.charAt(0).toLowerCase() + str.slice(1);

export const pluralize = (count: number, noun: string, suffix = "s") =>
  `${Intl.NumberFormat("en-US").format(count)} ${noun}${
    count !== 1 ? suffix : ""
  }`;

export const pluralizeJSX = (
  func: (count: number, noun: string) => ReactNode,
  count: number,
  noun: string,
  suffix = "s"
) => {
  return func(count, `${noun}${count !== 1 ? suffix : ""}`);
};

export const nanoid = (size?: number) =>
  customAlphabet(
    // Numbers and english alphabet without lookalikes: 1, l, I, 0, O, o, u, v, 5, S, s, 2, Z.
    "346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz",
    size
  )();
