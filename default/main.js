const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

const ROLE_BUILDER = 'builder'
const ROLE_HARVESTER = 'harvester'
const ROLE_UPGRADER = 'upgrader'

module.exports.loop = function () {

    // var tower = Game.getObjectById('TOWER_ID');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
// }

    // Clear dead creeps
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === ROLE_HARVESTER);
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === ROLE_UPGRADER);
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === ROLE_BUILDER);

    if(harvesters.length < 2) {
        const newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: ROLE_HARVESTER}});
    }

    if(upgraders.length < 0) {
        const newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        const err = Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: ROLE_UPGRADER}});
        console.log(err);
    }

    if(builders.length < 0) {
        const newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: ROLE_BUILDER}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        if(creep.memory.role === ROLE_HARVESTER) {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === ROLE_UPGRADER) {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === ROLE_BUILDER) {
            roleBuilder.run(creep);
        }
    }
}