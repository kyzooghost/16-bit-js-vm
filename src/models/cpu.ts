import { createMemory } from "../utils/create-memory";
import { Instructions } from "../constants/instructions";

export class CPU {
    public memory: DataView
    public registerNames: string[] = [];
    // Continuous linear block of memory for registers - 16-bits or 2-bytes per register
    private registerMemory: DataView;
    // register name => byte-offset in registerMemory
    private registerMap: Map<string, number> = new Map<string, number>();

    constructor(_memory: DataView) {
        this.memory = _memory;

        this.registerNames = [
            'ip',
            'acc',
            'r1',
            'r2',
            'r3',
            'r4',
            'r5',
            'r6',
            'r7',
            'r8',
        ]

        this.registerMemory = createMemory(this.registerNames.length * 2)

        for (let i = 0; i < this.registerNames.length; i++) {
            const registerName = this.registerNames[i];
            this.registerMap.set(registerName, i * 2);
        }
        console.log(this.registerMap);
    }

    debug() {
        this.registerNames.forEach(name => {
            console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`)
        });
        console.log();
    }

    getRegister(name: string): number {
        const byteOffset = this.registerMap.get(name);
        if (byteOffset === undefined) throw (`getRegister: No such register ${name}`);
        return this.registerMemory.getUint16(byteOffset);
    }

    setRegister(name: string, value: number) {
        const byteOffset = this.registerMap.get(name);
        if (byteOffset  === undefined) throw (`getRegister: No such register ${name}`);
        this.registerMemory.setUint16(byteOffset, value);
    }

    // Get next 1-byte instruction, move instruction pointer forward by 1-byte
    fetch8() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint8(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 1);
        return instruction;
    }

    fetch16() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint16(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 2);
        return instruction;
    }

    execute(instruction: number) {
        switch (instruction) {
            // Move literal value into r1 register
            case Instructions.MOV_LIT_R1: {
                const literal = this.fetch16();
                this.setRegister('r1', literal);
                return;
            }

            // Move literal value into r2 register
            case Instructions.MOV_LIT_R2: {
                const literal = this.fetch16();
                this.setRegister('r2', literal);
                return;
            }

            // Add values in r1 & r2 register
            case Instructions.ADD_REG_REG: {
                // Assume for now that we use index (in this.registerNames) for the instruction
                const r1 = this.fetch8();
                const r2 = this.fetch8();

                const r1Value = this.registerMemory.getUint16(r1 * 2);
                const r2Value = this.registerMemory.getUint16(r2 * 2);
                this.setRegister('acc', r1Value + r2Value);
                return;
            }
        }
    }

    step() {
        const instruction = this.fetch8();
        return this.execute(instruction);
    }
}