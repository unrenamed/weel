import { getCoordinates } from "@/lib/analytics";
import GlobeClient from "./client";

export default async function Globe() {
  const coordinates = await getCoordinates("24h");
  const total = coordinates.length;
  const markers = coordinates.map(({ latitude, longitude }, idx) => {
    return {
      location: [latitude, longitude] as [number, number],
      size: Math.max((1 - idx / total) / 10, 0.01),
    };
  });
  return <GlobeClient markers={markers} />;
}
