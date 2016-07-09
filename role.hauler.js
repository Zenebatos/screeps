var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            var drop = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
            if(drop && creep.pickup(drop) == ERR_NOT_IN_RANGE) {
                creep.moveTo(drop);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_CONTAINER ||
                                structure.structureType == STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                var flag = creep.pos.findClosestByPath(FIND_FLAGS);
                creep.moveTo(flag)
            }
        }
	}
};

module.exports = roleHauler;
