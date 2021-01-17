

let projectiles = []
let targets = []

class target{
    constructor(x,y,t){
        this.x = x || Math.random()*canvas.width
        this.y = y || Math.random()*canvas.height
        this.t = t || Math.random()*Math.PI*2
        this.count = 0
        this.steerCount = 0
        this.steerConst = undefined
        this.steerWait = undefined
        this.steerSpeed = undefined
        this.speed = undefined
        this.childCount = 0
        this.childMax = 1 + Math.round(Math.random()*3)
        this.r = 10 + Math.random()*20
        this.reset = function(){ 
            this.steerCount = 0
            this.steerConst = Math.round(Math.random()) === 0 ? 1 : -1
            this.steerWait = 200 + Math.round(Math.random()*300)
            this.steerSpeed = 0.001 + Math.random()*0.005
            this.speed = 0.5 + Math.random()*2
        }
        this.reset()
        this.run = true
        this.sterile = false
        this.sizeLimited = true
        this.flagEnd = false
    }
    manageBorder(){
        if(this.x>canvas.width+this.r){this.x=-this.r}
        if(this.x<-this.r){this.x=canvas.width+this.r}
        if(this.y>canvas.height+this.r){this.y=-this.r}
        if(this.y<-this.r){this.y=canvas.height+this.r}
    }
    move(){
        this.x += this.speed * Math.cos(this.t)
        this.y -= this.speed * Math.sin(this.t) 
        this.manageBorder()
    }
    steer(){
        if(this.steerCount>this.steerWait){
            this.reset()
        }
        this.t += this.steerSpeed * this.steerConst
        this.steerCount++
    }
    birth(){
        targets.push(new target(this.x,this.y,this.t))
        targets[targets.length-1].childMax = this.childMax + 1
        this.childCount++
    }
    happen(){
        if(this.trueR()>canvas.width/2){this.flagEnd = true}
        if(this.run===false){return}
        if(this.count>800 && this.childCount < this.childMax && this.sterile===false){
           this.birth()
        }
        else{this.count++}
        this.steer()
        this.move()
    }
    trueR(){
        return this.r*(this.sizeLimited ? this.count/200>3 ? 3 : this.count/200  : this.count/20)
    }
    destruction(){
        for(let i=0; i<this.childMax*10;i++){
            targets.push(new target(this.x,this.y))
            targets[targets.length-1].sizeLimited = false
            targets[targets.length-1].sterile = true
        }
    }
    draw(){
        let col = `rgb(255,100,0,${this.count/200 < 1? this.count/200 : 1})`
        let r = this.trueR()
        circ(this.x,this.y,r,col)
    }

}

class projectile{
    constructor(x,y,t){
        this.x = x
        this.y = y
        this.t = t
        this.speed = 10
    }
    manageBorder(){
        return this.x>canvas.width || this.x<0 || this.y>canvas.height || this.y<0
    }
    move(){
        this.x += this.speed*Math.cos(this.t)
        this.y -= this.speed*Math.sin(this.t)
    }
    draw(){
        circ(this.x,this.y,2)
    }

}

class shooter{
    constructor(x,y,t){
        this.x = x || canvas.width/2
        this.y = y || canvas.height/2
        this.t = t || Math.PI/2
        this.height = 50
        this.baseSpeed = 3
        this.speed = 3
        this.boost = 5
        this.run = true
        this.destruct = false
        this.destructCount = 0;
        this.count = 0 
    }
    restart(){
        this.run = true
        this.destruct = false
        this.destructCount = 0;
        this.count = 0 
    }
    manageBorder(){
        if(this.x>canvas.width){this.x=0}
        if(this.x<0){this.x=canvas.width}
        if(this.y>canvas.height){this.y=0}
        if(this.y<0){this.y=canvas.height}
    }
    rotate(val){
        this.t += val
        if(this.t>Math.PI*2){this.t -= Math.PI*2}
        if(this.t<0){this.t+=Math.PI*2}
    }
    forward(){
        if(this.run===false){return}
        this.x += this.speed*Math.cos(this.t)
        this.y -= this.speed*Math.sin(this.t)
        this.manageBorder()
    }
    backward(){
        this.x -= this.speed*Math.cos(this.t)/2
        this.y += this.speed*Math.sin(this.t)/2
        this.manageBorder()
    }
    destruction(){
        this.destruct = true
    }
    draw(){
        let col = 'rgb(0,0,0)'
        if(this.destruct===true){
            if(this.destructCount>100){col = `rgba(0,0,0,0)`; return}
            col=`rgba(0,0,0,${1-this.destructCount/100})`;this.destructCount++
        }
        this.count++;
        triangle(this.x,this.y,this.height,this.t,0.5,col)
    }
}

