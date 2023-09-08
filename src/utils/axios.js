import axios from "axios";

/**
 * Perform a HTTP GET request with axios.get
 * @param {string} uri - URI of the service endpoint (baseURL + endpoint)
 * @returns {Promise<data>} response
 */
async function getRequest(uri) {
	const { data } = await axios.get(uri);
	return data;
}

export { getRequest };
