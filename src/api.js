export const CONF_API_KEY = "AIzaSyAtbHC8Vnf_OVoBngKcnnTfnPwS7kVQUvM";

export const searchGooglePlaces = async (lat, long, radius, query) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&key=${CONF_API_KEY}`;
    console.log(url);
    const response = await fetch(url);
    const json = await response.json();
    return makeGoodData(json.results);
  } catch (error) {
    return {msg:error.message, customError: true}
  }
};

const makeGoodData = (results) => {
    let realResults = results.map((item) => (
     {
      name: item.name,
      id: item.id,
      vicinity: item.vicinity,
      rating: item.rating,
      icon: item.icon,
      geometry: item.geometry,
      photos: item.photos,
     }
    ))
    return realResults;
  };