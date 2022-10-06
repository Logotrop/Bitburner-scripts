export async function main(ns) {

    let startserver = "home"
    let lastservers = ["home"]
    let currentServer = ns.getHostname()
    ns.tprint("Currently running on Server: " + currentServer);
    // Declare names of refrenced scripts
    let netview = "getRoot.js"
    let autohack = "autohack.js"

    //Args processing
    if (ns.args.length >= 0) {
        //startserver = ns.args[0];
        //ns.tprint("argument length is " + ns.args.length);
        for (let i = 0; i <= (ns.args.length-1); i++) {
            //ns.tprint(ns.args[i] + " - " + i);
            lastservers.push(ns.args[i]);
        }
    }
	let servers = ns.scan(currentServer);
    lastservers.forEach(lastserver => {
        servers = servers.filter(item => item !== lastserver)
    })
    if (!lastservers.includes(currentServer)) {
        lastservers.push(currentServer);
        //ns.tprint(lastservers)
    }
    if (servers.length === 0) {
        ns.exit()
    }
    ns.tprint(servers);
	servers.forEach(server => {
        ns.tprint("Using " + server + ":");
        if (server != "home" && ns.hasRootAccess(server) == false) {
            if (ns.getServerNumPortsRequired(server) == 0) {
                ns.nuke(server);
                //ns.installBackdoor(server);
                ns.tprint("Server: " + server + " Rooted succesfully.");
            } else if (ns.getServerNumPortsRequired(server) <= 2){
                ns.ftpcrack(server);
                ns.brutessh(server);
                ns.nuke(server);
                ns.tprint("Server: " + server + " Rooted succesfully.");
            }
        }
        if (server != "home" && ns.hasRootAccess(server) == true) {
            //if Rooted, start remote getRoot & autohack
            //ns.tprint("Server "+ server + " is Rooted.");
            if (ns.fileExists(netview, server)) {
                ns.rm(netview, server);
            }
            if (ns.scp(netview, server)) {
                //ns.tprint(lastservers)
                //ns.tprint("Starting scan on Server: "+ server + " with parameters: " + lastservers);
                ns.exec(netview, server, 1, server, ...lastservers);
                //ns.tprint("Server "+ server + " successfully started GetRoot script");
            }
            if (ns.isRunning(autohack, server, 1 , server)) {
                //ns.tprint("Attempt to kill autohack.js on " + server)
                if (ns.scriptKill(autohack, server)) {
                    //ns.tprint("Server "+ server + " successfully killed " + autohack);
                }
            }
            if (ns.scp(autohack, server)) {
                ns.exec(autohack, server, 1, server);
                ns.tprint("Server "+ server + " successfully deployed " + autohack + " script");
            } else {
                ns.tprint("ERROR: "+ server + " could not upload " + autohack + " script");
            }
        }else {
            ns.tprint("Server "+ server + " failed to Root.");
        }
    });
}