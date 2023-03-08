refs = {
	body: document.querySelector("body"),
	loader: document.querySelector(".loader"),
	countryList: document.querySelector(".search__country-list")
};

function fetchCountries(name) {
	return fetch(
		`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
	).then(response => {
		if (!response.ok) {
			throw new Error(response.status);
		}
		return response.json();
	});
}

export default { fetchCountries };
