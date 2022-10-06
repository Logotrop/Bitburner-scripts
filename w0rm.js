/**
* @param {NS} ns
**/
let netview = "autohack.js"
let MyServers = ["home", "acheron","medusa","hades","athena","fate","demeter","minotaur","syren","harpy","persephone","cerberus"]



async function AutoHack(ns, Server, ServerList) {
    const hostname = Server.hostname
    const threads = Math.floor((ns.getServerMaxRam(hostname)) / (ns.getScriptRam(netview, hostname)))
    //ns.tprint("AutoHack function Started on " + hostname)
    //Kill script if already running on the server
    if (ns.scriptRunning(netview, hostname)) {
        ns.scriptKill(netview, hostname)
        //ns.tprint("Killing " + netview + " on server " + hostname)
    }
    //Replace autohack script with newer version
    if (ns.fileExists(netview, hostname) && (hostname != "home")) {
        ns.rm(netview, hostname);
        //ns.tprint("Deleting " + netview + " on server " + hostname)
    }
    //Transmit script to server and run
    if (ns.scp(netview, hostname)) {
        if (!MyServers.includes(hostname)) {
            ns.exec(netview, hostname, 1, hostname)
        }
        //ns.tprint(hostname);
        var ServerRam = ns.getServerRam(hostname)
        const totalram = ServerRam[0]
        var usedram = ServerRam[1]
        if (hostname == "home") {
            usedram += 50
        }
        const scriptRam = ns.getScriptRam(netview, hostname)


        // ns.tprint((scriptRam+ " + " +usedram) + " < " + totalram)
        // ns.tprint((scriptRam+usedram)<totalram)
        while ((scriptRam+usedram)<totalram) {
            //ns.tprint((scriptRam+ " + " +usedram) + " < " + totalram)
            var uuid = Math.random()*1000
            //ns.tprint((scriptRam+usedram)<totalram)
            ServerList.forEach(cserver => {
                //ns.tprint((scriptRam+usedram)<totalram)
                if (ns.hasRootAccess(cserver) && ((scriptRam+usedram)<totalram)) {
                    ns.exec(netview, hostname, 1, cserver, uuid)
                    usedram += scriptRam;
                    //ns.tprint("Running " + netview + " on server " + hostname + " Target: " + cserver)
                }
            });
        }
        
        //ns.tprint(ns.ps(hostname))
    }
}


async function Netcrawl(ns, searchFor) {
	var current = ns.getHostname();
	var search = (visited, current, searchFor)=>{
		var found = ns.scan(current).filter((s)=>{
			if(!visited){return true}
			return visited.findIndex((v)=>s===v) === -1
		})
		visited = visited || [];
		visited.push(...found); //adding all found here means, that we get the shortest way and don't need to know, what other nodes were visited by the next recursion.
		for(var s of found){
			if(s.toUpperCase().startsWith(searchFor.toUpperCase())){
				return [s];
			}
			var res = search(visited, s, searchFor)
			if(res){
				res.push(s)
				return res;
			}
		}
		return null;
	}
	var res = search(null, current, searchFor);
	if(!res){
		ns.tprint("Server not found")
		return;
	}
	var line = "\n"
	for(var i=res.length-1; i>=0; i--){
		line += "connect "+res[i] +"; ";
	}
	ns.tprint(line);
}



