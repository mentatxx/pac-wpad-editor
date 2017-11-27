import { Injectable } from "@angular/core";
import { Rules } from "../models/rules";

/**
 * Parse .pac files
 */

@Injectable()
export class Parser {
    public parsePacFile(text: string): Rules {
        let result: Rules = new Rules();
        return rules;        
    }
}