import { launchEvent, isResolved } from "@/content/facts";

export const runtime = "nodejs";
// The venue does not move. Cache hard at the edge so we make roughly one
// upstream request per deploy rather than one per visitor.
export const revalidate = 86_400;

/**
 * Serves a static map image of the venue.
 *
 * The image is fetched HERE, on the server, and streamed back. That is the
 * whole point: Google's Static Maps API wants the key in the image URL, so
 * putting the URL straight in an <img> would publish the key to every
 * visitor. Proxying keeps it server-side.
 *
 * We deliberately do NOT use the Maps JavaScript API. For one fixed venue it
 * ships a large bundle, hurts Core Web Vitals, and still exposes a key.
 *
 * With no key configured this returns 404 and the page simply shows the
 * address and a directions link, which is a perfectly good experience.
 */
export async function GET() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return new Response("Maps not configured", { status: 404 });

  if (!isResolved(launchEvent.venueName) || !isResolved(launchEvent.addressLine)) {
    return new Response("Venue not confirmed", { status: 404 });
  }

  const address = [
    launchEvent.addressLine,
    isResolved(launchEvent.postalCode) ? launchEvent.postalCode : null,
    isResolved(launchEvent.city) ? launchEvent.city : null,
  ]
    .filter(Boolean)
    .join(", ");

  const params = new URLSearchParams({
    center: address,
    zoom: "15",
    size: "640x360",
    scale: "2", // retina
    maptype: "roadmap",
    // Marker in the book's orange.
    markers: `color:0xfc9a2d|${address}`,
    key,
  });

  const upstream = await fetch(
    `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`,
    { next: { revalidate } },
  );

  if (!upstream.ok) {
    console.error(`[venue-map] Static Maps returned ${upstream.status}`);
    return new Response("Map unavailable", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
}
