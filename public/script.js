// ======= APP STATE =======
const filters = { '247': false, 'toilets': false, 'food': false, 'ev': false };
let geojsonLayer;
let allFeatures = [];
let userLocation = null;
let userMarker = null;
let routingControl = null;

// Mock database for reviews & dynamic additions
let customPumps = [];
let pumpReviews = {}; // docId -> { rating, count, reviews }
let activePopupStation = null;
let clickedLatLng = null;

// Map Themes (Dark by default)
const mapThemes = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
};
let currentTheme = 'dark';
let tileLayer;

// ======= INITIALIZATION =======
const map = L.map('map', { zoomControl: false }).setView([17.43, 78.48], 11);
tileLayer = L.tileLayer(mapThemes[currentTheme], {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd', maxZoom: 20
}).addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    if(document.body.classList.contains('light-theme')) {
        document.body.classList.remove('light-theme');
        currentTheme = 'dark';
    } else {
        document.body.classList.add('light-theme');
        currentTheme = 'light';
    }
    tileLayer.setUrl(mapThemes[currentTheme]);
});

// Load GeoJSON Data
fetch('data.geojson')
    .then(r => r.json())
    .then(data => {
        // Mock a unique ID for each feature if not present
        allFeatures = data.features.map((f, i) => {
            if(!f.properties.id) f.properties.id = 'pump_' + i;
            return f;
        });
        renderMap();
    })
    .catch(console.error);

// ======= UTILITIES =======
function passesFilters(feature) {
    const props = feature.properties || {};
    if (filters['247']) {
        const oh = (props.opening_hours || "").toLowerCase();
        if (oh !== '24/7') return false;
    }
    if (filters['toilets'] && props.toilets !== 'yes') return false;
    if (filters['food'] && props.food !== 'yes') return false;
    if (filters['ev'] && props['fuel:electricity'] !== 'yes') return false;
    return true;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295; const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a));
}

// ======= POPUPS & UI =======
window.openModal = function(id) {
    document.getElementById(id).classList.remove('hidden');
};

window.closeModal = function(id) {
    document.getElementById(id).classList.add('hidden');
};

document.getElementById('pro-badge').addEventListener('click', () => openModal('pro-modal'));

function createPopupContent(feature, distanceKm = null) {
    const props = feature.properties || {};
    const name = props.name || "Highway Fuel Station";
    const stId = props.id;
    
    // Check mock ratings
    let ratingHtml = '';
    if (pumpReviews[stId]) {
        const r = pumpReviews[stId];
        ratingHtml = `<div class="rating-badge">★ ${(r.rating / r.count).toFixed(1)} (${r.count} reviews)</div>`;
    } else {
        ratingHtml = `<div class="rating-badge" style="color:var(--text-muted);">No reviews yet</div>`;
    }

    const is247 = (props.opening_hours || "").toLowerCase() === '24/7';
    const hasToilets = props.toilets === 'yes';
    const hasFood = props.food === 'yes';
    const hasEv = props['fuel:electricity'] === 'yes';

    const coords = feature.geometry.coordinates; // [lng, lat]
    const lat = coords[1], lng = coords[0];

    let distHtml = distanceKm !== null ? `<div class="distance-badge">📍 ${distanceKm.toFixed(1)} km away</div>` : '';

    return `
        <div class="premium-popup">
            <h3>${name}</h3>
            ${ratingHtml}
            ${distHtml}
            
            <div class="popup-amenity-grid">
                <div class="amenity-item ${is247 ? 'active' : ''}"><span>⏰</span> 24/7</div>
                <div class="amenity-item ${hasToilets ? 'active' : ''}"><span>🚻</span> Toilets</div>
                <div class="amenity-item ${hasFood ? 'active' : ''}"><span>🍔</span> Food</div>
                <div class="amenity-item ${hasEv ? 'active' : ''}"><span>⚡</span> EV Charging</div>
            </div>

            <button class="navigate-btn" onclick="startRoutingTo(${lat}, ${lng})">🚀 Route on Map</button>
            <button class="navigate-btn secondary-action" onclick="openFeedback('${stId}', '${name.replace(/'/g, "\\'")}')">⭐ Rate / Report</button>
        </div>
    `;
}

