import { $, set } from "./handleForm.js";

export function insertMap(lat, lng, elToInject, markersToInject) {
  const coords = { lat: parseFloat(lat), lng: parseFloat(lng) };

  const embedMap = new google.maps.Map($(elToInject), {
    zoom: 15,
    center: coords,
  });

  const markers = [];

  embedMap.addListener("click", e => {
    placeMarkerAndPanTo(e.latLng, embedMap);
    set("#lat", e.latLng.lat());
    set("#lng", e.latLng.lng());
  });

  function placeMarkerAndPanTo(latLng, map) {
    const newMarker = new google.maps.Marker({
      position: latLng,
      map: map,
    });

    const oldMarker = markers.shift();

    markers.push(newMarker);

    oldMarker.setMap(null);

    map.panTo(latLng);
  }

  markers.push(
    new google.maps.Marker({
      position: coords,
      map: embedMap,
      title: "novo marcador",
    })
  );

  return embedMap;
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      err => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

export function createCtoLink({ lat, lng }) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export async function getCityNameFromGeoLoc(lat, lng) {
  const apiKey = "AIzaSyD_NR_1sb5quUtRBp3nQF1fRhqbGcw-5VY";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${apiKey}`;

  try {
    const response = await fetch(url);

    const data = await response.json();

    return data;
  } catch (e) {
    console.error(e.message);
  }
}
