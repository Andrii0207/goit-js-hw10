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
    if (!responce.ok) {
      throw new Error();
    }
    console.log(responce);
    return responce.json();
  });
}

function searchCountries(evt) {
  evt.preventDefault();

  const inputData = refs.input.value.trim();

  fetchCountries(inputData).then(renderCountryList);
  // .catch(Notiflix.Notify.failure('Oops, there is no country with that name'));
}

function clearInput() {
  refs.countryInfo.value = '';
  refs.countryList.value = '';
}

function renderCountryList(responceAPI) {
  console.dir(responceAPI);

  if (responceAPI.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (responceAPI.length === 1) {
    console.log(responceAPI);
  } else {
    const renderListCountry = responceAPI.map(country => renderCountriesList(country));
    refs.countryList.insertAdjacentHTML('beforeend', renderListCountry);
  }
}

function renderCountriesList({ flags, name }) {
  return `<li>
      <img class="flag-country-list" src="${flags.svg}">
      <p class="country-list-name">${name.official}</p>
    </li>`;
}
