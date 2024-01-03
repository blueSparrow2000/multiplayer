// backend 
// constants
const TICKRATE = 15 // ms
const SCREENWIDTH = 1024//1920//
const SCREENHEIGHT = 576//1080//

// player attributes
const INVENTORYSIZE = 4
const PLAYERRADIUS = 10 //16
const PLAYERSPEED = 3 // pixel
const PLAYERHEALTH = 3
const PLAYERHEALTHMAX = 6
const GUNHEARRANGE = 500
//to check if there exists any player left
let USERCOUNT = [0]

// for bullets
const FRICTION = 0.992

// for guns
const LASERDURATION = 40
const LASERWIDTH = 5

// enemy setting (manual)
const SPAWNENEMYFLAG = true

const GROUNDITEMFLAG = true 


const itemTypes = ['gun','consumable','ammo', 'melee']

/*Adding a new gun: add to list gunInfo and add sound of a gun to sound/ and reloadSound/ folders!*/
// const PROJECTILESPEED = 20 
// proj speed limit for rad 3.5 (.45ACP): ~ 30? 
// proj speed limit for rad 5 (5mm): 20 ~ 42
// proj speed limit for rad 7 (7mm): ~ 52
const gunInfo = {
'railgun':{travelDistance:0, damage: 1, shake:0, num: 1, fireRate: 1000, projectileSpeed:0, magSize:2, reloadTime: 1800, ammotype:'battery', size: {length:50, width:5}},

'Mosin-Nagant':{travelDistance:2200, damage: 6, shake:0, num: 1, fireRate: 1600, projectileSpeed:52, magSize: 5, reloadTime: 4000, ammotype:'7', size: {length:42, width:4}}, 
'mk14':{travelDistance:1200, damage: 2, shake:1, num: 1, fireRate: 600, projectileSpeed:32, magSize:14, reloadTime: 3300, ammotype:'7', size: {length:32, width:3} }, 
'SLR':{travelDistance:1600, damage: 2.5, shake:1, num: 1, fireRate: 350, projectileSpeed:42, magSize: 10, reloadTime: 2700, ammotype:'7', size: {length:38, width:3}}, 

'pistol':{travelDistance:400, damage: 0.5, shake:3, num: 1, fireRate: 300, projectileSpeed:20, magSize:15, reloadTime: 1100, ammotype:'5', size: {length:17, width:3}}, 
'M249':{travelDistance:750, damage: 0.5, shake:1, num: 1, fireRate: 75, projectileSpeed:24, magSize:150, reloadTime: 7400, ammotype:'5', size: {length:28, width:6}},
'VSS':{travelDistance:900, damage: 0.5, shake:1, num: 1, fireRate: 100, projectileSpeed:26, magSize:10, reloadTime: 2300, ammotype:'5' , size: {length:27, width:2}}, 
'ak47':{travelDistance:600, damage: 0.5, shake:1, num: 1, fireRate: 100, projectileSpeed:28, magSize:30, reloadTime: 1000, ammotype:'5', size: {length:28, width:3}}, 
'FAMAS':{travelDistance:500, damage: 0.5, shake:2, num: 1, fireRate: 80, projectileSpeed:22, magSize: 30, reloadTime: 3200, ammotype:'5', size: {length:22, width:2}}, 

's686':{travelDistance:260, damage: 1, shake:5, num: 6, fireRate: 180, projectileSpeed:15, magSize:2, reloadTime: 1200, ammotype:'12', size: {length:13, width:5}},
'DBS':{travelDistance:300, damage: 1, shake:3, num: 3, fireRate: 400, projectileSpeed:18, magSize:14, reloadTime: 6000, ammotype:'12', size: {length:16, width:5}},
'usas12':{travelDistance:400, damage: 1, shake:3, num: 2, fireRate: 180, projectileSpeed:20, magSize:5, reloadTime: 2300, ammotype:'12', size: {length:18, width:4}},

'ump45':{travelDistance:580, damage: 0.25, shake:2, num: 1, fireRate: 90, projectileSpeed:18, magSize:25, reloadTime: 2800, ammotype:'45', size: {length:19, width:4}},
'vector':{travelDistance:400, damage: 0.25, shake:1, num: 1, fireRate: 50, projectileSpeed:20, magSize:19, reloadTime: 2600, ammotype:'45', size: {length:18, width:3}},
'mp5':{travelDistance:500, damage: 0.25, shake:1, num: 1, fireRate: 70, projectileSpeed:22, magSize:30, reloadTime: 2100, ammotype:'45', size: {length:20, width:3}},


'fist':{travelDistance:12, damage: 0.1, shake:0, num: 1, fireRate: 300, projectileSpeed:3, magSize:0, reloadTime: 0, ammotype:'bio', size: {length:12, width:2}},
'knife':{travelDistance:15, damage: 0.5, shake:0, num: 1, fireRate: 500, projectileSpeed:3, magSize:0, reloadTime: 0, ammotype:'sharp', size: {length:14, width:1}},
'bat':{travelDistance:18, damage: 1, shake:0, num: 1, fireRate: 800, projectileSpeed:3, magSize:0, reloadTime: 0, ammotype:'hard', size: {length:18, width:1.5}},
}

