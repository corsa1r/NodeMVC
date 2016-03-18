"use strict";

class Get extends Map {
    
    constructor($request) {
        super();
    }
    
    parse() {
        var uriString = this.$injected.$request.origin.originalUrl;
        var explode = uriString.split('?');
        
        if(explode.length === 2) {
            this.set('$origin', explode[1]);
            var params = explode[1].split('&');
            for(let i in params) {
                var param = params[i].split('=');
                this.set(param[0], param[1]);
            }
        } else {
            this.set('$origin', '');
        }
    }
}

module.exports = Get;