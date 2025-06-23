export interface radLogs {
    masterArray: string[],
    buckets: string[][],
    currDigit: number,
    currNumber: string
}

export type fullRadMoves = {
    moves: radLogs[]
}


export function radixSort(arr: string[]): fullRadMoves {
    const unSorted = [...arr]
    const buckets: string[][] = [[], [], [], [], [], [], [], [], [], []]
    const maxLen = arr.reduce((m, s) => Math.max(m, s.length), 0)
    const allMoves: fullRadMoves = {
        moves: [
            {
                masterArray: [...unSorted],
                buckets: [[], [], [], [], [], [], [], [], [], []],
                currDigit: maxLen,
                currNumber: unSorted[0]!
            }
        ]
    }
    // console.log('INITIAL: ', allMoves);

    for (let c_digit = maxLen - 1; c_digit >= 0; c_digit--) {
        // Clear buckets each pass
        for (let i = 0; i < unSorted.length; i++) {
            const str = unSorted[i]!
            const padded = str.padStart(maxLen, '0')
            const char = padded[c_digit]

            const bucketIdx = Number(char)
            if (bucketIdx >= 0 && bucketIdx < 10) {
                buckets[bucketIdx]!.push(str)
                const c_move: radLogs = {
                    masterArray: [...unSorted],
                    buckets: buckets.map(bucket => [...bucket]),
                    currDigit: c_digit,
                    currNumber: str,
                }
                allMoves.moves.push(c_move)

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
        for (let b = 0; b < 10; b++) {
            buckets[b] = []
        }
        const c_move: radLogs = {
            masterArray: [...unSorted],
            buckets: buckets.map(bucket => [...bucket]),
            currDigit: c_digit,
            currNumber: unSorted[0]!,
        }
        allMoves.moves.push(c_move)

    }

    return allMoves
}


//TEST DATA
const sarry = ['3', '1', '10', '50']
const darry = ['3', '1', '2', '4', '5', '6', '7', '8', '9', '668', '234']
const parry = ['-22', '1', '33', '4', '11111111111111111111111111111111111']
const words = ['a', 'b', 'a', '2', 'cad', 'qwpejpoj', 'asdsa;sldk']
let poop = radixSort(sarry)

console.log('sorted: ', poop)