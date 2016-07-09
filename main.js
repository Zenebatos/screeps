var roleHarvester = require('role.harvester');
var roleUpgrader  = require('role.upgrader');
var roleBuilder   = require('role.builder');
var roleMiner     = require('role.miner');
var roleHauler    = require('role.hauler');

function findMySources() {
	var sources = [] ;
	var rooms_with_sources = _.filter(Game.rooms, (room) => room.find(FIND_SOURCES) != null); // find rooms with sources
	for (var i = 0; i < rooms_with_sources.length; i++) { 
		sources = sources.concat(_.filter(rooms_with_sources[i].find(FIND_SOURCES))) ; // Add found sources to 'sources' array
		} ;
	
	return sources
}

function getSourceWithLeastMiners() {

	var workers_assigned = [] ;
	var sources = findMySources();
	for (var i = 0; i < sources.length; i++) {
		var assigned = _.filter(Game.creeps, (creep) => creep.memory.assigned_source == sources[i]);
		if(assigned) {
			workers_assigned[i] = assigned.length;
			} else {
			workers_assigned[i] = 0;
			};
		};
	
	var lowest = 0;
	for (var i = 1; i < workers_assigned.length; i++) {
		if (workers_assigned[i] < workers_assigned[lowest]) lowest = i;
		};
	
	return sources[lowest];
	
}
module.exports.loop = function () {
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }    
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders  = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders   = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var haulers    = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var repairer   = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var miners     = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var numSources = findMySources().length
    
    
    var default_parts = [WORK,CARRY,MOVE];
    var number_of_parts = 3;    
    var upgraded_parts = [];
    upgraded_parts = upgraded_parts.concat(default_parts);
    while(Game.spawns.Spawn1.canCreateCreep(upgraded_parts) == OK){
        default_parts = [];
        default_parts = default_parts.concat(upgraded_parts);
        number_of_parts = upgraded_parts.length;
        upgraded_parts.push(WORK);
    }

    if(Game.spawns.Spawn1.canCreateCreep(default_parts) == OK){
        if(harvesters.length < 3 && haulers.length < 3 && miners.length < 3) {
            var newName = Game.spawns.Spawn1.createCreep(default_parts, undefined, {role: 'harvester'});
            console.log('Spawning new harvester: ' + newName);
            console.log('We now have a total of ' + (harvesters.length+1) + ' harvesters')
        } else if(miners.length < numSources*3) {
            var mySource = getSourceWithLeastMiners();
            var newName = Game.spawns.Spawn1.createCreep(default_parts, undefined, {role: 'miner', assigned_source: mySource});
            console.log('Spawning new miner: ' + newName + ' assigned to Source ' + mySource);
            console.log('We now have a total of ' + (miners.length+1)  + ' miners')
        }else if(upgraders.length < 10) {
            var newName = Game.spawns.Spawn1.createCreep(default_parts, undefined, {role: 'upgrader'});
            console.log('Spawning new upgrader: ' + newName);
            console.log('We now have a total of ' + (upgraders.length+1)  + ' upgraders')
        } else if(builders.length < 10) {
            var newName = Game.spawns.Spawn1.createCreep(default_parts, undefined, {role: 'builder'});
            console.log('Spawning new builder: ' + newName);
            console.log('We now have a total of ' + (builders.length+1)  + ' builders')
        }
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }        
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
    }
    
    for(var tower in _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER)) {
        roleTower.run(tower)
    }
        
}
