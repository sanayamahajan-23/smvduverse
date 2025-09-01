import * as turf from "@turf/turf";

export function getDistanceAndTime(start, end, speed = 5) {
  const from = turf.point(start);
  const to = turf.point(end);
  const options = { units: "kilometers" };

  const distance = turf.distance(from, to, options);
  const time = (distance / speed) * 60; // in minutes
  return { distance, time };
}
