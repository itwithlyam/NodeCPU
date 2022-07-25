# mov

## Instructions

| Opcode | Name | Description |
| --- | --- | --- |
| 01 _/rn imm16_ | mov r,imm16 | Put an immediate into a register |
| 02 _imm16_ | mov imm16,rb | Put an immediate into RB |
| 08 _/r_ | mov r,r | Put the contents of a register into a register |

## Flags affected
None

## Errors
- GP Fault: Overflows the target
- GP Fault: First nibble of RM byte is not supplied
