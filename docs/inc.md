# inc

## Instructions
| Opcode | Name | Description |
| --- | --- | --- |
| 03 | inc ra | Increment RA by 1 |
| 04 | inc rb | Increment RB by 1 |

| Addr | Desc |
| ---: | :--- |
| 0x8000 | End of memory |
| 0x4000 | Randomly Accessible Memory (RAM) |
| 0x0000 | Read-Only Memory (ROM) [^start] |

## Flags affected
None

## Errors
- GP Fault: Overflows the target