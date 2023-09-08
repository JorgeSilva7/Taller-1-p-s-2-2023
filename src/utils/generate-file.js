import fs from "fs";
import XLSX from "XLSX";

/**
 * Saves an object data on a json file
 * @param {string} args.filename - Filename
 * @param {object|array} args.data - Data to save
 */
function generateJSON({ filename, data }) {
	fs.writeFile(`./json/${filename}.json`, JSON.stringify(data), function (err) {
		if (err) {
			console.log(err);
		}
		console.log(`${filename} JSON generated successfully`);
	});
}

/**
 * Saves an object data on a xlsx file
 * @param {string} args.filename - Filename
 * @param {object|array} args.data - Data to save
 * @param {object|array} [args.sheetName] - Sheet name of the generated XLSX (optional, args.filename by default)
 */
function generateXLSX({ filename, data, sheetName = null }) {
	const workSheet = XLSX.utils.json_to_sheet(data);
	const workBook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workBook, workSheet, sheetName ?? filename);
	XLSX.writeFile(workBook, `./xlsx/${filename}.xlsx`);
	console.log(`${filename} XLSX File generated successfully`);
}

const generateFile = {
	JSON: generateJSON,
	XLSX: generateXLSX,
};

export default generateFile;
