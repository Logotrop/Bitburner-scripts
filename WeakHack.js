server = args[0];
export async function main(ns) {
    while(true) {
        if (ns.getServerRequiredHackingLevel(server)<=ns.getHackingLevel()){
            await ns.weaken(server);
            await ns.hack(server);
        } else {
            break;
        }
	}

}