const meleeTypes = ['fist','knife', 'bat']

// player will hold these
const defaultGuns = []//['pistol','usas12','ak47','SLR'] 


const ammoTypes = ['45','5','7','12','battery', 'bio', 'sharp', 'hard'] // ammo type === ammo name // fist sharp hard are place holders
const ammoInfo = {
'45':{color:'blue',size:{length:12, width:12}, amount:50, radius:3.5},
'5':{color:'green',size:{length:12, width:12}, amount:50, radius:5},
'7':{color:'yellow',size:{length:12, width:12}, amount:20, radius:7},
'12':{color: 'red',size:{length:12, width:12}, amount:14, radius:4},
'battery':{color: 'gray',size:{length:12, width:12}, amount:4, radius:0},

'bio':{color: 'black',size:{length:5, width:5}, amount:'inf', radius:10},
'sharp':{color: 'black',size:{length:10, width:10}, amount:'inf', radius:11},
'hard':{color: 'black',size:{length:15, width:15}, amount:'inf', radius:15},
}

const consumableTypes = ['bandage','medkit']
const consumableInfo = {
'bandage': {size:{length:10, width:10}, color: 'gray', healamount: 1 },
'medkit': {size:{length:16, width:16}, color: 'gray', healamount: PLAYERHEALTHMAX},
}




// library
const collide = require('line-circle-collision')

const express = require('express')
const app = express()

// socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io');
const io = new Server(server,{pingInterval:2000, pingTimeout:5000}); // timeout 5 seconds

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})



// player data saved here
const backEndEnemies = {}
const backEndPlayers = {}
const deadPlayerPos = {}
const backEndProjectiles = {}
const backEndDrawables = {}
const backEndItems = {}
const backEndObjects = {}
let objectId = 0
let enemyId = 0
let itemsId = 0
let projectileId = 0
let drawableId = 0


const objectTypes = ['wall', 'hut']
// object format
// const objectInfos = {
// 'wall': {start:{x:,y:}, end:{x:,y:}, width:, color: , health: },
// 'hut': {center:{x:,y:}, radius: 20, color:, health:}
// }


// safely create object
function makeObjects(objecttype, health, objectinfo){
  objectId++

  let objectsideforbackend = {}

  if (objecttype === 'wall'){
    if (objectinfo.orientation==='vertical'){
      objectsideforbackend = {
        left: objectinfo.start.x - objectinfo.width/2,
        right: objectinfo.start.x + objectinfo.width/2,
        top: objectinfo.start.y,
        bottom: objectinfo.end.y,
        centerx: objectinfo.start.x, // same with end.x
        centery: ( objectinfo.start.y + objectinfo.end.y )/2
      }
    }else if(objectinfo.orientation==='horizontal'){
      objectsideforbackend = {
        left: objectinfo.start.x,
        right: objectinfo.end.x,
        top: objectinfo.start.y - objectinfo.width/2,
        bottom: objectinfo.start.y + objectinfo.width/2,
        centerx: ( objectinfo.start.x + objectinfo.end.x )/2,
        centery: objectinfo.start.y // same with end.y
      }
    }

  }
  //console.log(`new obj ID: ${objectId}`)

  backEndObjects[objectId] = {
    objecttype , myID:objectId, deleteRequest:false, health, objectinfo, objectsideforbackend
  }
}

function safeDeleteObject(id){
  //console.log(`obj removed ID: ${id}`)
  delete backEndObjects[id]
}

function borderCheckWithObjects(entity, entityList, entityId){
  const entitySides = {
    left: entity.x - entity.radius,
    right: entity.x + entity.radius,
    top: entity.y - entity.radius,
    bottom: entity.y + entity.radius
  }
  for (const id in backEndObjects){
    const obj = backEndObjects[id]

    if (obj.objecttype === 'wall'){
      const objSides = obj.objectsideforbackend

      // LR check (hori)
      if (objSides.top < entity.y && entity.y < objSides.bottom){
        if (objSides.centerx < entity.x && entitySides.left < objSides.right){ // restore position for backend
          entityList[entityId].x = entity.radius + objSides.right
        }
        if (objSides.centerx >= entity.x && entitySides.right > objSides.left){ // restore position for backend
          entityList[entityId].x = objSides.left - entity.radius
        }
      } 

      //TB check (verti)
      if (objSides.left < entity.x && entity.x < objSides.right){
        if (objSides.centery < entity.y && entitySides.top < objSides.bottom){ // restore position for backend
          entityList[entityId].y = objSides.bottom + entity.radius
        }
        if (objSides.centery >= entity.y && entitySides.bottom > objSides.top){ // restore position for backend
          entityList[entityId].y = objSides.top - entity.radius
        }
      }

    } 
    // you can go inside the hut. so no collision detection
    // else if (obj.objecttype === 'hut'){// check distance if hut
    //  
    // }
  }

}

