class Dsu{
    constructor(n){
        this.parent = new Array(n);
        this.rank = new Array(n);
    }

    find(x){
        var v = x, next;
        while(this.parent[x]!=undefined){
            x = this.parent[x];
        }
        while(this.parent[v]!=undefined){
            next = this.parent[v];
            this.parent[v] = x;
            v = next;
        }
        return x;
    }

    union(x,y){
        x = this.find(x); this.rank[x] = this.rank[x] || 0;
        y = this.find(y); this.rank[y] = this.rank[y] || 0;
        if(x!=y){
            if(this.rank[x]<this.rank[y]){
                this.rank[x] += this.rank[y];
                this.parent[y] = x;
            }
            else{
                this.rank[y] += this.rank[x];
                this.parent[x] = y;
            }
        }
    }
}