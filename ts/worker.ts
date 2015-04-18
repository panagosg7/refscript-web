
/// <reference path="defs/angular.d.ts" />
/// <reference path="defs/typescriptServices.d.ts" />

importScripts('libs/typescriptServices.js');

module TS_Worker {

    class MyLanguageServiceHost implements ts.LanguageServiceHost {
        files: { [fileName: string]: { file: ts.IScriptSnapshot; ver: number } } = {}

        log = _ => { };
        trace = _ => { };
        error = _ => { };
        getCompilationSettings = ts.getDefaultCompilerOptions;
        getScriptIsOpen = _ => true;
        getCurrentDirectory = () => "";
        getDefaultLibFileName = _ => "lib";

        getScriptVersion = fileName => this.files[fileName].ver.toString();
        getScriptSnapshot = fileName => this.files[fileName].file;

        getScriptFileNames(): string[] {
            var names: string[] = [];
            for (var name in this.files) {
                if (this.files.hasOwnProperty(name)) {
                    names.push(name);
                }
            }
            return names;
        }

        addFile(fileName: string, body: string) {
            var snap = ts.ScriptSnapshot.fromString(body);
            snap.getChangeRange = _ => undefined;
            var existing = this.files[fileName];
            if (existing) {
                this.files[fileName].ver++;
                this.files[fileName].file = snap
            } else {
                this.files[fileName] = { ver: 1, file: snap };
            }
        }
    }

}


self.addEventListener('message', function(e) {  
    console.log("Hi from worker");
    //self.postMessage(e.data);
}, false);

var host = new MyLanguageServiceHost();
var languageService = ts.createLanguageService(host, ts.createDocumentRegistry());
host.addFile("script.ts", text);
var output = languageService.getEmitOutput("script.ts").outputFiles[0].text;