// build objects - orientation is not used in frontend. just for collision detection
makeObjects("wall", 60, {orientation: 'vertical',start:{x:SCREENWIDTH/2,y:SCREENHEIGHT/2 + 150}, end:{x:SCREENWIDTH/2,y:SCREENHEIGHT - 21}, width:20, color: 'gray'})

makeObjects("wall", 60, {orientation: 'horizontal',start:{x:SCREENWIDTH/2+150,y:SCREENHEIGHT-100}, end:{x:SCREENWIDTH - 21,y:SCREENHEIGHT-100}, width:20, color: 'gray'})

makeObjects("hut", 6, {center:{x:100,y:400}, radius: 30, color:'gray'})





// fist is item id 0 fixed globally
backEndItems[0] = {
  itemtype: 'melee', groundx:0, groundy:0, size:{length:5, width:5}, name:'fist', color:'black', iteminfo:{ammo:'inf', ammotype:'bio'} ,onground:false, myID: 0, deleteRequest:false
}


function makeNdropItem(itemtype, name, groundx, groundy,onground=true){
  itemsId++
  let size
  let color
  let iteminfo 

  //different value
  if (itemtype === 'gun'){
    //console.log(name)
    size = gunInfo[name].size
    color = 'white'
    const ammo = 0
    const ammotype = gunInfo[name].ammotype // 7mm
    iteminfo = {ammo,ammotype}

  } else if(itemtype === 'ammo'){
    size = ammoInfo[name].size
    color = ammoInfo[name].color
    const amount = ammoInfo[name].amount
    const ammotype = name // 7mm
    iteminfo = {amount,ammotype}
  } else if(itemtype === 'consumable'){
    size = consumableInfo[name].size
    color = consumableInfo[name].color
    const amount = 1
    const healamount = consumableInfo[name].healamount
    iteminfo =  {amount,healamount}

  } else if(itemtype === 'melee'){
    size = gunInfo[name].size
    color = 'black'
    const ammo = 'inf'
    const ammotype = gunInfo[name].ammotype // 7mm
    iteminfo = {ammo,ammotype}
    //console.log("Melee weapon is work in progress...")

  } else{
    console.log("invalid itemtype requested in makeNdropItem")
    return 
  }


  backEndItems[itemsId] = {
    itemtype, name, groundx, groundy, size, color, iteminfo, onground, myID: itemsId, deleteRequest:false
  }
}


// item spawn
if (GROUNDITEMFLAG){
  const groundgunList = ['railgun', 'Mosin-Nagant', 'mk14', 'SLR',    'VSS', 'M249', 'ak47', 'FAMAS',    's686','DBS', 'usas12',     'ump45','vector','mp5']
  const groundGunAmount = groundgunList.length
  for (let i=0;i<groundGunAmount; i++){
    makeNdropItem('gun', groundgunList[i], SCREENWIDTH/2 + Math.round(60*(i - groundGunAmount/2)), SCREENHEIGHT/2 )
  }
  
  const groundAmmoList = ['45','5','7','12','battery']
  const groundAmmoAmount = groundAmmoList.length
  for (let i=0;i<groundAmmoAmount; i++){
    makeNdropItem( 'ammo', groundAmmoList[i], SCREENWIDTH/2 + Math.round(50*(i - groundAmmoAmount/2)), SCREENHEIGHT/2 + 100)
  }
  
  const groundConsList = ['bandage','bandage','bandage','bandage','bandage','medkit']
  const groundConsAmount = groundConsList.length
  for (let i=0;i<groundConsAmount; i++){
    makeNdropItem('consumable', groundConsList[i], SCREENWIDTH/2 + Math.round(50*(i - groundConsAmount/2)), SCREENHEIGHT/2 - 100)
  }

  const groundMeleeList = ['knife','bat']
  const groundMeleeAmount = groundMeleeList.length
  for (let i=0;i<groundMeleeAmount; i++){
    makeNdropItem('melee', groundMeleeList[i], SCREENWIDTH/2 + Math.round(50*(i - groundMeleeAmount/2)), SCREENHEIGHT/2 - 200)
  }

}






