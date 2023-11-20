class WeatherWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.createWidget();
    this.setupEvent();
    this.weather = {};
    this.myMap = null;
  }

  createWidget() {
    this.container.innerHTML = `
    <div class='container'>
      <form id="geoInfo">
        <div>
          <label>Широта</label>
          <input type="text" id="breadth" name="breadth" required />
        </div>
        <div>
          <label>Долгота</label>
          <input type="text" id="longitude" name="longitude" required />
        </div>
        <button type="submit" class="wheather_show" id="showData">
          Показать погоду
        </button>
      </form>
        <div class="wheather_info_description">
          <p id="temp"></p>
          <p id="title_wheather"></p>
          <img id="icon_wheather" />
          <p id='wind'></p>
          <p id='feelslike'></p>
          <p id='humidity'></p>
        </div>
        <div id="map" style="width: 400px; height: 300px; margin: 20px;"></div>
      </div>
    `;
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const breadth = this.container.querySelector("#breadth").value;
    const longitude = this.container.querySelector("#longitude").value;
    const reg = /^-?((180(\.0{1,6})?)|((1[0-7]\d)|(\d{1,2}))(\.\d{1,6})?)$/;
    if (reg.test(breadth) && reg.test(longitude)) {
      this.getDataWheather(breadth, longitude);
    } else {
      alert(
        "Неккоректные данные. Пример корректных данных: широта: 55.7522, долгота: 37.6256"
      );
    }
  }

  setupEvent() {
    const form = this.container.querySelector("#geoInfo");
    form.addEventListener("submit", (event) => this.handleFormSubmit(event));
  }

  async getDataWheather(
    breadth,
    longitude,
    url = `https://api.weatherapi.com/v1/current.json?key=6e45396b737a411cb50150133231211&q=${breadth},${longitude}&lang=ru`
  ) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      this.weather = data;
      this.update();
      this.init(breadth, longitude);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  update() {
    this.container.querySelector("#temp").textContent = `${Math.round(
      this.weather.current.temp_c
    )}\u2103`;
    this.container.querySelector("#title_wheather").textContent =
      this.weather.current.condition.text;
    this.container.querySelector("#icon_wheather").style.display = "block";
    this.container.querySelector("#icon_wheather").src =
      this.weather.current.condition.icon;
    this.container.querySelector(
      "#feelslike"
    ).textContent = `Ощущается как ${Math.round(
      this.weather.current.feelslike_c
    )}\u2103`;
    this.container.querySelector(
      "#wind"
    ).textContent = `Скорость ветра: \n ${this.weather.current.wind_mph}м/с`;
    this.container.querySelector(
      "#humidity"
    ).textContent = `Влажность: ${this.weather.current.humidity}%`;
  }

  init(breadth, longitude) {
    if (!this.myMap) {
      this.myMap = new ymaps.Map("map", {
        center: [breadth, longitude],
        zoom: 9,
      });
    }
    this.myMap.setCenter([breadth, longitude]);
  }
}
const widgets = [new WeatherWidget("weather1")];
const addWidget = document.getElementById("add");
addWidget.addEventListener("click", () => {
  widgets.push(new WeatherWidget("weather2"));
  if (widgets.length === 2) {
    addWidget.style.display = "none";
  }
});