window.startRoutingTo = function(destLat, destLng) {
    if (!userLocation) {
        alert("Please set your location first using the Locate tool or Manual Search.");
        return;
    }
    if (routingControl) map.removeControl(routingControl);

    routingControl = L.Routing.control({
        waypoints: [ L.latLng(userLocation.lat, userLocation.lng), L.latLng(destLat, destLng) ],
        routeWhileDragging: false, addWaypoints: false, fitSelectedRoutes: true, showAlternatives: true,
        lineOptions: { styles: [{color: '#ec4899', opacity: 0.8, weight: 6}] }
    }).addTo(map);
    map.closePopup();
};

window.openFeedback = function(stationId, stationName) {
    activePopupStation = stationId;
    document.getElementById('feedback-title').textContent = "Rate: " + stationName;
    document.getElementById('feedback-text').value = '';
    document.querySelectorAll('.star-rating span').forEach(s => s.classList.remove('active'));
    openModal('feedback-modal');
    map.closePopup();
};

// ======= RENDERING =======
function renderMap() {
    if (geojsonLayer) map.removeLayer(geojsonLayer);

    const combinedFeatures = [...allFeatures, ...customPumps];
    const filteredFeatures = combinedFeatures.filter(passesFilters);
    document.getElementById('pump-count').textContent = filteredFeatures.length;

    const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
            background: linear-gradient(135deg, #ec4899, #f43f5e);
            width: 32px; height: 32px; border-radius: 50%;
            border: 3px solid rgba(255,255,255,0.9);
            box-shadow: 0 4px 12px rgba(236,72,153,0.6);
            display: flex; align-items: center; justify-content: center; font-size: 14px;
        ">⛽</div>`,
        iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16]
    });

    geojsonLayer = L.geoJSON({
        type: "FeatureCollection", features: filteredFeatures
    }, {
        pointToLayer: (feature, latlng) => L.marker(latlng, { icon: customIcon }),
        onEachFeature: (feature, layer) => {
            let d = null;
            if (userLocation) {
                const lat = feature.geometry.coordinates[1];
                const lng = feature.geometry.coordinates[0];
                d = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
            }
            layer.bindPopup(createPopupContent(feature, d));
        }
    }).addTo(map);
}

// ======= INTERACTIONS & FILTERS =======
document.querySelectorAll('.chip[data-filter]').forEach(button => {
    button.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const filterType = btn.getAttribute('data-filter');
        btn.classList.toggle('active');
        filters[filterType] = btn.classList.contains('active');
        renderMap();
    });
});

// ======= ADD PUMP FEATURE =======
map.on('contextmenu', function(e) {
    clickedLatLng = e.latlng;
    document.getElementById('new-pump-name').value = '';
    document.querySelectorAll('#new-pump-amenities .chip').forEach(c => c.classList.remove('active'));
    openModal('add-pump-modal');
});

// Toggle chips in Add Pump Modal
document.querySelectorAll('#new-pump-amenities .chip').forEach(button => {
    button.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('active');
    });
});

document.getElementById('submit-new-pump').addEventListener('click', () => {
    const name = document.getElementById('new-pump-name').value || 'New User Station';
    const is247 = document.querySelector('#new-pump-amenities [data-toggle="247"]').classList.contains('active');
    const isToilets = document.querySelector('#new-pump-amenities [data-toggle="toilets"]').classList.contains('active');
    const isFood = document.querySelector('#new-pump-amenities [data-toggle="food"]').classList.contains('active');
    const isEv = document.querySelector('#new-pump-amenities [data-toggle="ev"]').classList.contains('active');

    const newFeature = {
        type: "Feature",
        properties: {
            id: 'custom_' + Date.now(),
            name: name,
            opening_hours: is247 ? '24/7' : '',
            toilets: isToilets ? 'yes' : 'no',
            food: isFood ? 'yes' : 'no',
            'fuel:electricity': isEv ? 'yes' : 'no'
        },
        geometry: {
            type: "Point",
            coordinates: [clickedLatLng.lng, clickedLatLng.lat]
        }
    };

    customPumps.push(newFeature);
    closeModal('add-pump-modal');
    renderMap();
    
    // Suggest PRO to save permanently
    setTimeout(() => openModal('pro-modal'), 1000);
});

