import GenerateFile from "./generate-file.js";

const SHEET_NAME = "Houses";
const FILENAME_PREFIX = "filtered";

/**
 * Generate filtered houses output files
 * @param {object} args - Required object arguments
 * @param {string} args.city - City name used for output filename
 * @param {House[]} args.filteredHouses - Array of houses
 */
function generateFilesWithFilteredHouses({ city, filteredHouses }) {
	GenerateFile.XLSX({
		filename: city,
		data: filteredHouses,
		sheet: SHEET_NAME,
	});
	GenerateFile.JSON({
		filename: `${city}-${FILENAME_PREFIX}`,
		data: filteredHouses,
	});
}

/**
 * Check if the value (priceInCLP) of the house is less than maximumPrice
 * @param {House} args.house - House to check
 * @param {Number} args.maximumPrice - Maximum price
 * @returns {boolean}
 */
const filterHousesPerMaximumPrice = ({ house, maximumPrice }) =>
	Number(house.priceInCLP.replace("$", "").replace(/\./g, "")) < maximumPrice;

/**
 * Render an object with the location and URL
 * @param {House} filterHouse - House to extract the data
 * @returns {Location, URL} Location and URL from the House
 */
const renderFilteredHouses = (filterHouse) => ({
	Location: filterHouse.location,
	URL: filterHouse.url,
});

/**
 * Filters an array of houses by a maximumPrice then saves a json and xlsx files
 * @param {House[]} args.houses Array of houses to filter
 * @param {Number} args.maximumPrice Maximum price
 * @param {string} args.city City of the houses
 */
function filterByPrice({ houses, maximumPrice, city }) {
	const filteredHouses = houses
		.filter((house) => filterHousesPerMaximumPrice({ house, maximumPrice }))
		.map((house) => renderFilteredHouses(house));

	generateFilesWithFilteredHouses({ city, filteredHouses });
}

export default filterByPrice;
