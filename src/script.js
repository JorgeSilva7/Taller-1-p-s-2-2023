import { load } from "cheerio";
import filterByPrice from "./filter-by-price.js";
import GenerateFile from "./utils/generate-file.js";
import {
	CITY,
	PER_PAGE,
	MAXIMUM_PRICE,
	MAX_PAGES,
	USED_HOUSES_PORTAL_INM_WEB,
} from "./constants.js";
import { getRequest } from "./utils/axios.js";

let houses = [];
let page = 0;

/**
 * Delay promise
 * @param {Number} ms - Miliseconds delay
 * @returns {Promise} timeout promise
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Recursive asynchronous function. Obtain N houses from portalinmobiliario web. (N = MAX_PAGES * PER_PAGE)
 */
async function getHousesFromWeb() {
	console.log(`Page ${page + 1} of ${MAX_PAGES}`);

	const data = await getRequest(
		`${USED_HOUSES_PORTAL_INM_WEB}/${CITY}/_Desde_${
			PER_PAGE * (page + 1)
		}_NoIndex_True`
	);

	// Get the HTML code of the webpage
	const $ = load(data);

	// Find all elements with ui-search-result__wrapper class, in div element.
	$("div.ui-search-result__wrapper").each((_index, el) => {
		const section = $(el).find("div > div > a");
		const url = $(section).attr("href");
		const originalPrice = Number(
			$(section)
				.find(".andes-money-amount__fraction")
				.text()
				.toString()
				.replace(/\./g, "")
		);
		const inUF =
			$(section).find(".andes-money-amount__currency-symbol").text() === "UF";
		const size = $(section)
			.find(".ui-search-card-attributes__attribute")
			.first()
			.text();
		const dorms = $(section)
			.find(".ui-search-card-attributes__attribute")
			.next()
			.text();
		const location = $(section)
			.children()
			.next()
			.next()
			.next()
			.children()
			.first()
			.text();
		houses.push({ url, originalPrice, inUF, size, dorms, location });
	});

	page++;

	await sleep(1000);

	return page === MAX_PAGES ? page : getHousesFromWeb();
}

/**
 * Get UF value from mindicador API
 * @returns {Number} Current UF value
 */
async function getUFValue() {
	const { uf } = await getRequest("https://mindicador.cl/api");
	return uf.valor;
}

/**
 * Format number to CLP currency
 * @param {Number} price - Unformatted Price
 * @returns {string} formatted price
 */
const formatCLPPrice = (price) =>
	new Intl.NumberFormat("es-CL", {
		currency: "CLP",
		style: "currency",
	}).format(price);

/**
 * Append priceInCLP variable to the house object in the houses array
 * The priceInCLP is obtained by UFValue * house.originalPrice
 * @param {House[]} houses - Houses list
 * @param {Number} UFValue - UF value
 * @returns {House[]} Houses with priceInClP key
 */
function addPriceInCLPToHouses({ houses, UFValue }) {
	return houses.map((house) => {
		const priceInCLP = house.inUF
			? house.originalPrice * UFValue
			: house.originalPrice;
		return {
			...house,
			priceInCLP: formatCLPPrice(priceInCLP),
		};
	});
}

/**
 * Get houses with the method `getHousesFromWeb`, finally get the price in CLP and generate the JSON file with the extracted data.
 * Optionally filter houses by `maximumPrice`
 */
getHousesFromWeb().then(async () => {
	const UFValue = await getUFValue();
	const housesWithPriceInCLP = addPriceInCLPToHouses({ houses, UFValue });

	GenerateFile.JSON({ filename: CITY, data: housesWithPriceInCLP });

	if (MAXIMUM_PRICE) {
		filterByPrice({
			houses: housesWithPriceInCLP,
			maximumPrice: MAXIMUM_PRICE,
			city: CITY,
		});
	}
});