function safeDeletePlayer(playerId){
  // drop all item before removing
  const inventoryItems = backEndPlayers[playerId].inventory
   
  for (let i=0;i<inventoryItems.length;i++){
    const curitemID = inventoryItems[i].myID
    if (curitemID===0){ // no fist
      continue
    }
    backEndItems[curitemID].onground = true
    backEndItems[curitemID].groundx = backEndPlayers[playerId].x + (Math.random() - 0.5)*100
    backEndItems[curitemID].groundy = backEndPlayers[playerId].y + (Math.random() - 0.5)*100
  }

  deadPlayerPos[playerId] = {x:backEndPlayers[playerId].x,y:backEndPlayers[playerId].y}

  delete backEndPlayers[playerId]
}


// player spawn
io.on('connection', (socket) => {
  console.log('a user connected');


  // broadcast
  io.emit('updatePlayers',backEndPlayers) // socket.emit speaks to that player only

  // give server info to a frontend
  socket.emit('serverVars', {gunInfo, ammoInfo, PLAYERSPEED})

  // projectile spawn
  socket.on('shoot',({x,y,angle, mousePos, currentGun,playerIdEXACT}) => {
    const gunName = currentGun
    
    if (gunName==='railgun'){
      drawableId++

      // collision detection with a line (hitscan) - players
      for (const playerId in backEndPlayers) {
        const backEndPlayer = backEndPlayers[playerId]
        // collide line
        let collisionDetected = collide([x,y], [mousePos.x,mousePos.y], [backEndPlayer.x, backEndPlayer.y], backEndPlayer.radius+LASERWIDTH)

        if ((playerIdEXACT !== playerId) && collisionDetected) {
          //console.log(`${backEndPlayers[playerIdEXACT].username} shot ${backEndPlayer.username} a railgun!`)
          // who got hit
          if (backEndPlayers[playerId]){ // safe
            if (backEndPlayers[playerId].health <= 0){ // who got shot
              // who shot projectile
              if (backEndPlayers[playerIdEXACT]){ // safe
                backEndPlayers[playerIdEXACT].score ++
              }
              safeDeletePlayer(playerId)
            } else {
              backEndPlayers[playerId].health -= gunInfo['railgun'].damage;
              if (backEndPlayers[playerId].health <= 0){               // who shot projectile
                if (backEndPlayers[playerIdEXACT]){ // safe
                  backEndPlayers[playerIdEXACT].score ++
                }; safeDeletePlayer(playerId)} //check again
            }
          }
          // projectile is not added! so dont delete
          //delete backEndProjectiles[id] 
          //break // multiple enemy can be hit by railgun!
        }
      }

      // collision detection with a line (hitscan) - enemies
      for (const enemyId in backEndEnemies) {
        const backEndEnemy = backEndEnemies[enemyId]
        let collisionDetected = collide([x,y], [mousePos.x,mousePos.y], [backEndEnemy.x, backEndEnemy.y], backEndEnemy.radius+LASERWIDTH)

        if (collisionDetected) {
          // who got hit
          if (backEndEnemies[enemyId]){ // safe
            if (backEndEnemies[enemyId].health <= 0){ // who got shot
              safeDeleteEnemy(enemyId)
            } else {
              backEndEnemies[enemyId].health -= gunInfo['railgun'].damage
              if (backEndEnemies[enemyId].health <= 0){ //check again
                safeDeleteEnemy(enemyId)} 
            }
          }
        }
      }

      backEndDrawables[drawableId] = {
        start:{x,y},end: mousePos, playerIdEXACT, linewidth: LASERWIDTH, duration: LASERDURATION
      }
      // for railgun effect and particles
      io.emit('updateDrawables',{backEndDrawables,GUNHEARRANGE})
      io.emit('updatePlayers',backEndPlayers)
      io.emit('updateEnemies',backEndEnemies)
      // only railgun hitscan finished
    } else {
      function addProjectile(){
        projectileId++
        // calculate vel with angle
        const shakeProj = gunInfo[currentGun].shake
        const bulletSpeed = gunInfo[currentGun].projectileSpeed
        const velocity = { // with shake!
          x: Math.cos(angle) * bulletSpeed + (Math.random()-0.5) * shakeProj,
          y: Math.sin(angle) * bulletSpeed + (Math.random()-0.5) * shakeProj
        }
        const speed = Math.hypot(velocity.x,velocity.y)
        const radius = ammoInfo[gunInfo[currentGun].ammotype].radius//PROJECTILERADIUS
    
        const travelDistance = gunInfo[currentGun].travelDistance
        const projDamage =  gunInfo[currentGun].damage
    
        backEndProjectiles[projectileId] = {
          x,y,radius,velocity, speed, playerId: socket.id, gunName, travelDistance, projDamage
        }
        //console.log(backEndProjectiles) // finished adding a projectile
      }
      
      for (let i=0;i< gunInfo[gunName].num;i++){
        addProjectile()
      }

    }
  })

  // initialize game when clicking button (submit name)
  socket.on('initGame',({username,width,height})=>{
    // initialize inventory with fist
    let inventory =  new Array(INVENTORYSIZE).fill().map(() => (backEndItems[0])) // array points to references - fist can be shared for all players

    // default item for a player if exists
    for (let i=0;i<defaultGuns.length; i++){
      makeNdropItem('gun', defaultGuns[i], SCREENWIDTH/2 , SCREENHEIGHT/2,onground=false)
      // itemsId++
      // const itemtype = 'gun' //  gun ammo consumable
      // const groundx = SCREENWIDTH/2 
      // const groundy = SCREENHEIGHT/2 + Math.round(100*(i - defaultGuns.length/2))
      // const name = defaultGuns[i]
      // const size = gunInfo[name].size
      // const color = 'white'

      // const ammo = 0//gunInfo[name].magSize // preloaded
      // const ammotype = gunInfo[name].ammotype // 7mm
      // backEndItems[itemsId] = {
      //   itemtype, groundx, groundy, size, name, color,iteminfo:{ammo,ammotype}, onground:false, myID: itemsId,deleteRequest:false
      // }
      inventory[i] = backEndItems[itemsId]
    }

    // makes a player here!
    backEndPlayers[socket.id] = {
      x:SCREENWIDTH * Math.random(),
      y:SCREENHEIGHT * Math.random(),
      color: `hsl(${Math.random()*360},100%,70%)`,
      radius: PLAYERRADIUS,
      sequenceNumber: 0, // canvas attribute is initialized when initCanvas
      score: 0,
      health: PLAYERHEALTH,
      username,
      inventory, // size 4
      currentSlot: 1, // 1~4
      mousePos: {x:SCREENWIDTH/2,y:SCREENHEIGHT/2}
    }

   
    // where we init our canvas
    backEndPlayers[socket.id].canvas = {
      width,
      height
    }
    // initailize player radius
    backEndPlayers[socket.id].radius = PLAYERRADIUS

    // request enemy
    USERCOUNT[0]++
    console.log(`User on the server: ${USERCOUNT[0]}`)
  })


  // player death => put ammos to the ground!
  socket.on('playerdeath',({playerId, playerammoList})=>{
    if (!deadPlayerPos[playerId]){return}
    //console.log(playerammoList)
    for (const ammoT in ammoTypes){
      // make item
      const name = ammoTypes[ammoT]
      const ammoinfoamt = ammoInfo[name].amount
      if (ammoinfoamt==='inf'){ // melee weapon's ammo => dont show!
        continue
      }

      const itemtype = 'ammo' //  gun ammo consumable
      const groundx = deadPlayerPos[playerId].x + (Math.random() - 0.5)*200
      const groundy = deadPlayerPos[playerId].y + (Math.random() - 0.5)*200
      const size = ammoInfo[name].size
      const color = ammoInfo[name].color
      const amount = playerammoList[name]
      if (amount <=0) { // no ammo than dont make it
        continue
      }
      const ammotype = name // 7mm

      itemsId++
      backEndItems[itemsId] = {
        itemtype, groundx, groundy, size, name, color,iteminfo:{amount,ammotype}, onground:true,myID: itemsId, deleteRequest:false
      }
    }
    delete deadPlayerPos[playerId]

  })



  // eat
  socket.on('consume',({itemName,playerId,healamount,deleteflag, itemid,currentSlot}) => {
    function APIdeleteItem(){
      // change player current holding item to fist
      backEndPlayers[playerId].inventory[currentSlot-1] = backEndItems[0]
      // delete safely
      backEndItems[itemid].deleteflag = deleteflag
      //delete backEndItems[itemid]
    }

    if (itemName === 'medkit'){
      backEndPlayers[playerId].health = PLAYERHEALTHMAX
      APIdeleteItem()
    } else if (backEndPlayers[playerId].health + healamount <= PLAYERHEALTHMAX){
      backEndPlayers[playerId].health += healamount
      APIdeleteItem()
    }
    

  })



  // change gound item info from client side
  socket.on('updateitemrequest', ({itemid, requesttype,currentSlot=1, groundx=0, groundy=0, playerId=0})=>{
    let itemToUpdate = backEndItems[itemid]
    if (requesttype==='deleteammo'){
      itemToUpdate.onground = false
      itemToUpdate.deleteRequest = true
    } else if (requesttype === 'pickupinventory'){
      itemToUpdate.onground = false
      backEndPlayers[playerId].inventory[currentSlot-1] = backEndItems[itemid]// reassign item (only me)
      //console.log(backEndPlayers[playerId].inventory[currentSlot-1].myID)
    } 
  })

  socket.on('updateitemrequestDROP', ({itemid, requesttype,currentSlot=1, groundx=0, groundy=0, playerId=0})=>{
    let itemToUpdate = backEndItems[itemid]
    if(requesttype==='dropitem' || (!itemid)){ // not fist
      itemToUpdate.onground = true
      itemToUpdate.groundx = groundx
      itemToUpdate.groundy = groundy
      //console.log(`dropped: ${itemToUpdate.name}`)
    }

  })


  // hear player's mouse pos changes
  socket.on('playermousechange', ({x,y})=>{
    if (!backEndPlayers[socket.id]) {return}
    backEndPlayers[socket.id].mousePos = {x,y}
  })


  // remove player when disconnected (F5 etc.)
  socket.on('disconnect',(reason) => {
    //USERCOUNT[0]-- // decrease by one to check if there exists any player left
    //console.log(`User on the server: ${USERCOUNT[0]}`)

    console.log(reason)
    delete backEndPlayers[socket.id]
    io.emit('updatePlayers',backEndPlayers) // remove from index.html also
  })

  socket.on('keydown',({keycode, sequenceNumber}) => {
    const backEndPlayer = backEndPlayers[socket.id]
    if (!backEndPlayer){ // if player was removed, do nothing
      return
    }

    backEndPlayer.sequenceNumber = sequenceNumber
    let isMovement = true
    switch(keycode) {
      case 'KeyW':
        backEndPlayer.y -= PLAYERSPEED
        break
      case 'KeyA':
        backEndPlayer.x -= PLAYERSPEED
        break
      case 'KeyS':
        backEndPlayer.y += PLAYERSPEED
        break
      case 'KeyD':
        backEndPlayer.x += PLAYERSPEED
        break
      default:
        isMovement = false
        break
    }
    if (isMovement){

      // after movement, check border for player
      const playerSides = {
        left: backEndPlayer.x - backEndPlayer.radius,
        right: backEndPlayer.x + backEndPlayer.radius,
        top: backEndPlayer.y - backEndPlayer.radius,
        bottom: backEndPlayer.y + backEndPlayer.radius
      }

      if (playerSides.left<0){ // restore position for backend
        backEndPlayers[socket.id].x = backEndPlayer.radius
      }
      if (playerSides.right>SCREENWIDTH){ // restore position for backend
        backEndPlayers[socket.id].x = SCREENWIDTH - backEndPlayer.radius
      }
      if (playerSides.top<0){ // restore position for backend
        backEndPlayers[socket.id].y = backEndPlayer.radius
      }
      if (playerSides.bottom>SCREENHEIGHT){ // restore position for backend
        backEndPlayers[socket.id].y = SCREENHEIGHT - backEndPlayer.radius
      }

      // check boundary with objects also
      borderCheckWithObjects(backEndPlayer, backEndPlayers, socket.id)

    }
    
    // NOT A MOVEMENT
    switch(keycode) {
      case 'Digit1':
        //console.log('Digit1 presssed')
        backEndPlayer.currentSlot = 1
        break
      case 'Digit2':
        //console.log('Digit2 presssed')
        backEndPlayer.currentSlot = 2
        break
      case 'Digit3':
        //console.log('Digit3 presssed')
        backEndPlayer.currentSlot = 3
        break
      case 'Digit4':
        //console.log('Digit4 presssed')
        backEndPlayer.currentSlot = 4
        break
      case 'KeyF':
        //console.log('f presssed')
        socket.emit('interact',backEndItems)
        break
      case 'Space':
        //console.log('Space presssed')
        socket.emit('holdSpace')
        break
      case 'KeyG':
        //console.log('g presssed')
        break
      case 'KeyR':
        //console.log('r presssed')
        socket.emit('reload')
        break
      default:
        break
    }

  })

});


