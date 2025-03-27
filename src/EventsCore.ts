import { Empty } from "./interfaces";

export default class EventsCore {
    private pull: any = {};

    constructor() {

    }

    public addEvent(key: string): void {
        if(!this.pull[key])this.pull[key] = [];
    }

    public addListener(key: string, f: Function): Function {
        this.addEvent(key);
        this.getListenersFor(key)?.push(f);
        return f;
    }

    public addOnceListener(key: string, f: Function): Function {
        this.addEvent(key);
        const sub: Function = (...args) => {
            this.removeListenerFor(key, sub);
            if(f)f(...args);
        };
        this.getListenersFor(key)?.push(sub);
        return sub;
    }

    public removeEvent(key: string) :void {
        if(!this.pull[key])return;

        delete this.pull[key];
    }

    public removeListener(f: Function): void {
        Object.keys(this.pull).forEach((key: string) => {
            this.removeListenerFor(key, f);
        });
    }

    public removeListenerFor(key: string, f: Function): void {
        const arr: Array<Function> | Empty = this.getListenersFor(key);

        if(!arr || !arr.length)return;

        const n: number = arr.indexOf(f);

        if(n !== -1)arr.splice(n, 1);
    }

    public callEvent(key: string, ...args): void {
        const arr: Array<Function> = this.pull[key];

        if(arr)arr.slice().forEach(f => f.apply(f, args));
    }

    private getListenersFor(key: string): Array<Function> | null | undefined {
        return this.pull[key];
    }

    public clear(): void {
        this.pull = {};
    }

    public waiter(event: string): Promise<any> {
        return new Promise((resolve: any) => {
            this.addOnceListener(event, resolve);
        });
    }

    public waiters(...events: Array<string>): Promise<any> {
        return Promise.all(events.map((key: string) => {
            return this.waiter(key);
        }));
    }
};