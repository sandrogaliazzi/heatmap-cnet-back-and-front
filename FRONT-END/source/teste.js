async function getCityNameFromGeoLoc(lat, lng) {
  const apiKey = "AIzaSyD_NR_1sb5quUtRBp3nQF1fRhqbGcw-5VY";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${apiKey}`;

  try {
    const response = await fetch(url);

    const data = await response.json();

    return data.results[0]["address_components"][3].long_name;
  } catch (e) {
    console.error(e.message);
  }
}

getCityNameFromGeoLoc("-29.58576358380055", "-50.8956005852099").then(
  console.log
);
