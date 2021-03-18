export function jsonSafeParse(raw: string, fallback?: any, reviver?: (this: any, key: string, value: any) => any): any {
    try {
        return JSON.parse(raw, reviver);
    }
    catch {
        return fallback;
    }
}
