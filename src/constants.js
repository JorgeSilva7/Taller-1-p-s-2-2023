import yargs from "yargs";
import { hideBin } from "yargs/helpers";
const argv = yargs(hideBin(process.argv)).argv;

const CITY = argv.location || "temuco-la-araucania";
const MAX_PAGES = argv.maxPages || 1;
const PER_PAGE = argv.perPage || 50;
const MAXIMUM_PRICE = argv.maximumPrice;

export { CITY, MAX_PAGES, PER_PAGE, MAXIMUM_PRICE };
