import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case "Очікує на виконавця":
      return "orange";
    case "В роботі":
      return "blue";
    case "Скасовано":
      return "red";
    default:
      return "gray";
  }
};

const getCustomIcon = (color, size = 22) => {
  return L.divIcon({
    html: `<div style="background-color:${color}; width:${size}px; height:${size}px; border-radius:50%; border:2px solid white; box-shadow:0 0 5px rgba(0,0,0,0.5);"></div>`,
    className: "",
    iconSize: [size, size],
  });
};

const generateOffset = (index) => {
  const angle = index * 45 * (Math.PI / 180);
  const radius = 0.004;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
};

const OrderMap = ({ orders }) => {
  const [locations, setLocations] = useState([]);
  const [zoom, setZoom] = useState(6);

  const MapZoomTracker = () => {
    useMapEvents({
      zoomend: (e) => setZoom(e.target.getZoom()),
    });
    return null;
  };

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const fetchCoords = async () => {
      const uniqueLocations = {};
      const geocodePromises = [];

      for (const order of orders) {
        const key = `${order.city},${order.region}`;

        if (!uniqueLocations[key]) {
          const promise = axios
            .get("http://localhost:8000/api/v1/geocode", {
              params: { city: order.city, region: order.region },
              headers: { "Cache-Control": "no-cache" },
            })
            .then((res) => {
              uniqueLocations[key] = {
                lat: parseFloat(res.data.lat),
                lon: parseFloat(res.data.lon),
                orders: [],
              };
            })
            .catch((err) => {
              console.error("❌ Геокодування не вдалося:", key);
            });

          geocodePromises.push(promise);
        }
      }

      await Promise.all(geocodePromises);

      for (const order of orders) {
        const key = `${order.city},${order.region}`;
        if (uniqueLocations[key]) {
          uniqueLocations[key].orders.push(order);
        }
      }

      const result = [];
      Object.values(uniqueLocations).forEach((group) => {
        group.orders.forEach((order, index) => {
          const offset = generateOffset(index);
          result.push({
            id: order.id,
            title: order.title,
            city: order.city,
            region: order.region,
            status: order.status,
            coords: [group.lat + offset[0], group.lon + offset[1]],
          });
        });
      });

      setLocations(result);
    };

    fetchCoords();
  }, [orders]);

  const markerSize = zoom >= 10 ? 26 : zoom >= 8 ? 22 : 18;

  return (
    <MapContainer
      center={[49.0, 32.0]}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "10px",
        marginTop: "20px",
      }}
    >
      <MapZoomTracker />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={loc.coords}
          icon={getCustomIcon(getStatusColor(loc.status), markerSize)}
        >
          <Popup>
            <Box>
              <Text fontWeight="bold" mb={1}>
                {loc.title}
              </Text>
              <Text fontSize="sm">
                📍 {loc.city}, {loc.region}
              </Text>
              <Text fontSize="sm">🛠 Статус: {loc.status}</Text>
              <Link
                to={`/requests/${loc.id}`}
                style={{ color: "#2B6CB0", fontWeight: 600 }}
              >
                🔍 Переглянути
              </Link>
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default OrderMap;
