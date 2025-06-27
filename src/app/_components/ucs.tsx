export class GraphNode {
    public data: string
    public neighbors: { node: GraphNode, weight: number }[]

    constructor(data: string) {
        this.data = data
        this.neighbors = []
    }
}

export class SearchTree {
    public root: GraphNode | null
    constructor(root?: GraphNode) {
        this.root = root || null
    }
}

const printGraph = (curr: GraphNode, visited = new Set<GraphNode>()) => {
    if (visited.has(curr)) return
    visited.add(curr)

    console.log(curr.data)

    for (const neighbor of curr.neighbors) {
        printGraph(neighbor.node, visited)
    }
}

type PQItem = {
    node: GraphNode
    cost: number          
    path: GraphNode[]     
}

//push source into frontier
//push all the neighbors into the frontier ordered by their cost
//pop the cheapest and add their neighbors with their cost
//do this until you find the destination
export function ucs(
    start: GraphNode,
    goalKey: string
): { path: string[]; cost: number } | null {
    // frontier as a simple array priority-queue 
    const frontier: PQItem[] = [{ node: start, cost: 0, path: [start] }]

    // best curr cost to each visited node
    const bestCost = new Map<GraphNode, number>([[start, 0]])

    while (frontier.length > 0) {
        // pop cheapest item
        frontier.sort((a, b) => a.cost - b.cost)
        const current = frontier.shift()!        


        if (current.node.data === goalKey) {
            return {
                path: current.path.map(n => n.data),
                cost: current.cost,
            }
        }

        // expand neighbours
        for (const { node: nbr, weight } of current.node.neighbors) {
            const newCost = current.cost + weight

            // If unseen or cheaper 
            if (!bestCost.has(nbr) || newCost < bestCost.get(nbr)!) {
                bestCost.set(nbr, newCost)
                frontier.push({
                    node: nbr,
                    cost: newCost,
                    path: [...current.path, nbr],
                })
            }
        }
    }

    return null
}

export const printPath = (res: { path: string[]; cost: number } | null) => {
    if (!res) console.log("No path found")
    else console.log(`Path: ${res.path.join(" -> ")}  (cost ${res.cost})`)
}

const a = new GraphNode('a')
const b = new GraphNode('b')
const c = new GraphNode('c')
const d = new GraphNode('d')
const e = new GraphNode('e')
const last = new GraphNode('last')

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

const graph = new SearchTree(a)
const result =ucs(a,'last')
printPath(result)



