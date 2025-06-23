//-----------------------------------------Possibly hex convert
function radixSortBytes(arr: string[]): string[] {
    const base = 256;                       // one bucket per possible byte
    const buckets: string[][] = Array.from({ length: base }, () => []);
    const maxLen = arr.reduce((m, s) => Math.max(m, s.length), 0);

    let out = [...arr];                     // working copy
    for (let pos = maxLen - 1; pos >= 0; pos--) {
        // clear buckets
        for (let i = 0; i < base; i++) buckets[i]!.length = 0;

        // stable counting-sort by this character position
        for (const s of out) {
            const code = pos < s.length ? s.charCodeAt(pos) : 0; // 0 is our pad
            buckets[code]!.push(s);
        }

        // collect
        out = [];
        for (const bucket of buckets) out.push(...bucket);
    }
    return out;
}
