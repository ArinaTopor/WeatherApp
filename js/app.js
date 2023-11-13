const titleWheather = document.getElementById("title_wheather");
const temp = document.getElementById("temp");
const icon = document.getElementById("icon_wheather");
const applicantForm = document.getElementById("geoInfo");
const wheather = {
  temp: 0,
  condition: "",
  temp_feelslike: 0,
  wind_mph: 0,
  humidity: 0,
};
let myMap;

function getFormData(formData) {
  return new FormData(formData);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const data = getFormData(applicantForm);
  getDataWheather(data.get("breadth"), data.get("longitude"));
}

applicantForm.addEventListener("submit", handleFormSubmit);

async function getDataWheather(
  breadth,
  longitude,
  url = `http://api.weatherapi.com/v1/current.json?key=6e45396b737a411cb50150133231211&q=${breadth},${longitude}&lang=ru`
) {
  const responce = await fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      wheather.temp = data.current.temp_c;
      wheather.condition = data.current.condition;
      wheather.temp_feelslike = data.current.feelslike_c;
      wheather.humidity = data.current.humidity;
      wheather.wind_mph = data.current.wind_mph;
      update();
      ymaps.ready(init(breadth, longitude));
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function update() {
  temp.textContent = `${wheather.temp}\u2103`;
  titleWheather.textContent = wheather.condition.text;
  icon.src = wheather.condition.icon;
}

function init(breadth, longitude) {
  if (!myMap) {
    myMap = new ymaps.Map("map", {
      center: [breadth, longitude],
      zoom: 9,
    });
  }
  myMap.setCenter([breadth, longitude]);
}
