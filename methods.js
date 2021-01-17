
const circ=(x,y,r,col)=>{
    let xVal = x || Math.random()*canvas.width
    let yVal = y || Math.random()*canvas.height
    let rVal = r || 5
    let colVal = col || DEFAULT_COLOUR
    ctx.beginPath()
    ctx.arc(xVal,yVal,rVal,0,8)
    ctx.fillStyle= colVal
    ctx.fill()
}

const triangle=(x,y,height,theta,angle,col)=>{
    let x1 = x + (height/2)*Math.cos(theta)
    let y1 = y - (height/2)*Math.sin(theta)
    let r = (height/Math.cos(angle/2))
    let ang = theta+Math.PI-(angle/2)
    let x2 = x1 + r*Math.cos(ang)
    let y2 = y1 - r*Math.sin(ang)
    ang = theta+Math.PI+(angle/2)
    let x3 = x1 + r*Math.cos(ang)
    let y3 = y1 - r*Math.sin(ang)
    ctx.beginPath()
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.lineTo(x3,y3)
    ctx.fillStyle = col
    ctx.fill()
    
}

const distance=(x1,y1,x2,y2)=>{
    return Math.sqrt(((x1-x2)*(x1-x2))+((y1-y2)*(y1-y2)))
}



