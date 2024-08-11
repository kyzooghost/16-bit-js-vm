import { createMemory } from "../utils/create-memory";

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
            'instructionPointer',
            'accumulator',
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
    }

    getRegister(name: string): number {
        const byteOffset = this.registerMap.get(name);
        if (!byteOffset) throw (`getRegister: No such register ${name}`);
        return this.registerMemory.getUint16(byteOffset);
    }

    setRegister(name: string, value: number) {
        const byteOffset = this.registerMap.get(name);
        if (!byteOffset) throw (`getRegister: No such register ${name}`);
        this.registerMemory.setUint16(byteOffset, value);
    }
}