'use client'
import { GraphNode, ucs, printPath } from "./_components/ucs"
import { useRef, useEffect, useState } from 'react'
import ForceGraph2D, { type ForceGraphMethods, type LinkObject } from 'react-force-graph-2d'
import { UniCS2 } from "./_components/ucs2"
//RENDER THE GRAPH ON THE SCREEN


const a = new GraphNode('a')
const b = new GraphNode('b')
const c = new GraphNode('c')
const d = new GraphNode('d')
const e = new GraphNode('e')
const f = new GraphNode('f')
const g = new GraphNode('g')
const h = new GraphNode('h')
const i = new GraphNode('i')
const j = new GraphNode('j')
const k = new GraphNode('k')

a.neighbors.push({ node: b, weight: 2 })
a.neighbors.push({ node: c, weight: 3 })

b.neighbors.push({ node: d, weight: 4 })
b.neighbors.push({ node: e, weight: 1 })

c.neighbors.push({ node: e, weight: 2 })

e.neighbors.push({ node: f, weight: 2 })
f.neighbors.push({ node: g, weight: 2 })
i.neighbors.push({ node: h, weight: 2 })
c.neighbors.push({ node: i, weight: 2 })
i.neighbors.push({node: j, weight:10})
i.neighbors.push({node: k, weight:7})
const result = ucs(a, 'last')

const data = toGraph(a)
export default function GraphView() {
    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ForceGraph2D
                graphData={data}
                linkWidth={(l: LinkObject) => (l as any).weight}
                linkDirectionalArrowLength={4}
                nodeAutoColorBy="id"
                nodeLabel="id"
                linkDirectionalParticles={1}
                linkDirectionalParticleSpeed={(l: LinkObject) => (0.03/(l as any).weight)}
                linkLabel={l => `w=${(l as any).weight}`}
            />
        </div>
    );
}
function toGraph(root: GraphNode) {
    const nodes: { id: string }[] = []
    const links: { source: string, target: string, weight: number }[] = []
    const seen = new Set<GraphNode>();

    (function dfs(n: GraphNode) {
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





