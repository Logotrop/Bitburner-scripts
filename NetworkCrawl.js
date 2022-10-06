/**
 * Scan the network of a given device.
 * @param ns {NS} - BitBurner API
 * @param device {string} - Device network that will be scanned
 * @param maxDepth - Depth to scan to
 * @returns {[string[], Object]} - A tuple including an array of discovered devices & a tree of the network
 */
 export function scanNetwork(ns, device = ns.getHostname(), maxDepth = Infinity) {
    let discovered = [device];
    function scan (device, depth = 1) {
        if(depth > maxDepth) return {};	
        const localTargets = ns.scan(device).filter(newDevice => !discovered.includes(newDevice));	
        discovered = [...discovered, ...localTargets];
        return localTargets.reduce((acc, device) => ({...acc, [device]: scan(device, depth + 1)}), {});
    }
    const network = scan(device);
    return [discovered.slice(1), network];
}

export function main(ns) {
    ns.tprint(scanNetwork(ns))
}