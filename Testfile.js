export async function main(ns) {
    let startserver = "home"
    let lastserver = "home"
    let currentServer = ns.getHostname()
    ns.tprint("Currently running on Server: " + currentServer);
    let netview = "Testfile.js"
    let autohack = "autohack.js"
    if (ns.args.length >= 1) {
        startserver = ns.args[0];
        if (ns.args[1] === undefined) {
            lastserver = ns.args[1];
        }
    }
	let servers = ns.scan(startserver);
    servers = servers.filter(item => item !== "home")
    servers = servers.filter(item => item !== lastserver)
    ns.tprint(servers);
	let server = servers[0]
	if (ns.scp(netview, server)) {
		ns.exec(netview, server, 1, server, currentServer);
		ns.tprint("Server "+ server + " successfully started " + netview + " script");
	}
}