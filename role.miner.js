var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.harvest(Game.getObjectById(creep.memory.assigned_source.id)) == ERR_NOT_IN_RANGE){
			creep.moveTo(Game.getObjectById(creep.memory.assigned_source.id))
			}
		}
	}

module.exports = roleMiner;
