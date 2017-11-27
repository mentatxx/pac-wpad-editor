import { Injectable } from "@angular/core";
import { Rules } from "../models/rules";
import { Connection, ConnectionType } from "../models/connection";
import { Rule, RuleType } from "../models/rule";

@Injectable()
export class Generator {
    public buildPacFile(rules: Rules): string {
        return this.header() +
            this.renderRules(rules) +
            this.footer();
    }

    private header() {
        return 'function FindProxyForURL(url, host) {\n';
    }

    private footer() {
        return '}\n';
    }

    private renderRules(rules: Rules): string {
        let result = '';
        for (let rule of rules.rules) {
            result += this.renderRule(rule)
        }
        result += this.renderConnection(rules.defaultConnection);
        return result;
    }

    private renderConnection(connection: Connection) {
        switch (connection.type) {
            case ConnectionType.DIRECT:
                return 'return "DIRECT";\n'
            case ConnectionType.PROXY:
                if (connection.port) {
                    return `return "PROXY ${connection.host}:${connection.port}";\n`;
                } else {
                    return `return "PROXY ${connection.host}";\n`;                    
                }
            default:
                throw new Error('Cannot render connection, type = ' + connection.type);
        }
    }

    private renderRule(rule: Rule): string {
        return `
            if (${this.renderCondition(rule)}) {
                ${this.renderConnection(rule.connection)}
            }`;
    }

    private renderCondition(rule: Rule): string {
        switch (rule.type) {
            case RuleType.DnsDomain:
                return `dnsDomainIs(host, "${rule.match}")`
            case RuleType.HostMatch:
                return `shExpMatch(host, "${rule.match}")`;
            case RuleType.UrlMatch:
                return `shExpMatch(url, "${rule.match}")`;
            case RuleType.HostInNet:
                return `isInNet(dnsResolve(host), "${rule.match}", "${rule.match2nd}")`;
            case RuleType.MyIpInNet:
                return `myIpAddress(), "${rule.match}", "${rule.match2nd}")`;
            case RuleType.PlainHost:
                return `isPlainHostName(host)`;
            case RuleType.DomainIs:
                return `localHostOrDomainIs(host, "${rule.match}")`
            default:
                throw new Error('Unable to render condition with rule type = ' + rule.type);
        }
    }

}   
