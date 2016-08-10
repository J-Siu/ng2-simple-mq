import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';

interface MQ {
	[name: string]: {
		s: Subject<any>,
		o: Observable<any>
	};
}

interface SubscriptionList {
	[id: string]: {
		name: string,
		subscription: Subscription
	};
}

@Injectable()
export class SimpleMQ {

	private uuid = require('node-uuid');

	private mq: MQ = {};
	private subscription: SubscriptionList = {};

	getQueue(): string[] {
		return Object.keys(this.mq);
	}
	getSubscription(): string[] {
		return Object.keys(this.subscription);
	}
	newQueue(name: string): boolean {
		if (name === undefined || this.mq[name]) {
			return false;
		}
		let s = new Subject<any>();
		let o = s.asObservable();
		this.mq[name] = { 's': s, 'o': o };
		return true;
	}
	delQueue(name: string): boolean {
		if (name === undefined) {
			return false;
		}
		let s = this.getSubscription();
		// unsubscribe all subscription for queue 'name'
		s.forEach(i => {
			if (this.subscription[i].name === name) {
				this.unsubscribe(i);
			}
		});
		// delete queue 'name' subject and observable
		delete this.mq[name].o;
		delete this.mq[name].s;
		delete this.mq[name];
	}
	publish(name: string, msg: any, lazy = true): boolean {
		if (msg === undefined || name === undefined) {
			return false;
		}
		if (lazy) {
			this.newQueue(name);
		} else if (!this.mq[name]) {
			return false;
		}
		this.mq[name]['s'].next(msg);
		return true;
	}
	subscribe(name: string, callback: (any) => void, lazy = true): string {
		if (name === undefined || callback === undefined) {
			return '';
		}
		if (lazy) {
			this.newQueue(name);
		} else if (!this.mq[name]) {
			return '';
		}
		let id = name + '-' + this.uuid.v1();
		this.subscription[id] = {
			name: name,
			subscription: this.mq[name]['o'].subscribe(callback)
		}
		return id;
	}
	unsubscribe(id: string): boolean {
		if (!id || !this.subscription[id]) {
			return false;
		}
		this.subscription[id].subscription.unsubscribe();
		delete this.subscription[id];
	}
}
