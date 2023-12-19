import { getCoordinates } from "@/lib/analytics";
import GlobeClient from "./client";
import logger from "@/lib/winston";

export default async function Globe() {
  let coordinates: {
    latitude: number;
    longitude: number;
  }[] = [];

  try {
    coordinates = await getCoordinates("24h");
  } catch (err) {
    logger.error(err);
  }

  const total = coordinates.length;
  const markers = coordinates.map(({ latitude, longitude }, idx) => {
    return {
      location: [latitude, longitude] as [number, number],
      size: Math.max((1 - idx / total) / 10, 0.01),
    };
  });
  return <GlobeClient markers={markers} />;
}
