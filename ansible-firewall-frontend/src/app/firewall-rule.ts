export class FirewallRule {
	interfaceIn: String;
	interfaceInNot: Boolean;
	interfaceOut: String;
	interfaceOutNot: Boolean;
	sourceAddress: String;
	sourceAddressNot: Boolean;
	destinationAddress: String;
	destinationAddressNot: Boolean;
	sourcePort: Number;
	sourcePortNot: Boolean;
	destinationPort: Number;
	destinationPortNot: Boolean;
	protocol: String;
	protocolNot: Boolean;
	target: String;	
        _id: string;
}
