export async function main(ns){
    var Server = ns.args[0];
    var script = "autohack.js"
    ns.tprint(Math.floor((ns.getServerMaxRam(Server)) / (ns.getScriptRam(script, Server))));
}