export async function main(ns){
    ns.tprint("Running server W0RM");
    let servers = ns.scan(ns.getHostname());
    let i = 0
    let DiscoveredServer = ""
    let icanssh = false
    if (ns.fileExists("BruteSSH.exe", "home")) {
        icanssh = true; 
        //ns.tprint("SSH is available")
    }
    let icanftp = false
    if (ns.fileExists("FTPCrack.exe", "home")) {
        icanftp = true; 
        //ns.tprint("FTP is available")
    }
    let icansmtp = false
    if (ns.fileExists("relaySMTP.exe", "home")) {
        icansmtp = true; 
        //ns.tprint("SMTP is available")
    }
    let icanhttp = false
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        icanhttp = true; 
        //ns.tprint("HTTP is available")
    }
    let icansql = false
    if (ns.fileExists("SQLInject.exe", "home")) {
        icansql = true; 
        //ns.tprint("SQL is available")
    }
        
    //ns.tprint("Servers: " + servers);
    while (servers.length > i) {
        DiscoveredServer = servers[i++];
        //ns.tprint(DiscoveredServer);
        //ns.tprint("Running scan on: " + DiscoveredServer);
        ns.scan(DiscoveredServer).forEach(NewServer => {
            if (!servers.includes(NewServer)) {
                //ns.tprint("Found New Server: " + NewServer);
                servers.push(NewServer);
                //ns.tprint("Server " + NewServer + " Added to servers list");
            }
        });
    }
    //ns.tprint("###############  RESULTS  #######################")
    MyServers.forEach(mserver => {
        servers.splice(servers.indexOf(mserver), 1);
    })
    
    //ns.tprint(servers);
    servers.forEach(server => {
        let ServerInfo = ns.getServer(server)
        // ServerInfo.connectedServers = ns.scan(ServerInfo.hostname)
        // if (ServerInfo.connectedServers.includes("home")) {
        //     ServerInfo.connectedServers.splice(ServerInfo.connectedServers.indexOf("home"), 1)
        // }
        //ns.tprint(ServerInfo);
        //ns.tprint("Analysis of: " + ServerInfo.hostname);
        if (!ServerInfo.hasAdminRights) {
            if (ServerInfo.numOpenPortsRequired > ServerInfo.openPortCount) {
                //ns.tprint("Number of Open Ports: " + ServerInfo.openPortCount + "/" + ServerInfo.numOpenPortsRequired + " required");
                // SSH port
                if (!ServerInfo.sshPortOpen && icanssh) {
                    ns.brutessh(ServerInfo.hostname)
                    ServerInfo.openPortCount += 1;
                    //ns.tprint(ServerInfo.hostname + " - SSH Port: " + ServerInfo.sshPortOpen)
                }
                // FTP port
                if (!ServerInfo.ftpPortOpen && icanftp) {
                    ns.ftpcrack(ServerInfo.hostname)
                    ServerInfo.openPortCount += 1;
                    //ns.tprint(ServerInfo.hostname + " - FTP Port:" + ServerInfo.ftpPortOpen)
                }
                // SMTP port
                if (!ServerInfo.smtpPortOpen && icansmtp) {
                    ns.relaysmtp(ServerInfo.hostname)
                    ServerInfo.openPortCount += 1;
                    //ns.tprint(ServerInfo.hostname + " - SMTP Port:" + ServerInfo.smtpPortOpen)
                }
                // HTTP port
                if (!ServerInfo.httpPortOpen && icanhttp) {
                    ns.httpworm(ServerInfo.hostname)
                    ServerInfo.openPortCount += 1;
                    //ns.tprint(ServerInfo.hostname + " - HTTP Port:" + ServerInfo.httpPortOpen)
                }
                // SQL port
                if (!ServerInfo.sqlPortOpen && icansql) {
                    ns.sqlinject(ServerInfo.hostname)
                    ServerInfo.openPortCount += 1;
                    //ns.tprint(ServerInfo.hostname + " - SQL Port:" + ServerInfo.sqlPortOpen)
                }
            }
            // Try NUKE to get Root
            if (!ServerInfo.hasAdminRights && (ServerInfo.openPortCount >= ServerInfo.numOpenPortsRequired)) {
                ns.nuke(ServerInfo.hostname)
                ServerInfo.hasAdminRights = ns.hasRootAccess(ServerInfo.hostname)
                ns.tprint("NUKED: " + ServerInfo.hostname);
            }            
        }
        if (ServerInfo.hasAdminRights) {
            //ns.tprint(ServerInfo.hostname + " Root Access Found")

            if (!(ServerInfo.backdoorInstalled) && (ServerInfo.requiredHackingSkill <= ns.getHackingLevel())) {
                ns.tprint(ServerInfo.hostname + " Available to Backdoor!")
                Netcrawl(ns, ServerInfo.hostname);

                //ns.tprint(ns.getHackingLevel() + "/" + ServerInfo.requiredHackingSkill)
                // ns.connect(ServerInfo.hostname);
                // ns.installBackdoor();
                // ns.connect("home");
            }



            //ns.tprint(ServerInfo.hostname + " would start " + netview);
            AutoHack(ns, ServerInfo, servers);
        } else {
            // ns.print(ServerInfo.hostname + " Root Access could not be obtained");
            // ns.print(ServerInfo.hostname + " Information: ");
            // ns.print("IP: " + ServerInfo.ip);
            // ns.print("Level: " + ServerInfo.requiredHackingSkill);
            // ns.print("Ports: " + ServerInfo.openPortCount + "/" + ServerInfo.numOpenPortsRequired);
            // ns.print("SSH: " + ServerInfo.sshPortOpen + " - " + icanssh);
            // ns.print("FTP: " + ServerInfo.ftpPortOpen + " - " + icanftp);
            // ns.print("HTTP: " + ServerInfo.httpPortOpen + " - " + icanhttp);
            // ns.print("SMTP: " + ServerInfo.smtpPortOpen + " - " + icansmtp);
            // ns.print("SQL: " + ServerInfo.sqlPortOpen + " - " + icansql);
            // ns.print("                                                          ");
        }
    });

    MyServers.forEach(mserver => {
        if (ns.serverExists(mserver)) {
            AutoHack(ns, ns.getServer(mserver), servers);
        }
        
    })


    servers.forEach(server => {
    //ns.tprint("Copy files from: " + server)
    ns.ls(server).forEach(file => {
        if (ns.fileExists(file, server)) {
            ns.scp(file, "home", server);
        }
    })
    //ns.scp(ns.ls(server),"home",server)
    //ns.tprint(ns.ls(server));
    
    
    })


}