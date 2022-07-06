export class SegFault {
	constructor() {
		console.log("Segmentation fault")
		process.exit(1)
	}
}

export class GPFault {
	constructor() {
		console.log("General Protection fault")
		process.exit(1)
	}
}
