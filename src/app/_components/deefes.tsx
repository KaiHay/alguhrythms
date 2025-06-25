
export class TreeNode{
    public data: number
    public left: TreeNode|null
    public right: TreeNode|null

    constructor(data:number){
        this.data=data
        this.left=null
        this.right=null
    }

}

export class SearchTree{
    public root: TreeNode |null
    constructor(root?:TreeNode){
        this.root=root||null
    }
}



const root = new TreeNode(4)
const left = new TreeNode(1)
const right= new TreeNode(5)
root.left= left
root.right= right
const Tree = new SearchTree(root)

const printFS = (curr: TreeNode) =>{
    console.log(curr.data);
    
    if(curr.left) printFS(curr.left)
    if(curr.right) printFS(curr.right)
    
}
const dfs = () => {

}

printFS(Tree.root)