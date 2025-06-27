'use client'
import { useEffect, useState } from 'react'
import ForceGraph2D, { type LinkObject, type NodeObject } from 'react-force-graph-2d'
import { GraphNode2, UniCS2 } from "./_components/ucs2"
//RENDER THE GRAPH ON THE SCREEN
function toGraph(root: GraphNode2) {
    const nodes: { id: string }[] = []
    const links: { source: string, target: string, weight: number }[] = []
    const seen = new Set<GraphNode2>();

    (function dfs(n: GraphNode2) {
        if (seen.has(n)) return
        seen.add(n)
        nodes.push({ id: n.data })
        for (const { node: tgt, weight } of n.neighbors) {
            links.push({ source: n.data, target: tgt.data, weight })
            dfs(tgt)
        }
    })(root)

    return { nodes, links }
}

const NODE_COLOUR = (n: NodeObject, currentId: string | null, frontierIds: string[]) => {
    if (n.id === currentId) return '#ef4444' // red for current node
    if (frontierIds.includes(n.id as string)) return '#fbbf24' // yellow for frontier nodes
    return '#94a3b8' // gray for other nodes
}

const a = new GraphNode2('a')
const b = new GraphNode2('b')
const c = new GraphNode2('c')
const d = new GraphNode2('d')
const e = new GraphNode2('e')
const f = new GraphNode2('f')
const g = new GraphNode2('g')
const h = new GraphNode2('h')
const i = new GraphNode2('i')
const j = new GraphNode2('j')
const k = new GraphNode2('k')

a.neighbors.push({ node: b, weight: 2 })
a.neighbors.push({ node: c, weight: 3 })

b.neighbors.push({ node: d, weight: 4 })
b.neighbors.push({ node: e, weight: 1 })

c.neighbors.push({ node: e, weight: 2 })

e.neighbors.push({ node: f, weight: 2 })
f.neighbors.push({ node: g, weight: 2 })
i.neighbors.push({ node: h, weight: 2 })
c.neighbors.push({ node: i, weight: 2 })
i.neighbors.push({ node: j, weight: 10 })
i.neighbors.push({ node: k, weight: 7 })
const result = UniCS2(a, 'k')

const data = toGraph(result![0]!.fullGraph)
//group nodes by frontier, explored
export default function GraphView() {
    //const [fullGraph,setGraph] = useState(data)
    const [frontier, setFrontier] = useState(result![0]!.frontier)
    // Compute the initial value first
    const initialCurrNode: GraphNode2 | null = result?.[0]?.currNode ?? null;

    // Then use it in useState
    const [currNode, setCurrNode] = useState<GraphNode2 | null>(initialCurrNode);
    const [step, setStep] = useState(0)
    console.log(result)
    useEffect(() => {
        setCurrNode(result![step]!.currNode)
        setFrontier(result![step]!.frontier)
    }, [step])

    const next = () => {
        if (step < result!.length - 1) {
            setStep((c) => c + 1)
        }
    }

    const reset = () => setStep(0)

    return (
        <div className="">
            <div className="mb-4 p-4 bg-gray-100 rounded flex justify-center text-center items-center flex-col">
                <div className="mb-2">Step: {step + 1} / {result!.length}</div>
                <div className="mb-2">Current Node: {currNode?.data ?? 'None'}</div>
                <div className="mb-2">
                    <div className="font-semibold w-full">Priority Queue (Frontier):</div>
                    <div className="ml-2 flex flex-row gap-2">
                        {frontier.length > 0 ? (
                            frontier.map((item, index) => (
                                <div key={index} className="text-sm">
                                    {item.node.data} (cost: {item.currCost})
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">Empty</div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={next}
                        disabled={step >= result!.length - 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Next Step
                    </button>
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Reset
                    </button>
                </div>
            </div>
            <div style={{ width: '100%', height: '600px' }}>
                <ForceGraph2D
                    graphData={data}
                    linkWidth={2}
                    nodeColor={(n: NodeObject) => NODE_COLOUR(n, currNode?.data ?? null, frontier.map(f => f.node.data))}
                    nodeLabel="id"
                    linkDirectionalParticles={1}
                    linkDirectionalParticleSpeed={(l: LinkObject) => (0.03 / (l).weight)}
                    linkLabel={l => `w=${(l).weight}`}

                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.id as string
                        const fontSize = 20 / globalScale
                        ctx.font = `${fontSize}px Sans-Serif`
                        ctx.textAlign = 'center'
                        ctx.textBaseline = 'middle'
                        ctx.fillStyle = NODE_COLOUR(node, currNode?.data ?? null, frontier.map(f => f.node.data))
                        ctx.fillText(label, node.x!, node.y!)
                    }}

                    linkCanvasObjectMode={() => 'after'}
                    linkCanvasObject={(link, ctx, globalScale) => {
                        const weight = (link).weight
                        const label = String(weight)

                        const sx = (link.source as NodeObject).x!;
                        const sy = (link.source as NodeObject).y!;
                        const tx = (link.target as NodeObject).x!;
                        const ty = (link.target as NodeObject).y!;
                        const mx = (sx + tx) / 2;
                        const my = (sy + ty) / 2;

                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#555';
                        ctx.fillText(label, mx, my);
                    }}
                />
            </div>
        </div>
    );
}



