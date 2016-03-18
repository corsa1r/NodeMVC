"use strict";

class Post extends Map {
    
    constructor($request) {
        super();
    }
    
    parse() {
        for(let item in this.$injected.$request.origin.body) {
            this.set(item, this.$injected.$request.origin.body[item]);
        }
    }
}

module.exports = Post;