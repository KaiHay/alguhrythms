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
    if (visited.has(curr)) return;
    visited.add(curr);

    console.log(curr.data);

    for (const neighbor of curr.neighbors) {
        printGraph(neighbor.node, visited);
    }
}

const ucs = () => {

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
d.neighbors.push({ node: last, weight: 10 })
e.neighbors.push({ node: last, weight: 10 })

const graph = new SearchTree(a)

printGraph(graph.root!)



