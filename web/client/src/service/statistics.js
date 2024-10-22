import { getLastFinalScan, getLastMarkedAsReceivedScan, getLastValidatedScan } from ".";

export function getProgress(box) {
	if (!box?.scans || box?.scans?.length === 0) {
		return 'noScans';
	}

	const lastValidatedScan = getLastValidatedScan(box);
	const lastFinalScan = getLastFinalScan(box);
	const lastReceivedScan = getLastMarkedAsReceivedScan(box);

	if (lastValidatedScan) {
		return 'validated';
	}

	if (lastFinalScan || lastReceivedScan) {
		return 'reachedOrReceived';
	}

	return 'inProgress';
}

export function getStatusPercentage(sample, status = "delivered") {
	const boxes = sample.map(box => { return { ...box, progress: getProgress(box) } });

	const deliveredBoxes = boxes.filter(box => box.progress === status).length;

	return (deliveredBoxes / sample.length) * 100;
}

// export function calculateDeliveryPercentage(project) {
// 	const uniqueBoxIds = [...new Set(project.map(box => box.id))];

// 	const scans = project.reduce((accumulator, box) => {
// 		if (box.scans && Array.isArray(box.scans))
// 			return accumulator.concat(box.scans);
// 		return accumulator;
// 	}, []);

// 	const deliveredBoxes = uniqueBoxIds.reduce((count, boxId) => {
// 		const finalDestinationScan = scans.find(scan => scan.boxId === boxId && scan.finalDestination === true);
// 		if (finalDestinationScan) {
// 			count++;
// 		}
// 		return count;
// 	}, 0);

// 	const deliveryPercentage = (deliveredBoxes / project.length) * 100;

// 	return deliveryPercentage;
// }
