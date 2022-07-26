# push

## Instructions

| Opcode | Name | Description |
| --- | --- | --- |
| 02 _imm16_ | push r | Push immediate onto stack |

## Flags affected
None

## Errors
- Segmentation Fault: Overwrites a value on the stack (stack overflow)
