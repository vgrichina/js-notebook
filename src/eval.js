const vm = require('vm')

let evalContext = {
    console: {}
};

function resultToJSON(result) {
    console.log('resultToJSON', result);
    // TODO: Different handlers for different JS objects
    return {
        type: 'Text',
        text: `${result}`
    }
}

function errorToJSON(error) {
    return {
        type: 'Error',
        message: error.toString(),
        stack: error.stack,
        text: [`${error}`, error.stack].join('\n')
    }
}

function evalCode(code) {
    // TODO: Maintain global context
    const logs = [];
    // TODO: Proper console wrapper
    evalContext.console.log = (...args) => {
        logs.push(args.join(" "));
        console.log(...args);
    }
    try {
        const result = vm.runInNewContext(code, evalContext);
        return { result: resultToJSON(result), logs };
    } catch (e) {
        return { result: errorToJSON(e), logs };
    }
}


module.exports = { evalCode, errorToJSON }