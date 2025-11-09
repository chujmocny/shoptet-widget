const API_KEY = process.env.SEZNAM_KEY;
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { address } = req.body;
    if(!address) return res.status(400).json({ error: "Zadejte adresu." });

    const API_KEY = process.env.SEZNAM_KEY;
    if(!API_KEY) return res.status(500).json({ error: "Server nemá nastavený SEZNAM_KEY" });

    const geoRes = await fetch(`https://api.mapy.cz/geocode?query=${encodeURIComponent(address)}&apikey=${API_KEY}`);
    const geoData = await geoRes.json();
    if(!geoData?.results?.[0]) return res.status(400).json({ error: "Adresa nenalezena" });

    const dest = geoData.results[0].position;

    const start = { lat: 49.8206, lon: 18.2382 };

    const routeRes = await fetch(`https://api.mapy.cz/route?start=${start.lat},${start.lon}&end=${dest.y},${dest.x}&apikey=${API_KEY}`);
    const routeData = await routeRes.json();
    if(!routeData?.features?.[0]?.properties?.distance) return res.status(500).json({ error: "Chyba při výpočtu trasy" });

    const distanceKm = routeData.features[0].properties.distance / 1000;
    const price = Math.max(Math.round(distanceKm * 7), 50);

    res.status(200).json({ distance_km: Number(distanceKm.toFixed(2)), price });

  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
