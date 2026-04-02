import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the pune.csv file
const csvPath = path.join(__dirname, 'check', 'pune.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (skip header)
const lines = csvContent.split('\n');
const header = lines[0];
const dataLines = lines.slice(1);

const wardCentroids = [];

dataLines.forEach((line, index) => {
  if (!line.trim()) return;
  
  // Split by comma, but be careful with coordinates that contain commas
  const match = line.match(/qwr,(\d+)\.00000000000,#final_41wardboundary,"([^"]+)"/);
  
  if (match) {
    const wardNumber = parseInt(match[1]);
    const coordinateString = match[2];
    
    // Parse coordinates - format is "lng,lat lng,lat lng,lat..."
    const points = coordinateString.trim().split(' ').map(pair => {
      const [lng, lat] = pair.split(',').map(Number);
      return { lat, lng };
    });
    
    // Calculate centroid (average of all points)
    if (points.length > 0) {
      const centroid = points.reduce((acc, point) => {
        acc.lat += point.lat;
        acc.lng += point.lng;
        return acc;
      }, { lat: 0, lng: 0 });
      
      centroid.lat /= points.length;
      centroid.lng /= points.length;
      
      wardCentroids.push({
        wardNumber,
        lat: centroid.lat.toFixed(10),
        lng: centroid.lng.toFixed(10),
        pointCount: points.length
      });
      
      console.log(`Ward ${wardNumber}: Lat ${centroid.lat.toFixed(6)}, Lng ${centroid.lng.toFixed(6)} (${points.length} points)`);
    }
  }
});

// Sort by ward number
wardCentroids.sort((a, b) => a.wardNumber - b.wardNumber);

// Generate SQL file
let sqlContent = `-- Populate ward centroids for Pune Municipal Corporation
-- Generated from polygon coordinates in pune.csv
-- Centroids calculated as the average of all polygon boundary points

BEGIN;

`;

wardCentroids.forEach(ward => {
  sqlContent += `UPDATE wards SET centroid_lat = ${ward.lat}, centroid_lng = ${ward.lng} WHERE number = ${ward.wardNumber} AND city_id = (SELECT id FROM cities WHERE name = 'Pune');\n`;
});

sqlContent += `
COMMIT;

-- Verify the update
SELECT 
    w.number,
    w.name,
    w.centroid_lat,
    w.centroid_lng
FROM wards w
WHERE w.city_id = (SELECT id FROM cities WHERE name = 'Pune')
ORDER BY w.number;
`;

// Write SQL file
const sqlPath = path.join(__dirname, 'database', 'populate_pune_ward_centroids.sql');
fs.writeFileSync(sqlPath, sqlContent);

console.log('\n✓ Generated SQL file:', sqlPath);
console.log(`✓ Processed ${wardCentroids.length} wards`);
