import {SegFault, GPFault} from './errors.mjs'
import * as rl from 'node:readline'

let speed = 100
let manual = false
let logs = true

let AddrLine = 0b0000000000000000
let DataLine = 0x00
let IO = false

let program = "03 04 04 08 10 07 00 00".split(' ').join('').match(/.{1,2}/g) || []

let MEMORY = {}
let STACK = []
let REGISTERS = {
	RA: "00",
	RB: "00"
}

let RM = {
	'0': 'RA',
	'1': 'RB'
}

function convert(n, fromBase, toBase) {
  if (fromBase === void 0) {
    fromBase = 10;
  }
  if (toBase === void 0) {
    toBase = 10;
  }
  return parseInt(n.toString(), fromBase).toString(toBase);
}

console.log("Loading ROM")

const debug = () => {
	if (!logs) return
	let AddrLineBin = AddrLine.toString(2)
	let DataLineBin = DataLine.toString(16)
	
	console.log({ A: AddrLine, AB: AddrLineBin, I: IO, D: DataLine, DB: DataLineBin })
	console.log(REGISTERS)
}

let run = 0

const memory = () => {
	let addr = AddrLine
	if (IO) {
		if (addr < 0x4000 && run > 3) throw new SegFault()
		MEMORY[addr] = DataLine.toString(16)
	}
	else {
		if (MEMORY[addr]) DataLine = MEMORY[addr].toString(16)
		else {
			MEMORY[addr] = "00"
			DataLine = "00"
		}
	}
	debug()
}

IO = true

/*while (Object.keys(MEMORY).length < 0b100000000000000) {
	DataLine = 0b0
	memory()
	AddrLine += 0b1
}*/

console.log("Loading RAM")

/*while (Object.keys(MEMORY).length < 0b1000000000000000) {
	DataLine = 0b0
	memory()
	AddrLine += 0b1
}*/

console.log("Loading program")

AddrLine = 0b11111111111110
DataLine = 0b00
memory()

AddrLine += 0b1
DataLine = 0b0
memory()

AddrLine = 0b0000000000000000
program.forEach(byte => {
	DataLine = byte
	memory()
	AddrLine += 0b1
})

IO = false

let entry = ''

let reg = ''
let imm = ''

let command = []

console.log("STEPPING")

function immediate(command) {
	if (command.length !== 2) {
		memory()
		command.push(DataLine)
	} else {
		memory()
		command.push(DataLine)
		command.shift()
		reg = command.join('')
		return reg
	}
	return command
}
function rmByte() {
	memory()
	reg = DataLine.split('')
	reg[0] = RM[reg[0]]
	reg[1] = RM[reg[1]]
	REGISTERS[reg[1]] = REGISTERS[reg[0]]
}

function operate() {
	if (run === 0) {
		AddrLine = 0b11111111111110
		memory()
		entry += DataLine
	} else if (run === 1) {
		memory()
		entry += DataLine
	} else if (run === 2) {
		AddrLine = convert(entry, 16, 2) - 0b1
	} else {
		if (!command[0]) {
			let reg = 0
			memory()
			switch(DataLine) {
				case '00':
					break
				case '01':
					// Put immediate into RA
					command.push("01")
					break;
				case '02':
					// Put immediate into RB
					command.push("02")
					break;
				case '03':
					// Inc RA
					reg = parseInt(REGISTERS.RA, 16)
					reg += 1
					REGISTERS.RA = convert(reg, 10, 16)
					break;
				case '04':
					// Inc RB
					reg = parseInt(REGISTERS.RB, 16)
					reg += 1
					REGISTERS.RB = convert(reg, 10, 16)
					break;
				case '05':
					// Put immediate into RA
					command.push("05")
					break;
				case '06':
					// Put immediate into RB
					command.push("06")
					break;
				case '07':
					// Jump to address in memory
					command.push('07')
					break;
				case '08':
					// Put reg into reg
					command.push('08')
					break;
				
			}
		} else {
			switch(command[0]) {
				case '01':
					command = immediate(command)
					if (Array.isArray(command)) break
					
					REGISTERS.RA = reg
					command = []
					break

				case '02':
					command = immediate(command)
					if (Array.isArray(command)) break
					
					REGISTERS.RB = reg
					command = []
					break

				case '05':
					imm = immediate(command)
					if (Array.isArray(imm)) break

					reg = parseInt(REGISTERS.RA, 16)
					reg += convert(imm, 16, 10)
					command = []
					REGISTERS.RA = convert(parseInt(reg), 10, 16)
					break

				case '06':
					imm = immediate(command)
					if (Array.isArray(imm)) break

					reg = parseInt(REGISTERS.RB, 16)
					reg += convert(imm, 16, 10)
					command = []
					REGISTERS.RB = convert(parseInt(reg), 10, 16)
					break

				case '07':
					command = immediate(command)
					if (Array.isArray(command)) break
					
					AddrLine = convert(parseInt(reg), 16, 2) - 1
					memory()
					command = []
					
					break;

				case '08':
					rmByte()

					command = []
					break;
			}
		}
	}
	run++
	AddrLine++
}

if (!manual) setInterval(operate, speed)
else {
	const readline = rl.createInterface({
	  input: process.stdin,
	  output: process.stdout,
	});

	console.log("MANUAL STEPPING")
	function step() {
		readline.question("", () => {
			operate()
			step()
		})
	}
	step()
}