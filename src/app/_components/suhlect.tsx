const noAniSelect = (arr: number[]): number[] => {
    const sorted = []
    const unSorted = [...arr]



    while (unSorted.length > 0) {
        let least = unSorted[0]!
        let leastIdx = 0
        for (let i = 1; i < unSorted.length; i++) {
            if (unSorted[i]! < least) {
                least = unSorted[i]!
                leastIdx = i
            }
        }
        sorted.push(unSorted.splice(leastIdx, 1)[0]!)
    }
    return sorted


};

const sortThis = [5, 3, 1, 2, 3, 9, 6]
let poopy = noAniSelect(sortThis)
console.log('Sorting: ', sortThis, '  Into this: ', poopy)