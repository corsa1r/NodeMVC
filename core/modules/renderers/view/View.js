"use strict";

class View {
    
    constructor($response) {
        this.data = {};
        this.result = null;
    }
    
    render(templateName) {
        this.result = this.$injected.$response.origin.render(templateName, this.data);
        return this;
    }
    
    parse() {
        return this.result;
    }
}

module.exports = View;