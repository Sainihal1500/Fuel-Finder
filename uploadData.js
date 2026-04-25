const admin = require('firebase-admin');
const fs = require('fs');

// IMPORTANT: You need to download your Firebase Service Account Key JSON
// and place it in this directory as 'serviceAccountKey.json'
// Link: Project Settings -> Service Accounts -> Generate New Private Key

try {
    const serviceAccount = require('./serviceAccountKey.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();

    async function uploadData() {
        const rawData = fs.readFileSync('data.geojson', 'utf-8');
        const data = JSON.parse(rawData);
        const features = data.features;

        console.log(`Starting upload of ${features.length} stations to Firestore...`);

        let batch = db.batch();
        let count = 0;

        for (const feature of features) {
            // Document ID can be the OSM way ID if available, or auto-generated
            const docRef = db.collection('stations').doc();

            // Clean up the feature to store cleanly
            const coords = feature.geometry.coordinates;

            const stationData = {
                name: feature.properties.name || "Petrol Pump",
                lat: coords[1],   // latitude
                lng: coords[0],   // longitude
                open: true,
                toilet: false,
                food: false,
                ev: false
            };

            batch.set(docRef, stationData);
            count++;

            // Firestore batches allow max 500 writes
            if (count === 500) {
                await batch.commit();
                console.log('Committed 500 records...');
                batch = db.batch();
                count = 0;
            }
        }

        if (count > 0) {
            await batch.commit();
            console.log(`Committed remaining ${count} records.`);
        }

        console.log('Successfully uploaded all data to Firestore!');
        process.exit(0);
    }

    uploadData().catch(console.error);

} catch (e) {
    console.error('Error: You must create a serviceAccountKey.json file in this folder to authenticate.');
    console.log('1. Go to Firebase Console -> Project Settings -> Service Accounts');
    console.log('2. Click "Generate New Private Key"');
    console.log('3. Save the downloaded file exactly as "serviceAccountKey.json" in this directory.');
    process.exit(1);
}
