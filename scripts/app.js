function create_board(){
    var canvas = document.getElementById("canvas");
    var w = canvas.width, h = canvas.height;

    var acmR=0, acmB=0;
    var r = 10*(w/400), d = 40*(w/400);
    var left = (w-8*d)/2;
    var top = (h-8*d)/2;

    dots = new Array(9);
    for(let i=0;i<9;i++){
        dots[i] = new Array(9);
    }

    for(let j=0;j<9;j++){
        for(let i=0;i<9;i++){    
            if(i%2!==j%2){
                var circle = new Circle(canvas,d*j+left,d*i+top,r,((j%2) ? acmR++ : acmB++),((j%2) ? "red" : "black"));    
                dots[i][j] = circle;
                circle.radial_animation();
            }
        }    
    }
    return dots;
}

function draw_line(c1,c2,ratio){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 4*(canvas.width/400);
        ctx.strokeStyle = c1.color;
        ctx.beginPath();
        ctx.moveTo(c1.x,c1.y);
        ctx.lineTo(c1.x+ratio*(c2.x-c1.x),c1.y+ratio*(c2.y-c1.y));
        ctx.stroke();
    }
}

function animate_line(c1,c2,ratio){
    ratio = ratio || 0;
    draw_line(c1,c2,ratio);
    if(ratio<1){
        requestAnimationFrame(()=>{animate_line(c1,c2,ratio+.05)});
    }
}


function intersect(circle, mouse){
    return ((circle) ? ((circle.x-mouse.x)**2+(circle.y-mouse.y)**2 < circle.r**2) : false);
}

function click_event(dict,turn,e){
    var rect = document.getElementById("canvas").getBoundingClientRect();
    var mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top};
    if(!turn.last_clicked){
        i = ((turn.player!="red") ? 1 : 0);
        for(i;i<9;i+=2){
            for(j = (i+1)%2;j<9;j+=2){
                if(intersect(dict[i][j],mouse)){
                    turn.last_clicked = {i: i,j: j};

                    turn.candidates = [];
                    for(k of [-2,2]){
                        if(dict[i+k] && dict[i+k][j]){
                            turn.candidates.push({i: i+k,j: j});
                        }
                        if(dict[i][j+k]){
                            turn.candidates.push({i: i,j: j+k});
                        }
                    }

                    dict[i][j].erase();
                    dict[i][j].radial_animation(0,"blue");
                    break;
                }
            }
        }
        return;
    }

    var li = turn.last_clicked.i, lj = turn.last_clicked.j;
    for(let v of turn.candidates){
        let i  = v.i, j = v.j;
        if(intersect(dict[i][j], mouse) && dict[(i+li)/2][(j+lj)/2]==undefined){
            dict[li][lj].draw();
            dict[i][j].draw();
            animate_line(dict[li][lj],dict[i][j]);

            dict[(i+li)/2][(j+lj)/2] = 0;
            turn.dsu[turn.player].union(dict[li][lj].id,dict[i][j].id);

            if(turn.dsu[turn.player].find(0)==turn.dsu[turn.player].find(19)){
                alert(turn.player+" venceu!")
            }

            if(turn.player=="red"){
                if(li==i){
                    last_move = {x: (dict[li+1]) ? dict[li+1][(j+lj)/2].id : undefined ,y: (dict[li-1]) ? dict[li-1][(j+lj)/2].id : undefined }
                }
                else{
                    last_move = {x: (dict[(li+i)/2][j-1]) ? dict[(li+i)/2][j-1].id :undefined ,y: (dict[(li+i)/2][j+1]) ? dict[(li+i)/2][j+1].id : undefined }
                }
            }

            turn.player = ((turn.player=="red") ? "black" :"red");
            turn.last_clicked = undefined;
            turn.candidates = undefined;
            
            if(turn.player=="black"){
                bot_test(last_move);
            }

            return;
        }
    }
    if(intersect(dict[li][lj],mouse)){
        dict[li][lj].draw();
        turn.last_clicked = undefined;
        turn.candidates = undefined;
    }
        
}



function make_move(c1,c2){
    c1.draw();
    c2.draw();
    
    union(c1, c2)
}

