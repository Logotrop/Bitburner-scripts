export async function main(ns) {
    let server = ns.args[0];
    while(true) {
        if ((ns.getServerSecurityLevel(server) > (ns.getServerMinSecurityLevel(server)+1)) || (ns.hackAnalyzeChance(server)<0.8))  {
            await ns.weaken(server);
        } else if (ns.getServerMoneyAvailable(server) < (ns.getServerMaxMoney(server)-(ns.getServerMaxMoney(server)/30))) {
            await ns.grow(server)
        } else if (ns.getServerRequiredHackingLevel(server)<=ns.getHackingLevel()){
            //await ns.weaken(server);
            await ns.hack(server);
        } else {
            
            //ns.print(server + ": " + ns.getHackingLevel() + "/" + ns.getServerRequiredHackingLevel(server))
            break;
        }
	}
}