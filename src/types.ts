// To parse this data:
//
//   import { Convert } from "./file";
//
//   const card = Convert.toCard(json);

export interface Card {
    id:         string;
    extra:      string;
    modified:   Date;
    created:    Date;
    text:       string;
    title:      null;
    importance: number;
    tags:       Tag[];
    comments:   Comment[];
    source:     Source | null;
}

export interface Comment {
    id:    string;
    extra: string;
    text:  string;
    cards: string[];
}

export interface Source {
    id:           string;
    extra:        string;
    title:        string;
    text:         string;
    pageIndex:    number;
    uniqueId:     null | string;
    uniqueIdNote: UniqueIDNote | null;
    filePath:     null | string;
    modified:     Date;
    created:      Date;
    cards:        string[];
}

export enum UniqueIDNote {
    ZoteroCitekey = "Zotero Citekey",
}

export interface Tag {
    id:    string;
    extra: string;
    key:   string;
    value: null | string;
    note:  null | string;
    cards: string[];
}

// Converts JSON strings to/from your types
export class CardConvert {
    public static toCards(json: string): Card[] {
        return JSON.parse(json);
    }

    public static cardToJson(value: Card[]): string {
        return JSON.stringify(value);
    }
}
