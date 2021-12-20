import { Card } from "./types";

export class CabinetCardIdentifier {
    public id: string;
    public modified: Date;
    public sourceCiteKey: string;
    public sourcePage: number;


    public static fromCard(card: Card): CabinetCardIdentifier {
        const cabinetCardIdentifier = new CabinetCardIdentifier();
        cabinetCardIdentifier.id = card.id;
        cabinetCardIdentifier.modified = card.modified;
        cabinetCardIdentifier.sourceCiteKey = card.source?.uniqueId ?? "";
        cabinetCardIdentifier.sourcePage = card.source ? card.source.pageIndex : 0;
        
        return cabinetCardIdentifier;
    }

    public toJsonString(): string {
        return JSON.stringify(this);
    }
    public fromJsonString(jsonString: string): CabinetCardIdentifier {
        const newCabinetCardIdentifier = new CabinetCardIdentifier();
        return Object.assign(newCabinetCardIdentifier, JSON.parse(jsonString));
    }

    public getCard(cards: Card []): Card | null {
        const card = cards.find(c => c.id === this.id);
        return card ?? null;
    }

}