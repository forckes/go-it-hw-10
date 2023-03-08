import "./css/common.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import debounce from "lodash.debounce";
import API from "./fetchCountries";

const DEBOUNCE_DELAY = 300;
const refs = {
	input: document.querySelector(".search__input"),
	countryList: document.querySelector(".search__country-list"),
	countryPage: document.querySelector(".search__country")
};
const debouncedInput = debounce(onFormInput, DEBOUNCE_DELAY);

//
refs.input.addEventListener("input", debouncedInput);
//

//functions
function onLoadCountry() {}

function onFormInput(e) {
	const request = e.target.value;
	if (request) {
		API.fetchCountries(request)
			.then(countryList => {
				checkCountry(countryList);
			})
			.catch(error => {
				showError(error);
			});
	} else {
		clearContent();
	}
}
function showCountriesList(countryList) {
	refs.countryList.innerHTML = countryList
		.map(
			country =>
				`
		<li class="country-list__item">
			<img width="42" src="${country.flags.svg}" alt='' class="country-list__img"> 
			<p class="country-list__name">${country.name.common}</p>
		</li>`
		)
		.join("");
}
function showCountryPage(country) {
	const { capital, population, languages, flags } = country;
	const languagesList = Object.values(languages).join(", ");

	refs.countryPage.innerHTML = `
	<div class="country__top">
		<h1 class="country__title">${country.name.common}</h1>
		<img src="${flags.svg}" width="100" alt="" class="country__img">
	</div>
	<div class="country__info">
		<p class="country__capital"><span>Capital: </span>${capital}</p>
		<p class="country__population"><span>Population: </span>${population}</p>
		<p class="country__languages"><span>Languages: </span>${languagesList}</p>
	</div>`;
}
function checkCountry(countryList) {
	const length = countryList.length;
	clearContent();

	if (length === 1) {
		showCountryPage(countryList[0]);
		return;
	}

	if (length > 1 && length < 10) {
		showCountriesList(countryList);
		return;
	}
	Notify.info("Too many matches found. Please enter a more specific name.");
}
function showError(error) {
	clearContent();
	if (error.message === "404") {
		Notify.failure("Oops, there is no country with that name");
	}
}
function clearContent() {
	if (refs.countryList.innerHTML) {
		refs.countryList.innerHTML = "";
	}
	if (refs.countryPage.innerHTML) {
		refs.countryPage.innerHTML = "";
	}
}
