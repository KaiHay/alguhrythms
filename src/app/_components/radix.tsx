function radixSort(arr: string[]): string[] {
    const unSorted = [...arr]
    const buckets: string[][] = [[], [], [], [], [], [], [], [], [], []]
    const maxLen = arr.reduce((m, s) => Math.max(m, s.length), 0)

    for (let c_digit = maxLen ; c_digit >= 0; c_digit--) {
        // Clear buckets each pass
        for (let b = 0; b < 10; b++) buckets[b] = []

        for (let i = 0; i < unSorted.length; i++) {
            // Pad with '0' if digit is missing
            const str = unSorted[i]!
            const char = str[maxLen-c_digit] ?? '0'
            console.log('on number: ', str, '    this digit: ', char);

            const bucketIdx = Number(char)
            if (bucketIdx >= 0 && bucketIdx < 10) {
                buckets[bucketIdx]!.push(str)
            } else {
                // Handle unexpected bucket index
                buckets[0]!.push(str)
            }
        }
        // Merge buckets
        unSorted.length = 0
        for (let b = 0; b < 10; b++) {
            unSorted.push(...buckets[b]!)
        }
    }

    return unSorted
}


const darry = ['3', '1', '2', '4', '5', '6', '7', '8', '9', '66653', '234']
const parry = ['22', '1', '33', '4', '11111111111111111111111111111111111']
let poop = radixSort(parry)

console.log('sorted: ', poop)