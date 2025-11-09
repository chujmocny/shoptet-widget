document.addEventListener("DOMContentLoaded", function() {
    const tlacitko = document.getElementById('spocitat-dopravu');
    if(!tlacitko) return;

    const cenyDopravy = {
        "11000": 120, // Praha 1
        "12000": 130, // Praha 2
        "15000": 150, // Praha 5
        "Ostrava": 100,
        "Brno": 140
        // přidej další PSČ nebo města podle potřeby
    };

    tlacitko.addEventListener('click', function() {
        const adresa = document.getElementById('adresa').value.trim();
        let cena = null;

        // Nejprve hledáme podle přesného PSČ
        for(const key in cenyDopravy){
            if(adresa.includes(key) || adresa.toLowerCase().includes(key.toLowerCase())){
                cena = cenyDopravy[key];
                break;
            }
        }

        if(cena === null){
            cena = 200; // výchozí cena, pokud adresa není v mapě
        }

        document.getElementById('cena-dopravy').innerText = 'Cena dopravy: ' + cena + ' Kč';
    });
});
