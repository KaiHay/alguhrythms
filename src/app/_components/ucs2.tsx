//full graph, current node, frontier nodes, full frontier queue
//every visited node
//
export type graphHistory = {
    fullGraph: GraphNode2
    currNode: GraphNode2 | null
    frontier: PrioQ[]
    complete: boolean
}[]
export class GraphNode2 {
    public data: string
    public neighbors: { node: GraphNode2, weight: number }[]

    constructor(data: string) {
        this.data = data
        this.neighbors = []
    }
}

export type PrioQ = {
    node: GraphNode2
    currCost: number
    path: GraphNode2[]
}


export function UniCS2(graph: GraphNode2, goal: string)
    : graphHistory | null {
    // { path: GraphNode2[], cost: number } | null {
    //how to keep track of cheapest path

    const bestCost = new Map<GraphNode2, number>([[graph, 0]])
    const frontier: PrioQ[] = [{ node: graph, currCost: 0, path: [graph] }]
    const fullHistory: graphHistory = [{
        fullGraph: graph,
        currNode: graph,
        frontier: [...frontier],
        complete: false
    }]
    while (frontier.length > 0) {
        frontier.sort((a, b) => a.currCost - b.currCost)
        const nodeExp = frontier.shift()
        if (nodeExp?.node.data == goal) {
            fullHistory.push({
                fullGraph: graph,
                currNode: nodeExp.node,
                frontier: frontier,
                complete: true,
            })
            return fullHistory
            // return {path: nodeExp.path, cost:nodeExp.currCost}
        }
        fullHistory.push({
            fullGraph: graph,
            currNode: nodeExp!.node,
            frontier: [...frontier],
            complete: false,
        })
        //push neighbors to frontier, have to do some checks
        //if in, check if currCost less, replace in map(can leave in queiue? cuz most exp at end)
        //might be best to take it out the queue
        for (const { node: neighb, weight: cost } of nodeExp!.node.neighbors) {
            const newCost = nodeExp!.currCost + cost
            if (!bestCost.has(neighb)) {
                bestCost.set(neighb, newCost)
                const frontItem: PrioQ = {
                    node: neighb,
                    currCost: newCost,
                    path: [...nodeExp!.path, neighb]
                }
                frontier.push(frontItem)
                fullHistory.push({
                    fullGraph: graph,
                    currNode: nodeExp!.node,
                    frontier: [...frontier],
                    complete: false,
                })
            }
        }
    }

    return null
}

//TESTING
const a = new GraphNode2('a')
const b = new GraphNode2('b')
const c = new GraphNode2('c')
const d = new GraphNode2('d')
const e = new GraphNode2('e')
const last = new GraphNode2('last')

a.neighbors.push({ node: b, weight: 2 })
a.neighbors.push({ node: c, weight: 3 })

b.neighbors.push({ node: d, weight: 4 })
b.neighbors.push({ node: e, weight: 1 })

c.neighbors.push({ node: e, weight: 2 })

d.neighbors.push({ node: b, weight: 1 })
a.neighbors.push({ node: last, weight: 10 })
b.neighbors.push({ node: last, weight: 10 })
c.neighbors.push({ node: last, weight: 10 })
d.neighbors.push({ node: last, weight: 1 })
e.neighbors.push({ node: last, weight: 10 })

const res = UniCS2(a, 'd')

//console.log((res))