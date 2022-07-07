# mov

## Instructions

| Opcode | Name | Description |
| --- | --- | --- |
| 01 _imm16_ | mov imm16,ra | Put an immediate into RA |
| 02 _imm16_ | mov imm16,rb | Put an immediate into RB |
| 08 _/r_ | mov r,r | Put the contents of a register into a register |

## Flags affected
None

## Errors
- GP Fault: Overflows the target
