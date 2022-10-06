/** @param {NS} ns **/
export async function main(ns) {
	
	var searchFor= ns.args[0];
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

/**
 * 
 * @param {import("NetscriptDefinitions").AutocompleteData} data 
 * @param {string[]} args 
 * @returns 
 */
export function autocomplete(data, args) {
	return [...data.servers]; // This script autocompletes the list of servers.
}