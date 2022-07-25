# NodeCPU
NodeCPU is a "virtual computer" built in NodeJS. While this isn't exactly a proof-of-concept, it is still a bit of an experiment.

# Application Binary Interface
This is NodeCPU ABI `v0.0.1`. To find older versions, go to [visit our archives](/NodeCPU/archives).
## Instruction set

| Opcode | Name | Description | Notes | Link |
| --- | --- | --- | --- | --- |
| 01 _/rn imm16_ | mov r,imm16 | Put an immediate into a register || [mov](/NodeCPU/mov)
| 03 _/rn_ | inc r | Increment a register by 1 || [inc](/NodeCPU/inc)
| 05 _/rn imm16_ | add imm16,r | Add immediate to a register || [add](/NodeCPU/add)
| 07 _addr16_ | jmp addr16 | Jump to an address in memory || [jmp](/NodeCPU/jmp)
| 08 _/r_ | mov r,r | Put the contents of a register into a register || [mov](/NodeCPU/mov)
 
## Low Level System Information

### Memory Map

| Addr | Desc |
| ---: | :--- |
| 0x8000 | End of memory |
| 0x4000 | Randomly Accessible Memory (RAM) |
| 0x0000 | Read-Only Memory (ROM) |

The entry point for programs is 0x0000. ROM can only be modified in "entry mode".

### Modes

| Mode | Byte | Features | When to use |
| ---: | :---: | :---: | :--- |
| Entry | 0x00 | Full access to processor, including ROM | While initialising |
| Boot | 0x01 | Access to bootloader and RAM | When booting an operating system |
| Protected | 0x02 | Access to RAM | When in an operating system |

To switch modes, put the byte into Register MR.

## Calling Convention
### General-purpose registers
These registers can be used for any operation, but the recommened uses are as follows:

| Name | Recommended Use | RM Nibble |
| --- | --- | --- |
| RA | Temporary storage/parameter 1 for subroutines | 0x1 |
| RB | Parameter 2 for subroutines | 0x2 |

### Special registers
These registers can only be used for the operation specified.

| Name | Use | RM Nibble |
| --- | --- | --- |
| MR | Mode Register | 0x3 |

## Definitions
**Immediate**: A value or address in memory [^bigendian]  
**RAM**: Randomly Accessible Memory  
**ROM**: Read-Only Memory  
**RM Byte**: A byte with two registers (nibbles)[^rm]

[^start]: Program is stored at beginning of ROM
[^bigendian]: Uses big endian
[^rm]: `01`: Input = RA, Target = RB. Used for transferring data between registers. In instruction set docs is shown with _**/r**_. If the opcode has _/r**n**_, the target should be left blank.
