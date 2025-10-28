import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';



function getIconByMagnitude(mag) {
    let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
    if (mag > 5.0) iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
    else if (mag > 3.0) iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';

    return new L.Icon({
        iconUrl,
        iconSize: [30, 45],
        iconAnchor: [15, 45],
        popupAnchor: [0, -45],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [13, 41]
    });
}

function MapView() {
    const [earthquakes, setEarthquakes] = useState([]);
    const [minMagnitude, setMinMagnitude] = useState(0); // Slider value
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
            .then(res => res.json())
            .then(data => {
                const quakes = data.features.map(eq => ({
                    id: eq.id,
                    place: eq.properties.place,
                    mag: eq.properties.mag,
                    time: new Date(eq.properties.time).toLocaleString(),
                    coords: [eq.geometry.coordinates[1], eq.geometry.coordinates[0]],
                }));
                setEarthquakes(quakes);
                setLoading(false); // ✅ Done loading
            })
            .catch(err => {
                console.error('Error fetching data', err);
                setLoading(false);
                setEarthquakes([]); // Clear data
            });
    }, []);

    const filteredQuakes = earthquakes.filter(eq => eq.mag >= minMagnitude);

    if (loading) {
        return <div className="spinner">Loading earthquake data...</div>;
    }

        return (

            <div>
                <div className="slider-container">
                    <label htmlFor="magnitude-slider">
                        <strong>Minimum Magnitude: {minMagnitude}</strong>
                    </label>
                    <input
                        id="magnitude-slider"
                        type="range"
                        min="0"
                        max="8"
                        step="0.1"
                        value={minMagnitude}
                        onChange={e => setMinMagnitude(parseFloat(e.target.value))}
                    />
                    {filteredQuakes.length === 0 && !loading && (
                        <span className="no-results">No earthquakes match this magnitude.</span>
                    )}
                </div>
                <div className="legend">
                    <span><img
                        src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"
                        alt="green"/> ≤ 3.0  </span>
                    <span><img
                        src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png"
                        alt="orange"/> 3.1 – 5.0  </span>
                    <span><img
                        src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
                        alt="red"/> > 5.0  </span>
                </div>

                <MapContainer center={[20, 0]} zoom={2} style={{height: '80vh', width: '100%'}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    {filteredQuakes.map(eq => (
                        <Marker key={eq.id} position={eq.coords} icon={getIconByMagnitude(eq.mag)}>
                            <Popup>
                                <strong>{eq.place}</strong><br/>
                                Magnitude: {eq.mag}<br/>
                                Time: {eq.time}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>


            </div>
        );

}

export default MapView;