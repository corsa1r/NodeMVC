"use strict";

class Params extends Map {

    constructor() {
        super();
    }

    insert(params) {
        for (let id in params) {
            super.set(id, params[id]);
        }
    }
}

module.exports = Params;
