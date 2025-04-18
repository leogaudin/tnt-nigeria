import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// MUST MATCH boxFields VARIABLE IN client/src/service/specific.js
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

const Box = new Schema(
	{
		id: { type: String, required: true },
		...boxFields,
		adminId: { type: String, required: true },
		createdAt: { type: Date, required: true },
		scans: { type: Array, required: false },
		schoolLatitude: { type: Number, required: true},
		schoolLongitude: { type: Number, required: true},
		statusChanges: { type: Object, required: false },
		progress: { type: String, required: false, default: 'noScans' },
		lastScan: { type: Object, required: false },
		packingListId: { type: Number, required: false },
	}
)

export default mongoose.model('boxes', Box);
