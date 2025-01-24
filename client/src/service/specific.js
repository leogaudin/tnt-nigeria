// Here are all the country-specific configurations, to facilitate the process of adapting the application to a new country.

// TnT + name of the country + flag
export const name = 'TnT Nigeria 🇳🇬';

export const colors = {
	lightest: '#B3C7BC',
	light: '#51A87D',
	main: '#008751',
	dark: '#00613D',
	darkest: '#0F271E',
};

// The corresponding API URL
export const API_URL =
						process.env.NODE_ENV === 'development'
						?
						'http://localhost:3000/api'
						:
						'https://tnt-nigeria-api.vercel.app/api'


// Fields that should be: displayed as information, or the full representation of the object
// Used in:
// - PDFExport.jsx
// - UploadBoxes.jsx
// - csv.js
export const boxFields = {
	project: { type: String, required: true },
	state: { type: String, required: true },
	lgea: { type: String, required: true },
	school: { type: String, required: false },
	schoolCode: { type: String, required: false },
	htName: { type: String, required: false },
	htPhone: { type: String, required: false },
	ssoName: { type: String, required: false },
	ssoPhone: { type: String, required: false },
};

// Fields that characterize a school in the GPS update list
// Used in:
// - UpdateGPS.jsx
// - csv.js
export const gpsUpdateFields = [
	'schoolCode',
]

// Fields that characterize a school in the Delivery report
// Used in:
// - Report.jsx
export const reportFields = [
	'school',
	'state',
]

// Keys that should not be available to the user (e.g. when filtering)
// Used in:
// - BoxFiltering.jsx
// - BoxModal.jsx
export const excludedKeys = [
	'_id',
	'__v',
	'id',
	'adminId',
	'scans',
	'schoolLatitude',
	'schoolLongitude',
	'statusChanges',
	'progress',
	'content',
	'lastScan',
];
