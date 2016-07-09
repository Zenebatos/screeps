var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log(JSON.stringify(creep.memory.assigned_source))
        console.log(Game.getObjectById(creep.memory.assigned_source))
        console.log(creep.harvest(Game.getObjectById(creep.memory.assigned_source)))
        if (creep.harvest(Game.getObjectById(creep.memory.assigned_source)) == ERR_NOT_IN_RANGE){
			creep.moveTo(Game.getObjectById(creep.memory.assigned_source))
			}
		}
	}

module.exports = roleMiner;
