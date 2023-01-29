import { $ } from "./handleForm.js";

export function insertMap(lat, lng, name) {
  const coords = { lat: parseFloat(lat), lng: parseFloat(lng) };

  const embedMap = new google.maps.Map($("#embedMap"), {
    zoom: 15,
    center: coords
  });

  return new google.maps.Marker({
    position: coords,
    map: embedMap,
    title: name
  });
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(pos => resolve(pos.coords), err => reject(err), {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    })
  });
}

export function createCtoLink({ lat, lng }) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