const ENEMYSPAWNRATE = 3000
function spawnEnemies(){
  enemyId++
  const radius = 8 + Math.random() * 8
  const speed = 2 + Math.random() * 4
  let x
  let y

  if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : SCREENWIDTH + radius
      y = Math.random() * SCREENHEIGHT
  }else{
      x = Math.random() * SCREENWIDTH
      y = Math.random() < 0.5 ? 0 - radius : SCREENHEIGHT + radius
  }
  
  // back ticks: ~ type this without shift!
  const color = `hsl(${Math.random()*360},50%,50%)` // [0~360, saturation %, lightness %]
  const angle = Math.atan2(SCREENHEIGHT/2 - y, SCREENWIDTH/2 - x)
  const velocity = {
      x: Math.cos(angle)*speed,
      y: Math.sin(angle)*speed
  }

  const damage = 1
  const myID = enemyId
  const health = 1  // default 1

  // (new Enemy({ex, ey, eradius, ecolor, evelocity}))
  backEndEnemies[enemyId] = {
    x,y,radius,velocity, myID, color, damage, health
  }
  //console.log(`spawned enemy ID: ${enemyId}`)
}


function safeDeleteEnemy(enemyid){
  //console.log(`enemy removed ID: ${enemyid}`)
  delete backEndEnemies[enemyid]
}



