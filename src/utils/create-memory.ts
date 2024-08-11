export const createMemory = function createMemory(sizeInBytes: number): DataView {
    const arrayBuffer = new ArrayBuffer(sizeInBytes);
    return new DataView(arrayBuffer);
}