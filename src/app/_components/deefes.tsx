export class TreeNode {
    public data: number
    public weight: number
    public left: TreeNode | null
    public right: TreeNode | null

    constructor(data: number, weight: number) {
        this.data = data
        this.weight = weight
        this.left = null
        this.right = null
    }

}

export class SearchTree {
    public root: TreeNode | null
    constructor(root?: TreeNode) {
        this.root = root || null
    }
}



const printFS = (curr: TreeNode) => {
    console.log(curr.data);

    if (curr.left) printFS(curr.left)
    if (curr.right) printFS(curr.right)

}
const dfs = (curr: TreeNode, goal: number, depth: number) => {
    if (curr.data === goal) return depth
    let found = -1
    if (curr.left) {
        found = dfs(curr.left, goal, depth + 1)
        if (found >= 0) return found
    }
    if (curr.right) {
        found = dfs(curr.right, goal, depth + 1)
        if (found >= 0) return found
    }

    return -1
}


const root = new TreeNode(4, 0)
const left = new TreeNode(1, 1)
const right = new TreeNode(5, 3)
const right2 = new TreeNode(10, 2)
const left2 = new TreeNode(0, 1)
const left3 = new TreeNode(2, 1)
const right3 = new TreeNode(7, 1)
const right4 = new TreeNode(12, 1)
const left4 = new TreeNode(6, 1)

root.left = left
root.right = right
right.right = right2
left.left = left2
left.right = left3
right.left = right3
right2.right = right4
right3.left = left4

const Tree = new SearchTree(root)


const bfs = (curr: TreeNode, goal: number, depth: number) => {
}
console.log(dfs(Tree.root!, 12, 0));

printFS(Tree.root!)
