# NodeCPU
NodeCPU is a "virtual computer" built in NodeJS. While this isn't exactly a proof-of-concept, it is still a bit of an experiment.

## Instruction set

| Opcode | Name | Description | Notes | Link |
| --- | --- | --- | --- | --- |
| 01 _imm16_ | mov ra,imm16 | Put an immediate into RA | Executes on last byte of immediate | [mov](/NodeCPU/docs/mov)
| 02 _imm16_ | mov rb,imm16 | Put an immediate into RB | Executes on last byte of immediate | [mov](/NodeCPU/docs/mov)
| 03 | inc ra | Increment RA by 1 || [inc](/NodeCPU/docs/inc)
| 04 | inc rb | Increment RB by 1 || [inc](/NodeCPU/docs/inc)
| 05 _imm16_ | add imm16,ra | Add immediate to RA | Executes on last byte of immediate | [add](/NodeCPU/docs/add)
| 06 _imm16_ | add imm16,rb | Add immediate to RB | Executes on last byte of immediate | [add](/NodeCPU/docs/add)
| 07 _addr16_ | jmp addr16 | Jump to an address in memory | Executes on last byte of address | [jmp](/NodeCPU/docs/jmp)

## Memory map

| Addr | Desc |
| ---: | :--- |
| 0x8000 | End of memory |
| 0x4000 | Randomly Accessible Memory (RAM) |
| 0x0000 | Read-Only Memory (ROM) [^start] |

### General-purpose registers

| Name | Desc |
| --- | --- |
| RA | Accumalator |
| RB | Base |

## Definitions
**Immediate**: A value or address in memory [^bigendian]  
**RAM**: Randomly Accessible Memory  
**ROM**: Read-Only Memory

[^start]: Program is stored at beginning of ROM
[^bigendian]: Uses big endian
