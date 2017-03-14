import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import { UUID } from 'angular2-uuid';

interface MQ {
	[name: string]: {
		subject: Subject<any>,
		observable: Observable<any>
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
		this.mq[name] = { subject: s, observable: o };
		return true;
	}
	delQueue(name: string): boolean {
		if (name === undefined || !this.mq['name']) {
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
		delete this.mq[name].observable;
		delete this.mq[name].subject;
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
		this.mq[name].subject.next(msg);
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
		let id = name + '-' + UUID.UUID();
		this.subscription[id] = {
			name: name,
			subscription: this.mq[name].observable.subscribe(callback)
		}
		return id;
	}
	unsubscribe(id: string): boolean {
		if (id === undefined || !this.subscription[id]) {
			return false;
		}
		this.subscription[id].subscription.unsubscribe();
		delete this.subscription[id];
	}
}
