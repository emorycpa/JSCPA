"use strict";
//Set to debug;
//process.env.DEBUG = "*";
Object.defineProperty(exports, "__esModule", { value: true });
var RestClientPromise = require('./rest.client.promise.js');
var extend = Object.assign;
var CreateMessageInit = function (globalArgs) {
    return function (postBody) {
        var returnObj = extend({}, globalArgs);
        returnObj["data"] = JSON.stringify(postBody);
        return returnObj;
    };
};
var methodsToBootstrap = ["read", "create", "edit", "delete", "move", "publish", "search"];
var Cascade = /** @class */ (function () {
    function Cascade(hostname, username, password, configOptions) {
        this.hostname = hostname;
        this.username = username;
        this.password = password;
        this.configOptions = configOptions;
    }
    Cascade.prototype.init = function (hostname, username, password, configOptions) {
        var cascadeClient = {};
        var restClient = RestClientPromise.Client(extend(configOptions, {
            "promisify": {
                "onRegisterMethod": true
            }
        }));
        methodsToBootstrap.forEach(function (method) {
            restClient.registerMethod("cascade$" + method, "https://${hostname}/api/v1/" + method, "POST");
        });
        var createMessage = CreateMessageInit({
            "path": { "hostname": hostname },
            "parameters": { "u": username, "p": password },
        });
        cascadeClient.createMessage = createMessage;
        Object.keys(restClient.methods).forEach(function (methodName) {
            var returnName = methodName.replace('cascade$', '');
            cascadeClient[returnName] = function () {
                var args = [].slice.call(arguments);
                return restClient.methods[methodName].call(restClient, createMessage(args[0]));
            };
        });
        cascadeClient.registerMethod = function (nameSpace, name, fn) {
            if (!cascadeClient[nameSpace]) {
                cascadeClient[nameSpace] = {};
            }
            cascadeClient[nameSpace][name] = fn(cascadeClient);
        };
        return cascadeClient;
    };
    return Cascade;
}());
exports.Cascade = Cascade;
