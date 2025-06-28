'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { GraphNode2, UniCS2, type PrioQ } from "./_components/ucs2"
import type { LinkObject, NodeObject } from 'react-force-graph-2d'

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-96">Loading graph...</div>
})

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

const NODE_COLOUR = (n: NodeObject, currentId: string | null, frontierIds: string[], pathIds: string[]) => {
    if (n.id === currentId) return '#ef4444' // red for current node
    if (pathIds.includes(n.id as string)) return '#006400' // green for nodes in current path
    if (frontierIds.includes(n.id as string)) return '#fbbf24' // yellow for frontier nodes
    return '#94a3b8' // gray for other nodes
}

const LINK_COLOUR = (link: LinkObject, currentPath: GraphNode2[], frontier: PrioQ[]) => {
    const sourceId = (link.source as NodeObject)?.id as string
    const targetId = (link.target as NodeObject)?.id as string

    if (!sourceId || !targetId) return '#94a3b8'

    // Check if this link is part of the current path (highest priority)
    for (let i = 0; i < currentPath.length - 1; i++) {
        if (currentPath[i]?.data === sourceId && currentPath[i + 1]?.data === targetId) {
            console.log(`Link ${sourceId} -> ${targetId} is in path, coloring green`)
            return '#22c55e' // green for current path
        }
    }

    // Check if this link is part of any frontier node's path (second priority)
    for (const frontierItem of frontier) {
        const frontierPath = frontierItem.path
        for (let i = 0; i < frontierPath.length - 1; i++) {
            if (frontierPath[i]?.data === sourceId && frontierPath[i + 1]?.data === targetId) {
                console.log(`Link ${sourceId} -> ${targetId} is in frontier path to ${frontierItem.node.data}, coloring dark yellow`)
                return '#b8860b' // dark yellow for frontier paths
            }
        }
    }

    console.log(`Link ${sourceId} -> ${targetId} not special, coloring gray`)
    return '#94a3b8' // gray for other links
}

// Function to get current path from frontier
const getCurrentPath = (currNode: GraphNode2 | null, frontier: PrioQ[], step: number, result: any): GraphNode2[] => {
    if (!currNode || step === 0) return []

    console.log('Current node:', currNode.data)
    console.log('Current step:', step)

    // The current node was just expanded, so we need to look at the previous step's frontier
    const previousStep = step - 1
    const previousFrontier = result[previousStep]?.frontier || []

    console.log('Previous frontier items:', previousFrontier.map((f: PrioQ) => ({
        node: f.node.data,
        cost: f.currCost,
        path: f.path.map((n: GraphNode2) => n.data)
    })))

    // Find the path for the current node in the previous frontier
    const pathItem = previousFrontier.find((item: PrioQ) => item.node.data === currNode.data)

    if (pathItem) {
        console.log(`Found path for ${currNode.data}:`, pathItem.path.map((n: GraphNode2) => n.data))
        return pathItem.path
    }

    console.log(`No path found for ${currNode.data} in previous frontier`)
    return []
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
    const [expandedNode, setExpandedNode] = useState<GraphNode2 | null>(initialCurrNode);
    const [expandedNodePath, setExpandedNodePath] = useState<GraphNode2[]>([]);
    const [step, setStep] = useState(0)
    console.log(result)
    useEffect(() => {
        setCurrNode(result![step]!.currNode)
        setFrontier(result![step]!.frontier)

        // Check if this is a new node being expanded (not just neighbor enqueuing)
        if (step > 0) {
            const prevNode = result![step - 1]!.currNode
            const currNode = result![step]!.currNode

            // If current node changed, it's a new expansion
            if (prevNode?.data !== currNode?.data) {
                setExpandedNode(currNode)
                // Get the path for this newly expanded node
                const path = getCurrentPath(currNode, result![step]!.frontier, step, result)
                setExpandedNodePath(path)
            }
        } else {
            // First step
            setExpandedNode(result![0]!.currNode)
            setExpandedNodePath([result![0]!.currNode!])
        }
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
                <div className="mb-2">Destination: k</div>
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
                    nodeColor={(n: NodeObject) => NODE_COLOUR(n, currNode?.data ?? null, frontier.map(f => f.node.data), expandedNodePath.map(n => n.data))}
                    linkColor={(l: LinkObject) => LINK_COLOUR(l, expandedNodePath, frontier)}
                    nodeLabel="id"
                    linkDirectionalParticles={(l: LinkObject) => {
                        // Only show particles on current path edges
                        const sourceId = (l.source as NodeObject)?.id as string
                        const targetId = (l.target as NodeObject)?.id as string

                        for (let i = 0; i < expandedNodePath.length - 1; i++) {
                            if (expandedNodePath[i]?.data === sourceId && expandedNodePath[i + 1]?.data === targetId) {
                                return 1 // Show 1 particle on current path edges
                            }
                        }
                        return 0 // No particles on other edges
                    }}
                    linkDirectionalParticleSpeed={(l: LinkObject) => {
                        // Only set speed for current path edges
                        const sourceId = (l.source as NodeObject)?.id as string
                        const targetId = (l.target as NodeObject)?.id as string

                        for (let i = 0; i < expandedNodePath.length - 1; i++) {
                            if (expandedNodePath[i]?.data === sourceId && expandedNodePath[i + 1]?.data === targetId) {
                                return 0.03 / (l as any).weight // Set speed based on weight for current path
                            }
                        }
                        return 0 // No speed for other edges
                    }}
                    linkLabel={l => `w=${(l).weight}`}

                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.id as string
                        const fontSize = 20 / globalScale
                        ctx.font = `${fontSize}px Sans-Serif`
                        ctx.textAlign = 'center'
                        ctx.textBaseline = 'middle'
                        ctx.fillStyle = NODE_COLOUR(node, currNode?.data ?? null, frontier.map(f => f.node.data), expandedNodePath.map(n => n.data))
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

                        // Only draw the weight label, let the default linkColor handle the line
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



