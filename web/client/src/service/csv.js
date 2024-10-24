import Papa from 'papaparse';
import { addBoxes } from './index';
import SparkMD5 from 'spark-md5';
import { toast } from 'react-toastify';
const lzstring = require('lz-string');

function isCSVValid(file) {
	return file.type === 'text/csv';
}

function parseCSV(text, setUploadProgress, setResults, setIsLoading, setComplete) {
	let boxes = [];
	const user = JSON.parse(localStorage.getItem('user'));
	Papa.parse(text, {
		worker: true,
		skipEmptyLines: true,
		step: (element) => {
			const [
				project,
				state,
				lgea,
				school,
				schoolCode,
				htName,
				htPhone,
				ssoName,
				ssoPhone,
				latitude,
				longitude,
			] = element.data;
			const newBox = {
				id: '',
				project,
				state,
				lgea,
				school,
				schoolCode,
				htName,
				htPhone,
				ssoName,
				ssoPhone,
				schoolLatitude: parseFloat(latitude.replace(',', '.')),
				schoolLongitude: parseFloat(longitude.replace(',', '.')),
				adminId: user.id,
				createdAt: new Date().getTime()
			};
			newBox.id = SparkMD5.hash(JSON.stringify(newBox) + Math.random() * 1000);

			boxes.push(newBox);
		},
		complete: () => {
			boxes.shift();
			uploadBoxes(boxes, setUploadProgress, setResults, setIsLoading, setComplete);
		}
	})
}

function uploadBoxes(boxes, setUploadProgress, setResults, setIsLoading, setComplete) {
	const BUFFER_LENGTH = 500;
	const numBoxes = boxes.length;
	let bufferStartIndex = 0;
	const responses = [];

	const processBuffer = (buffer) => {
		const payload = JSON.stringify(buffer);
		const compressedPayload = {
			data: lzstring.compressToEncodedURIComponent(payload)
		};
		addBoxes(compressedPayload)
			.then((res) => {
				responses.push(res);

				setUploadProgress((bufferStartIndex + buffer.length) / numBoxes);

				if (bufferStartIndex + buffer.length < numBoxes) {
					bufferStartIndex += buffer.length;
					const nextBuffer = boxes.slice(bufferStartIndex, bufferStartIndex + BUFFER_LENGTH);
					processBuffer(nextBuffer);
				} else {
					const summary = createSummary(responses);
					setResults(summary);
					setIsLoading(false);
					setComplete(true);
				}
			})
			.catch((err) => {
				setIsLoading(false);
				setComplete(true);
				toast.error(err.response?.data?.error?.message || err.message);
			});
	};

	const initialBuffer = boxes.slice(0, BUFFER_LENGTH);
	processBuffer(initialBuffer);
}

function createSummary(results) {
	const invalid = results.flatMap((res) => res.invalidInstances);
	const valid = results.flatMap((res) => res.validInstances);
	return { invalid, valid };
}

export async function handleCSV(files, setUploadProgress, setResults, setIsLoading, setComplete) {
	const file = files[0];
	if (!isCSVValid(file)) {
		throw Error('File is not CSV');
	}
	try {
		const data = await file.text();
		parseCSV(data, setUploadProgress, setResults, setIsLoading, setComplete);
	} catch (error) {
		console.log(error);
	}
}

export const csvToArray = async (csv, headers) => {
	// For example, headers = ['school', 'schoolLatitude', 'schoolLongitude']
	// csv = "school,schoolLatitude,schoolLongitude\nCHANKHOMI,-13.9833,33.7833\n"
	// Returns [{ school: 'CHANKHOMI', schoolLatitude: '-13.9833', schoolLongitude
	const result = [];
	const text = await csv.text();
	Papa.parse(text, {
		skipEmptyLines: true,
		header: false,
		step: (element) => {
			const obj = {};
			headers.forEach((header, i) => {
				obj[header] = element.data[i];
			});
			result.push(obj);
		},
	});
	result.shift();
	return result;
}
