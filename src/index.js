const Provider = require('./provider');
const Manager = require('./manager');

class Murmur {  
  constructor(options) {
    this.isBridge = options.isBridge;
    this.protocols = options.protocols || [];
    this.signalServers = options.signalServers || [];
    this.ignoreBloomFilters = options.ignoreBloomFilters !== undefined ? options.ignoreBloomFilters : false;
    this.bootnodes = options.bootnodes || [];
    this.nodes = [];
    
    if(this.protocols.length != 2){
      this.isBridge = false;
    }
    
    this.provider = new Provider();
    this.manager = new Manager(this.provider, {
      isBridge: this.isBridge,
      ignoreBloomFilters: this.ignoreBloomFilters
    });
  }

  onReady(cb){
    this.manager.executeOnReady(cb);
  }

  async start() {
    if(this.protocols.indexOf("devp2p") > -1){
      const devp2p = require("./devp2p-node.js");
      devp2p.start();
      devp2p.connectTo({address: '127.0.0.1', udpPort: 30303, tcpPort: 30303});
      this.nodes.push(devp2p);
    }

    if(this.protocols.indexOf("libp2p") > -1){
      const LibP2PNode = require('./libp2p-node.js');
      const libp2p = new LibP2PNode({
        isBrowser: typeof window !== 'undefined',
        bootnodes: this.bootnodes,
        signalServers: this.signalServers,
      });
      libp2p.start();
      this.nodes.push(libp2p);
    }

    this.manager.setupNodes(this.nodes);
    this.manager.start(this.readyCB);
  }
}

module.exports = Murmur;
