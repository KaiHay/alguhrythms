
export class TreeNode {
    public data: number
    public left: TreeNode | null
    public right: TreeNode | null

    constructor(data: number) {
        this.data = data
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



const root = new TreeNode(4)
const left = new TreeNode(1)
const right = new TreeNode(5)
const right2 = new TreeNode(10)
root.left = left
root.right = right
right.right = right2
const Tree = new SearchTree(root)

const printFS = (curr: TreeNode) => {
    console.log(curr.data);

    if (curr.left) printFS(curr.left)
    if (curr.right) printFS(curr.right)

}
const dfs = (curr: TreeNode, goal: number, depth: number) => {
    if(curr.data===goal) return depth
    let found = -1
    if (curr.left) {
        found=dfs(curr.left, goal, depth+1)
        if(found>=0) return found
    }
    if (curr.right) {
        found=dfs(curr.right, goal, depth+1)
        if(found>=0) return found
    }

    return -1





}
console.log(dfs(Tree.root!, 10, 0));

printFS(Tree.root!)