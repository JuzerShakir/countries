"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

///////////////////////////////////////
// ? Using XML data format
/*
const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.com/v2/name/${country}`);
  request.send();

  request.addEventListener("load", function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    const html = `
    <article class="country">
    <img class="country__img" src=${data.flag} />
    <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          data.population / 1000000
        ).toFixed(2)} people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
    </div>
    </article>
    `;
    countriesContainer.insertAdjacentHTML("beforeend", html);
    countriesContainer.style.opacity = 1
  });
};

getCountryData("Oman");
getCountryData("usa");
getCountryData("germany");
*/

//////////////////////////////////////////////
// ? Using Promises with Fetch, Geolocation, Rest Countries API

// * Renders the data of the country in the browser
const renderCountry = function (data, className = "") {
  const html = `
  <article class="country ${className}" >
  <img class="country__img" src=${data.flag} />
  <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        data.population / 1000000
      ).toFixed(2)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
  </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML("beforeend", html);
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
};

// * Fetches the data from the API of a particular country using its country code
// * with then and catch method
// const getCountryData = function (code) {
//   fetch(`https://restcountries.com/v2/alpha/${code}`)
//     .then((response) => {
//       if (!response.ok) {
//         renderError(`Country Not Found!`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       renderCountry(data);
//       const neighbour = data.borders?.[0];
//       if (!neighbour) return;
//       return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
//     })
//     .then((response) => {
//       if (!response) {
//         renderError("This country has no Neighbouring countries!");
//       }
//       return response.json();
//     })
//     .then((data) => renderCountry(data, "neighbour"))
//     .catch((err) => "")
//     .finally(() => (countriesContainer.style.opacity = 1));
// };
// getCountryData("in");
// * with async/await

const getCountry = async function (lat, lng) {
  try {
    // Geolocation API, using reverse geocoding
    const usrLct = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);

    if (!usrLct.ok) throw new Error("Problem getting Geo-location data");

    const usrLctJSON = await usrLct.json();

    // Countries API
    const countryData = await fetch(
      `https://restcountries.com/v2/name/${usrLctJSON.country}`
    );

    if (!countryData.ok) throw new Error("Problem getting Country data");

    const countryDataJSON = await countryData.json();
    renderCountry(countryDataJSON[0]);
  } catch (err) {
    console.error(err);
    renderError(err);
  }
};

const getUserLocation = function () {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  )
    .then((response) => {
      const { latitude: lat, longitude: lng } = response.coords;
      getCountry(lat, lng);
    })
    .catch((err) => {
      console.error(err.message);
      renderError(err.message);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};

getUserLocation();

////////////////////////////////////////////////////////
// ! Coding Challenge #3
// const imgContainer = document.querySelector(".images");

// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

// const createImage = function (imgPath) {
//   return new Promise(function (resolve, reject) {
//     const img = document.createElement("img");
//     img.src = imgPath;

//     img.addEventListener("load", function () {
//       imgContainer.append(img);
//       resolve(img);
//     });

//     img.addEventListener("error", function () {
//       reject(new Error("Image not found"));
//     });
//   });
// };

// const loadNPause = async function () {
//   try {
//     let img = await createImage("img/img-1.jpg");
//     await wait(2);
//     img.style.display = "none";

//     img = await createImage("img/img-2.jpg");
//     await wait(2);
//     img.style.display = "none";
//   } catch (err) {
//     console.error(err);
//   }
// };
// loadNPause();

// const loadAll = async function (imgArr) {
//   const imgs = imgArr.map((img) => createImage(img));
//   // console.log(imgs);
//   const responses = await Promise.all(imgs);
//   // console.log(responses);

//   responses.forEach((img) => img.classList.add("parallel"));
// };

// loadAll(["img/img-1.jpg", "img/img-2.jpg", "img/img-3.jpg"]);