let GLOBALCLOCK = 0
// backend ticker - update periodically server info to clients
setInterval(() => {
  GLOBALCLOCK += TICKRATE
  // enemy spawn mechanism
  if ((GLOBALCLOCK/5000 - 1 > 0) && (SPAWNENEMYFLAG) && (USERCOUNT[0]>0)){
    spawnEnemies()
    GLOBALCLOCK = 0 // init
    // console.log("server entity checks:")
    // console.log(`backEndEnemies ${backEndEnemies.length}`)
    // console.log(`backEndPlayers ${backEndPlayers.length}`)
    // console.log(`deadPlayerPos ${deadPlayerPos.length}`)
    // console.log(`backEndProjectiles ${backEndProjectiles.length}`)
    // console.log(`backEndDrawables ${backEndDrawables.length}`)
    // console.log(`backEndItems ${backEndItems.length}`)
    // console.log(" ")
  }


  // update projectiles
  for (const id in backEndProjectiles){
    let BULLETDELETED = false
    const gunNameOfProjectile = backEndProjectiles[id].gunName
    const PROJECTILERADIUS = backEndProjectiles[id].radius
    // friction
    backEndProjectiles[id].velocity.x *= FRICTION
    backEndProjectiles[id].velocity.y *= FRICTION
    backEndProjectiles[id].speed *= FRICTION

    backEndProjectiles[id].x += backEndProjectiles[id].velocity.x
    backEndProjectiles[id].y += backEndProjectiles[id].velocity.y

    backEndProjectiles[id].travelDistance -= backEndProjectiles[id].speed
    // travel distance check for projectiles
    if (backEndProjectiles[id].travelDistance <= 0){
      BULLETDELETED = true
      delete backEndProjectiles[id]
      continue // dont reference projectile that does not exist
    }

    // boundary check for projectiles
    if (backEndProjectiles[id].x - PROJECTILERADIUS >= backEndPlayers[backEndProjectiles[id].playerId]?.canvas?.width ||
        backEndProjectiles[id].x + PROJECTILERADIUS <= 0 ||
        backEndProjectiles[id].y - PROJECTILERADIUS >= backEndPlayers[backEndProjectiles[id].playerId]?.canvas?.height ||
        backEndProjectiles[id].y + PROJECTILERADIUS <= 0 
      ) {
      BULLETDELETED = true
      delete backEndProjectiles[id]
      continue // dont reference projectile that does not exist
    }

    let COLLISIONTOLERANCE = Math.floor(gunInfo[gunNameOfProjectile].projectileSpeed/6) -1 // px


    /////////////////////////////////////////////////////////////////////////////// collision with objects
    for (const objid in backEndObjects) {
      const backEndObject = backEndObjects[objid]
      const objInfo = backEndObject.objectinfo


      let collisionDetectedObject 
      if (backEndObject.objecttype==='wall'){
        collisionDetectedObject = collide([objInfo.start.x,objInfo.start.y], [objInfo.end.x,objInfo.end.y], [backEndProjectiles[id].x, backEndProjectiles[id].y], PROJECTILERADIUS + objInfo.width)
      } else if(backEndObject.objecttype==='hut'){
        const DISTANCE = Math.hypot(backEndProjectiles[id].x - objInfo.center.x, backEndProjectiles[id].y - objInfo.center.y)
        collisionDetectedObject = (DISTANCE < PROJECTILERADIUS + objInfo.radius) // + COLLISIONTOLERANCE no tolerance
      } else{
        console.log("invalid object-projectile interaction: undefined or other name given to obj")
      }

      if (collisionDetectedObject) {
        // who got hit
        if (backEndObjects[objid]){ // safe
          backEndObjects[objid].health -= backEndProjectiles[id].projDamage
          //console.log(`Object: ${objid} has health: ${backEndObjects[objid].health} remaining`)
          if (backEndObjects[objid].health <= 0){ //check
            safeDeleteObject(objid)
          } 
        }
        BULLETDELETED = true
        delete backEndProjectiles[id] 
        break // only one obj can get hit by a projectile
      }
    }

    if (BULLETDELETED){ // dont check below if collided
      continue
    }

    // collision detection with players
    for (const playerId in backEndPlayers) {
      const backEndPlayer = backEndPlayers[playerId]
      const DISTANCE = Math.hypot(backEndProjectiles[id].x - backEndPlayer.x, backEndProjectiles[id].y - backEndPlayer.y)
      if ((backEndProjectiles[id].playerId !== playerId) && (DISTANCE < PROJECTILERADIUS + backEndPlayer.radius + COLLISIONTOLERANCE)) {
        // who got hit
        if (backEndPlayers[playerId]){ // safe
          if (backEndPlayers[playerId].health <= 0){ // who got shot
            // who shot projectile
            if (backEndPlayers[backEndProjectiles[id].playerId]){ // safe
              backEndPlayers[backEndProjectiles[id].playerId].score ++
            }
            safeDeletePlayer(playerId)
          } else {
            if (DISTANCE < PROJECTILERADIUS + backEndPlayer.radius + COLLISIONTOLERANCE/2){ // accurate/nice timming shot 
              backEndPlayers[playerId].health -= backEndProjectiles[id].projDamage
            } else{ // not accurate shot
              backEndPlayers[playerId].health -= backEndProjectiles[id].projDamage/2
            }
            if (backEndPlayers[playerId].health <= 0){ //check again
              // who shot projectile
              if (backEndPlayers[backEndProjectiles[id].playerId]){ // safe
                backEndPlayers[backEndProjectiles[id].playerId].score ++
              }
              safeDeletePlayer(playerId)} 
          }
        }
        // delete projectile after inspecting who shot the projectile & calculating damage
        BULLETDELETED = true
        delete backEndProjectiles[id] 

        break // only one player can get hit by a projectile
      }
    }

    // collision detection with enemies
    if (BULLETDELETED){ // dont check for loop with enemy 
      continue
    }
    for (const enemyId in backEndEnemies) {
      const backEndEnemy = backEndEnemies[enemyId]
      const DISTANCE = Math.hypot(backEndProjectiles[id].x - backEndEnemy.x, backEndProjectiles[id].y - backEndEnemy.y)
      if ((DISTANCE < PROJECTILERADIUS + backEndEnemy.radius + COLLISIONTOLERANCE)) {
        // who got hit
        if (backEndEnemies[enemyId]){ // safe
          if (backEndEnemies[enemyId].health <= 0){ // who got shot
            safeDeleteEnemy(enemyId)
          } else {
            if (DISTANCE < PROJECTILERADIUS + backEndEnemy.radius + COLLISIONTOLERANCE/2){ // accurate/nice timming shot 
              backEndEnemies[enemyId].health -= backEndProjectiles[id].projDamage
            } else{ // not accurate shot
              backEndEnemies[enemyId].health -= backEndProjectiles[id].projDamage/2
            }
            if (backEndEnemies[enemyId].health <= 0){ //check again
              safeDeleteEnemy(enemyId)} 
          }
        }
        // delete projectile after inspecting who shot the projectile & calculating damage
        BULLETDELETED = true
        delete backEndProjectiles[id] 
        break // only one enemy can get hit by a projectile
      }
    }
    if (BULLETDELETED){ // dont check below
      continue
    }

    

  }

  // update objects
  for (const id in backEndObjects){
    const objinfo = backEndObjects[id].objectinfo
    if (objinfo.health <= 0){
      safeDeleteObject(id)
    }
  }

  // update drawables
  for (const id in backEndDrawables){
    backEndDrawables[id].duration -= 1
    if (backEndDrawables[id].duration <= 0){
      delete backEndDrawables[id]
    }
  }

  // update items - dont have to be done fast
  for (const id in backEndItems){
    if (backEndItems[id].deleteRequest){
      delete backEndItems[id]
    }
  }


  // update enemies
  for (const id in backEndEnemies){
    const enemy = backEndEnemies[id]
    const enemyRad = enemy.radius

    backEndEnemies[id].x += backEndEnemies[id].velocity.x
    backEndEnemies[id].y += backEndEnemies[id].velocity.y

    if (backEndEnemies[id].x - enemyRad >= SCREENWIDTH ||
      backEndEnemies[id].x + enemyRad <= 0 ||
      backEndEnemies[id].y - enemyRad >= SCREENHEIGHT ||
      backEndEnemies[id].y + enemyRad <= 0 
      ) {
        safeDeleteEnemy(id)
      continue // dont reference enemy that does not exist
    }

    // collision detection
    for (const playerId in backEndPlayers) {
      const backEndPlayer = backEndPlayers[playerId]
      const DISTANCE = Math.hypot(backEndEnemies[id].x - backEndPlayer.x, backEndEnemies[id].y - backEndPlayer.y)
      if ((DISTANCE < enemyRad + backEndPlayer.radius)) {
        // who got hit
        if (backEndPlayers[playerId]){ // safe
          if (backEndPlayers[playerId].health <= 0){ // who got shot
            safeDeletePlayer(playerId)
          } else {
            backEndPlayers[playerId].health -= backEndEnemies[id].damage
            if (backEndPlayers[playerId].health <= 0){ //check again
              safeDeletePlayer(playerId)} 
          }
        }
        // delete enemy after calculating damage
        safeDeleteEnemy(id)
        break // only one player can get hit by a enemy
      }
    }
  }

  io.emit('updateObjects', backEndObjects)
  io.emit('updateEnemies', backEndEnemies)
  io.emit('updateItems', backEndItems)
  io.emit('updateProjectiles',{backEndProjectiles,GUNHEARRANGE})
  io.emit('updateDrawables',{backEndDrawables,GUNHEARRANGE})
  io.emit('updatePlayers',backEndPlayers)
}, TICKRATE)


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

