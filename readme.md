# NodeCPU
NodeCPU is a "virtual computer" built in NodeJS. While this isn't exactly a proof-of-concept, it is still a bit of an experiment.

## Instruction set

| Opcode | Name | Description | Notes | Link |
| --- | --- | --- | --- | --- |
| 01 _/rn imm16_ | mov r,imm16 | Put an immediate into a register || [mov](/NodeCPU/mov)
| 02 _imm16_ | mov rb,imm16 | Put an immediate into RB || [mov](/NodeCPU/mov)
| 03 | inc ra | Increment RA by 1 || [inc](/NodeCPU/inc)
| 04 | inc rb | Increment RB by 1 || [inc](/NodeCPU/inc)
| 05 _imm16_ | add imm16,ra | Add immediate to RA || [add](/NodeCPU/add)
| 06 _imm16_ | add imm16,rb | Add immediate to RB || [add](/NodeCPU/add)
| 07 _addr16_ | jmp addr16 | Jump to an address in memory || [jmp](/NodeCPU/jmp)
| 08 _/r_ | mov r,r | Put the contents of a register into a register || [mov](/NodeCPU/mov)

## Memory map

| Addr | Desc |
| ---: | :--- |
| 0x8000 | End of memory |
| 0x4000 | Randomly Accessible Memory (RAM) |
| 0x0000 | Read-Only Memory (ROM) [^start] |

### General-purpose registers

| Name | Desc | RM Nibble |
| --- | --- | --- |
| RA | Accumalator | 0x0 |
| RB | Base | 0x1 |

## Definitions
**Immediate**: A value or address in memory [^bigendian]  
**RAM**: Randomly Accessible Memory  
**ROM**: Read-Only Memory  
**RM Byte**: A byte with two registers (nibbles)[^rm]

[^start]: Program is stored at beginning of ROM
[^bigendian]: Uses big endian
[^rm]: `01`: Input = RA, Target = RB. Used for transferring data between registers. In instruction set docs is shown with _**/r**_. If the opcode has _/r**n**_, the target should be left blank.
