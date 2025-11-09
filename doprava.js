document.addEventListener("DOMContentLoaded", function() {
    const tlacitko = document.getElementById('spocitat-dopravu');
    const vysledek = document.getElementById('cena-dopravy');

    const prodejna = { lat: 49.8206, lon: 18.2382 }; // Výškovická 3086/44, Ostrava-jih
    const apiKey = "TVŮJ_OPENROUTESERVICE_API_KEY"; // vlož svůj API klíč

    tlacitko.addEventListener('click', function() {
        const adresa = document.getElementById('adresa').value.trim();
        if(!adresa){
            vysledek.innerText = 'Zadejte adresu.';
            return;
        }

        // 1️⃣ Geokódování adresy pomocí Nominatim (OpenStreetMap)
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresa)}`)
        .then(response => response.json())
        .then(data => {
            if(data.length === 0){
                vysledek.innerText = 'Adresa nenalezena.';
                return;
            }

            const dest = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };

            // 2️⃣ Výpočet vzdálenosti po silnicích pomocí OpenRouteService
            fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
                method: "POST",
                headers: {
                    "Authorization": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    coordinates: [
                        [prodejna.lon, prodejna.lat],
                        [dest.lon, dest.lat]
                    ]
                })
            })
            .then(res => res.json())
            .then(routeData => {
                const distanceMeters = routeData.features[0].properties.segments[0].distance;
                const distanceKm = distanceMeters / 1000;
                const cena = Math.round(distanceKm * 7); // 7 Kč za km

                vysledek.innerText = `Cena dopravy: ${cena} Kč (vzdálenost: ${distanceKm.toFixed(1)} km)`;
            })
            .catch(err => {
                console.error(err);
                vysledek.innerText = 'Chyba při výpočtu trasy.';
            });
        })
        .catch(err => {
            console.error(err);
            vysledek.innerText = 'Chyba při geokódování adresy.';
        });
    });
});

