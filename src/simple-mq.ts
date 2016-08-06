import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

interface MsgQueue {
	[name: string]: {
		s: Subject<any>,
		o: Observable<any>
	};
}

@Injectable()
export class SimpleMQ {
	private msgQueues: MsgQueue = {};

	getQueue(): string[] {
		return Object.keys(this.msgQueues);
	}
	newQueue(name: string): void {
		if (this.msgQueues[name] === undefined) {
			let s = new Subject<any>();
			let o = s.asObservable();
			this.msgQueues[name] = { 's': s, 'o': o };
		}
	}
	publish(name: string, msg: any, lazy = true): boolean {
		if (lazy) {
			this.newQueue(name);
		} else if (!this.msgQueues[name]) {
			return false;
		}
		this.msgQueues[name]['s'].next(msg);
		return true;
	}
	subscribe(name: string, callback: (any) => void, lazy = true): boolean {
		if (lazy) {
			this.newQueue(name);
		} else if (!this.msgQueues[name]) {
			return false;
		}
		this.msgQueues[name]['o'].subscribe(callback);
		return true;
	}
	log(): void {
		console.log(this.msgQueues);
	}
}
