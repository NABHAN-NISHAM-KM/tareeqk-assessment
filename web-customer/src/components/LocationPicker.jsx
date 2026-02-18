import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationPicker({ onLocationSelect }) {
  const [marker, setMarker] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker({ lat, lng });
        // Reverse geocode using Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => {
            onLocationSelect({
              address: data.display_name,
              latitude: lat,
              longitude: lng,
            });
          })
          .catch(() => {
            onLocationSelect({ address: '', latitude: lat, longitude: lng });
          });
      },
    });
    return marker ? <Marker position={marker} /> : null;
  }

  return (
    <MapContainer
      center={[24.7136, 46.6753]}
      zoom={12}
      style={{ height: 300, borderRadius: 12 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
}

export default LocationPicker;
