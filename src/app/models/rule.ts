import { Connection } from "./connection";

export enum RuleType {
    DnsDomain,
    HostMatch,
    UrlMatch,
    HostInNet,
    MyIpInNet,
    PlainHost,
    DomainIs,
}

export class Rule {
    public type: RuleType;
    public match: string;
    public match2nd: string;
    public connection: Connection;
}