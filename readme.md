# NodeCPU
## Instruction set

| Opcode | Name | Description | Notes |
| --- | --- | --- | --- |
| 01 _imm32_ | mov ra,imm8 | Put an immediate into RA | Executes on last byte of immediate |
| 02 _imm32_ | mov rb,imm8 | Put an immediate into RB | Executes on last byte of immediate |
| 03 | inc ra | Increment RA by 1 |
| 04 | inc rb | Increment RB by 1 |
| 05 _imm32_ | add imm32,ra | Add immediate to RA | Executes on last byte of immediate |
| 06 _imm32_ | add imm32,rb | Add immediate to RB | Executes on last byte of immediate |
| 07 _addr32_ | jmp addr32 | Jump to an address in memory | Executes on last byte of address |

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