// ======= FEEDBACK & REPORTING =======
let activeStar = 0;
document.querySelectorAll('.star-rating span').forEach(star => {
    star.addEventListener('click', (e) => {
        activeStar = parseInt(e.target.getAttribute('data-val'));
        document.querySelectorAll('.star-rating span').forEach(s => {
            s.classList.toggle('active', parseInt(s.getAttribute('data-val')) <= activeStar);
        });
    });
});

document.getElementById('submit-feedback').addEventListener('click', () => {
    if (activeStar === 0) return alert("Please select a star rating!");
    if (!pumpReviews[activePopupStation]) {
        pumpReviews[activePopupStation] = { rating: 0, count: 0 };
    }
    pumpReviews[activePopupStation].rating += activeStar;
    pumpReviews[activePopupStation].count += 1;
    
    closeModal('feedback-modal');
    renderMap();
    alert("Thanks for your review! It will be visible to others soon.");
});

document.getElementById('report-pump').addEventListener('click', () => {
    if (confirm("Are you sure this station is permanently closed or does not exist?")) {
        // Remove from allFeatures / customPumps
        allFeatures = allFeatures.filter(f => f.properties.id !== activePopupStation);
        customPumps = customPumps.filter(f => f.properties.id !== activePopupStation);
        closeModal('feedback-modal');
        renderMap();
        alert("Station reported and removed from your map. Our AI moderators will review this.");
    }
});

// ======= GEOLOCATION / ROUTING CORE =======
const statusText = document.getElementById('location-status');

document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('address-input').value;
    if(!query) return;
    statusText.textContent = "Geocoding...";
    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                updateUserLocation(data[0].lat, data[0].lon);
                statusText.textContent = "Location found!";
            } else {
                statusText.textContent = "Address not found.";
            }
        });
});

document.getElementById('locate-btn').addEventListener('click', () => {
    statusText.textContent = "Acquiring GPS Signal...";
    map.locate({setView: false, maxZoom: 14, enableHighAccuracy: true});
});

map.on('locationfound', function(e) { updateUserLocation(e.latlng.lat, e.latlng.lng); });
map.on('locationerror', function(e) { statusText.textContent = "Location failed. Type address above."; });

function updateUserLocation(lat, lng) {
    userLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
    if (userMarker) userMarker.setLatLng(userLocation);
    else {
        const userIcon = L.divIcon({ className: 'user-anim-icon', html: `<div class="user-locator-ring"></div>`, iconSize: [20, 20], iconAnchor: [10, 10] });
        userMarker = L.marker(userLocation, {icon: userIcon, zIndexOffset: 1000}).addTo(map);
    }
    renderMap();
    findNearestPump();
}

function findNearestPump() {
    const filteredFeatures = [...allFeatures, ...customPumps].filter(passesFilters);
    if (!filteredFeatures.length) { statusText.textContent = "No match nearby."; return; }
    
    let nearest = null, shortest = Infinity;
    filteredFeatures.forEach(f => {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, f.geometry.coordinates[1], f.geometry.coordinates[0]);
        if (dist < shortest) { shortest = dist; nearest = f; }
    });
    
    if (nearest) {
        statusText.innerHTML = `Nearest station found <strong>${shortest.toFixed(1)} km</strong> away.`;
        map.fitBounds(L.latLngBounds([[userLocation.lat, userLocation.lng], [nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]]]), { padding: [80, 80], maxZoom: 15 });
        window.startRoutingTo(nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]);
    }
}
