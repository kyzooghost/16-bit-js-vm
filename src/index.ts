import { createMemory } from "./utils/create-memory";
import { Instructions } from "./constants/instructions";
import { CPU } from "./models/cpu";

const memory = createMemory(256);
const writeableBytes = new Uint8Array(memory.buffer);
const cpu = new CPU(memory);

writeableBytes[0] = Instructions.MOV_LIT_R1;
writeableBytes[1] = 0x12;
writeableBytes[2] = 0x34;

writeableBytes[3] = Instructions.MOV_LIT_R2;
writeableBytes[4] = 0xAB;
writeableBytes[5] = 0xCD;

writeableBytes[6] = Instructions.ADD_REG_REG;
writeableBytes[7] = 2; // r1 index
writeableBytes[8] = 3; // rr index

cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();