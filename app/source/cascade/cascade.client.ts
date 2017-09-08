/**
 * A combination of 
 */
import * as Promise from 'bluebird';
import NodeRestClient from 'node-rest-client';
export default class CascadeClient{
    private _hostname: string;
    private _username: string;
    private _password: string;
    private _options: any; 
    
    constructor(hostname, username, password, options){
        this._hostname = hostname;
        this._username = username;
        this._password = password;
        this._options = options;
    }

	public get options(): any {
		return this._options;
	}

	public set options(value: any) {
		this._options = value;
    }
    
    private get methodNames(){
        return  "get post put delete patch".split(" ");
    }

    private EventEmitterPromisifier(originalMethod) {
        return function promisified() {
            const args = [].slice.call(arguments);
            const self = this;
            return new Promise(function (resolve, reject) {
    
                // add the callback to the arguments
                args.push(
                    function (data, response) {
                        // resolve the Promise providing data and response as
                        // an object
                        resolve({
                            data: data,
                            response: response
                        });
                    }
                );
    
                // call the method
                const emitter = originalMethod.apply(self,args);
    
                // listen to specific events leading to rejects
                emitter
                    .on("error", function (err) {
                        reject(err);
                    })
                    .on("requestTimeout", function () {
                        reject(new Promise.TimeoutError());
                    })
                    .on("responseTimeout", function () {
                        reject(new Promise.TimeoutError());
                    });
            });
        };
    };

    private getRestClient(options){
        const restClient = new NodeRestClient.Client(options);
            if(options.promisify){
                const promisifiedClient = Promise.promisifyAll(restClient, {
                    filter: function (name) {
                        if(options.promisify.methods){
                            if(Array.isArray(options.promisify.methods)){
                                return options.promisify.methods.indexOf(name) > -1;
                            } else {
                                return options.promisify.methods.toString().split(" ").indexOf(name)  > -1;
                            }
                        } else {
                            return this.methodNames().indexOf(name) > -1;
                        }
                    },
                    promisifier: this.EventEmitterPromisifier,
                    suffix: 'Promise'
                });
        
                if(options.promisify.onRegisterMethod == true) {
                    const registerMethod = promisifiedClient.registerMethod;
                    promisifiedClient.registerMethod = function(){
                        const args = [].slice.call(arguments);
                        registerMethod.apply(promisifiedClient, args);
                        Promise.promisifyAll(restClient.methods, {
                            filter: function (name) {
                                return name === args[0];
                            },
                            promisifier: this.EventEmitterPromisifier,
                            suffix: 'Promise'
                        })
                    };
                }
                return promisifiedClient;
            } else {
                return restClient;
            }
    }
}