import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

// name.official - полное имя страны
// capital - столица
// population - население
// flags.svg - ссылка на изображение флага
// languages - массив языков

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));

function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1';
  const URL = `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`;

  return fetch(URL).then(responce => {
    return responce.json();
  });
}

function searchCountries(evt) {
  evt.preventDefault();

  const inputData = refs.input.value.trim();

  fetchCountries(inputData)
    .then(renderCountryList)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearInput() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function renderCountryList(responceAPI) {
  console.dir(responceAPI);
  clearInput();

  if (responceAPI.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (responceAPI.length === 1) {
    refs.countryInfo.innerHTML = renderCountryInfo(responceAPI[0]);
  } else {
    const renderListCountry = responceAPI.map(country => renderCountriesList(country)).join('');
    refs.countryList.insertAdjacentHTML('beforeend', renderListCountry);
  }
}

function renderCountriesList({ flags, name }) {
  return `<li class="country-listInfo">
      <img class="country-flag" src="${flags.svg}"/>
      <h2 class="country-list-name">${name.official}</h2>
    </li>`;
}

function renderCountryInfo({ name, flags, capital, population, languages }) {
  return `<li class="country-main-info">
  <div class="wrapper-country-info">
    <img class="country-flag-info" src='${flags.svg}'/>
    <h2 class="country-list-name">${name.official}</h2>
  </div>
  <div class="country-secondary-info">
    <p><b>capital:</b> ${capital}</p>
    <p><b>population:</b> ${population}</p>
    <p><b>languages:</b> ${Object.values(languages)}</p>
  </div>
</li>`;
}
