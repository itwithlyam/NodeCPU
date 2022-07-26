import {SegFault, GPFault} from './errors.mjs'
import * as rl from 'node:readline'

let speed = 1
let manual = false
let logs = true

let AddrLine = 0b0000000000000000
let DataLine = 0x00
let IO = false

let program = "02 10 01 02 01 10 04 10 07 00 00".split(' ').join('').match(/.{1,2}/g) || []

let MEMORY = {}
let STACK = []

for (let i = 0; i < 100; i++) {
	STACK[i] = "00"
}

let REGISTERS = {
	RA: "00",
	RB: "00",
	MR: "00",
	RC: "00",
	RD: "00",
	SP: "00"
}

let RM = {
	'0': null,
	'1': 'RA',
	'2': 'RB',
	'3': 'MR',
	'4': 'RC',
	'5': 'RD',
	'6': 'SP'
}

let MR = {
	'00': "default",
	'01': "boot",
	'02': "protected"
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
	
	console.log({ A: AddrLine, AB: AddrLineBin, I: IO, D: DataLine, DB: DataLineBin, S: STACK[parseInt(REGISTERS.SP, 16)] })
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

const stack = () => {
	let pos = parseInt(REGISTERS.SP, 16)
	if (pos > 0x63) pos = 0x00
	if (pos < 0x00) pos = 0x64
	
	if (IO) {
		pos++
		if (STACK[pos] !== "00") throw new SegFault()
		STACK[pos] = DataLine
	} else {
		reg = STACK[pos]
		STACK[pos] = "00"
		pos--
	}

	if (pos > 0x63) pos = 0x00
	if (pos < 0x00) pos = 0x64
	REGISTERS.SP = convert(pos, 10, 16)

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

console.log("Starting Execution")

function immediate(command, rm) {
	if ((rm && command.length !== 3) || (!rm && command.length !== 2)) {
		memory()
		command.push(DataLine)
	} else {
		memory()
		command.push(DataLine)
		command.shift()
		if (rm) command.shift()
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
	if (reg[0] == null) throw new GPFault()
	if (reg[1] == null) return reg[0]
	REGISTERS[reg[1]] = REGISTERS[reg[0]]
}

let c = []

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
					// Put immediate into register
					command.push("01")
					break;
				case '02':
					// Push immediate onto stack
					command.push("02")
					break;
				case '03':
					// Inc register
					command.push("03")
					break;
				case '04':
					// Pop from stack to register
					command.push("04")
					break
				case '05':
					// Add immediate to register
					command.push("05")
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
					if (command.length == 1) {
						command[1] = rmByte()
						c.push(command[1])
						break
					}
					else command = immediate(command, true)
					c.push(command)
					if (Array.isArray(command)) break

					REGISTERS[c[0]] = reg
					command = []
					c = []
					break

				case '02':
					command = immediate(command)
					if (Array.isArray(command)) break

					DataLine = reg
					IO = true
					stack()
					IO = false

					command = []
					break

				case '03':
					reg = rmByte()
					REGISTERS[reg]++
					command = []
					break;

				case '04':
					imm = rmByte()
					stack()
					REGISTERS[imm] = reg
					command = []
					break

				case '05':
					if (command.length == 1) {
						command[1] = rmByte()
						c.push(command[1])
						break
					}
					else command = immediate(command, true)
					c.push(command)
					if (Array.isArray(command)) break

					REGISTERS[c[0]] += reg
					command = []
					c = []
					break

				case '07':
					command = immediate(command)
					if (Array.isArray(command)) break
					
					AddrLine = convert(parseInt(reg), 16, 2) - 1
					memory()
					command = []
					
					break;

				case '08':
					if (rmByte()) throw new GPFault() // If no second rm nibble, fault

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
		readline.question("", d => {
			operate()
			if (d == "stack") console.log(STACK)
			else if (d == "registers") console.log(REGISTERS)
			step()
		})
	}
	step()
}