function bot_make_move(next_move){
    var blackDots = [];
    var dict = dots;
    for(let k=0;k<9;k++){
        for(let l=0;l<9;l++){
            if(k%2!=l%2 && dots[l][k].color=="black"){
                blackDots.push({x: l, y: k});
            }
        }
    }
    var i = blackDots[next_move.x].x, li = blackDots[next_move.y].x, j = blackDots[next_move.x].y, lj = blackDots[next_move.y].y;
    turn.dsu[turn.player].union(next_move.x,next_move.y);
    dict[(i+li)/2][(j+lj)/2] = 0;
    animate_line(dict[li][lj],dict[i][j]);
    if(turn.dsu[turn.player].find(0)==turn.dsu[turn.player].find(19)){
        alert(turn.player+" venceu!")
    }

    turn.player = "red";
}

function bot_test(last_move){
    //select move
    last_move.x = ((last_move.x<4) ? 0 : (last_move.x>=16) ?  19 : last_move.x)
    last_move.y = ((last_move.y<4) ? 0 : (last_move.y>=16) ?  19 : last_move.y)

    var i = last_move.x;
    var j = last_move.y;
    var a  = new Dsu(20);
    var blackDots = []
    var t
    if(i==undefined||j==undefined){
        turn.player = "red"
        return;
    }
    for(let k=0;k<9;k++){
        for(let l=0;l<9;l++){
            if(k%2!=l%2 && dots[l][k].color=="black"){
                blackDots.push({x: l, y: k});
            }
        }
    }
    
    
    //find out in which tree the edge is
    t = ((t1[i].indexOf(j)!=-1) ? t1 : (t2[i].indexOf(j)!=-1) ? t2 : undefined)

    //remove the edge
    t[i].splice(t[i].indexOf(j),1)
    t[j].splice(t[j].indexOf(i),1)

    //construct a dsu
    for(let i=0;i<4;i++){
        a.union(0,0+i);
        a.union(19,19-i)
    }
    for(let k=4;k<16;k++){
        for(l of t[k]){
            a.union(k, l);
        }
    }

    var next_move = undefined;
    for(let k=0;k<16 && next_move==undefined;k++){
        if(k%4!=3 && a.find(k)!=a.find(k+1) && dots[(blackDots[k].x+blackDots[k+1].x)/2][(blackDots[k].y+blackDots[k+1].y)/2]==undefined){
            next_move = {x: k, y: k+1};
        }
        if(a.find(k)!=a.find(k+4) && dots[(blackDots[k].x+blackDots[k+4].x)/2][(blackDots[k].y+blackDots[k+4].y)/2]==undefined){
            next_move = {x: k, y: k+4};
        }
    }
    console.log(a.parent)
    console.log(a.find(4)+" "+a.find(5))
    console.log(next_move)
    bot_make_move(next_move)

    next_move.x = ((next_move.x<4) ? 0 : (next_move.x>=16) ?  19 : next_move.x)
    next_move.y = ((next_move.y<4) ? 0 : (next_move.y>=16) ?  19 : next_move.y)
    t[next_move.x].push(next_move.y)
    t[next_move.y].push(next_move.x)
}

function max(a,b){
    return (a<b) ? b : a;
}

function min(a,b){
    return (a>b) ? b : a;
}

//(function (){
    var dots = create_board(); 
    var turn = {player: "black",last_clicked: undefined, candidates: undefined, dsu: {black: new Dsu(20), red: new Dsu(20)}};
    for(let i=0;i<4;i++){
        turn.dsu.red.union(0,0+5*i);
        turn.dsu.red.union(19,19-5*i);
        turn.dsu.black.union(0,0+i);
        turn.dsu.black.union(19,19-i)
    }
    document.getElementById("canvas").addEventListener("click",(e)=>click_event(dots,turn,e));
//})()

t1 = [-1,-1,-1,-1,0,0,0,0,4,5,6,10,8,9,13,14,12,12,12,12]
t2 = [-1,-1,-1,-1,5,6,7,15,9,10,14,15,13,19,19,19,0,0,0,0]
last_move = {x: 0, y: 19}

t1 = [[7], undefined, undefined, undefined, [5], [4, 6], [5, 10], [0, 11], [9], [8, 13], [6, 14], [7, 15], [19], [9, 19], [10, 19], [11, 19], undefined, undefined, undefined, [12,13,14,15]]
t2 = [[4, 5, 6, 19], undefined, undefined, undefined, [0, 8], [0, 9], [0, 7], [6], [4, 12], [5, 10],[9, 11], [10], [8,13], [12,14],[13,15],[14],undefined, undefined, undefined, [0]]

bot_test(last_move)