let player = new shooter()
var endAll = false

const refresh =()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height)
    projectiles.forEach((e,i,a)=>{
        if(e.manageBorder() === true){a.splice(i,1); i--; return}
        e.move()
        e.draw()
    })
    targets.forEach((e,i,a)=>{
        let hit = false
        if(e.flagEnd === true){
            endAll = true
        }
        else if(distance(player.x,player.y,e.x,e.y) < (e.trueR()) && player.run ===true){
            player.run = false
            player.destruction()
            e.destruction()

        }
        projectiles.forEach((ele,ind,arr)=>{
            if(distance(e.x,e.y,ele.x,ele.y) < e.trueR()){
                hit = true; arr.splice(ind,1); ind--
            }
        })
        if(hit === true){
            if(targets.length<2){for(let i=0; i<e.childMax; i++){e.birth()}}
            a.splice(i,1); i--; return
        }
        e.happen()
        e.draw()
        
    })
    player.draw()
    player.forward()
}

refresh()


let keyState = {}
let mouseStillCount = 0;
const navBar = document.getElementById('nav')

document.addEventListener("keydown",(event)=>{
    keyState[event.code]=true
    if(event.code==='KeyB'){targets.push(new target())}
})
document.addEventListener("keyup",(event)=>{keyState[event.code]=false})
document.addEventListener("mousemove",()=>{
    navBar.style.opacity = 1
    mouseStillCount = 0
})

const playButton = document.getElementById('playButtonWrapper')
const playLogo = document.getElementById('playLogo')
const pauseLogo = document.getElementById('pauseLogo')
const restart = document.getElementById('restart')
let playGame = true

restart.addEventListener("click",()=>{
    if(endAll === false){return}
    targets = [new target(),new target(),new target(),new target(),new target(),new target()]
    player.restart()
    endAll = false
    gameLoop()
    endDiv.style.opacity=0
})

const collapsePause=()=>{
    playLogo.style.transform = 'scale(1)'
    pauseLogo.style.transform = 'scale(0)'
    playGame = false
}

const collapsePlay=()=>{
    playLogo.style.transform = 'scale(0)'
    pauseLogo.style.transform = 'scale(1)'
    playGame = true
}

playButton.addEventListener("click",()=>{ if(endAll===true){return}
    if(playGame===true){collapsePause()}else{collapsePlay()}})


let count = 0;

targets.push(new target(), new target(), new target(),new target(), new target(), new target())

const endDiv = document.getElementById('endDiv')
const score = document.getElementById('score')
const topScore = document.getElementById('topScore')

const gameLoop =()=>{
    if(endAll===true){
        endDiv.style.opacity = 1
        const finalScore = Math.round(player.count/100)
        score.innerHTML = finalScore
        if(finalScore>Number(topScore.innerHTML)){topScore.innerHTML = finalScore} 
        return
    }
    setTimeout(gameLoop,10)
    if(targets.length<5){
        len = 5-targets.length + Math.round(player.count/1000)
        for(let i=0; i<len; i++){targets.push(new target)}
    }
    if(playGame==false){return}
    if(mouseStillCount>500){navBar.style.opacity = 0}else{mouseStillCount++}
    if(keyState.KeyS===true){player.speed = player.boost}else{player.speed = player.baseSpeed}
    if(keyState.ArrowLeft===true){player.rotate(0.1)}
    if(keyState.ArrowRight===true){player.rotate(-0.1)}
    //if(keyState.ArrowUp===true){player.forward()}
    //if(keyState.ArrowDown===true){player.backward()}
    if(keyState.Space===true && count===0){projectiles.push(new projectile(player.x,player.y,player.t))}
    count++; if(count>SHOOT_WAIT){count = 0}
    refresh()
}

gameLoop()
