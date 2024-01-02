export const getUnixTimeSeconds = (timestamp: string | null) => {
  return timestamp ? new Date(timestamp).getTime() / 1000 : null;
};

export const cutMillisOff = (timestamp: string | null) => {
  return timestamp ? timestamp.substring(0, 17) + "00.000Z" : null;
};
