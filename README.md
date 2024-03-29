# Angular Simple MQ [![Paypal donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/donate/?business=HZF49NM9D35SJ&no_recurring=0&currency_code=CAD)

A simple message queue for Angular inter-component communication base on RxJS.

Name/ID(string) base API. RxJS object not exposed.

(This package does not communicate with RabbitMQ nor any other message queue software/service.)

> To enable faster update, ng2-simple-mq switched to Angular CLI starting 8.2.0 and use new repository https://github.com/J-Siu/ng2-simple-mq-lib/
>
> Project contains both library and example.
>
> All version < 8.2.0 are in old repository https://github.com/J-Siu/ng2-simple-mq/

### Table Of Content
<!-- TOC -->

- [Install](#install)
- [Usage](#usage)
  - ["noImplicitAny": false](#noimplicitany-false)
  - [Import into Angular 2 application typescript](#import-into-angular-2-application-typescript)
  - [API](#api)
      - [newQueuename: string: boolean](#newqueuename-string-boolean)
      - [delQueuename: string: boolean](#delqueuename-string-boolean)
      - [getQueue: string[]](#getqueue-string)
      - [getSubscription: string[]](#getsubscription-string)
      - [publishname: string, msg: any, lazy = true: boolean](#publishname-string-msg-any-lazy--true-boolean)
      - [subscribename: string, callback: any => void, lazy = true: string](#subscribename-string-callback-any--void-lazy--true-string)
      - [unsubscribeid: string: boolean](#unsubscribeid-string-boolean)
- [Example](#example)
- [Contributors](#contributors)
- [Changelog](#changelog)
- [License](#license)

<!-- /TOC -->

### Install

```sh
npm install ng2-simple-mq
```

### Usage

#### "noImplicitAny": false

Must set `"noImplicitAny": false` in application __tsconfig.json__. Else following error may occur at build time:

    error TS7006: Parameter 'any' implicitly has an 'any' type

#### Import into Angular 2 application (typescript)

`ng2-simple-mq` is implemented as Angular 2 injectable service name __SimpleMQ__.

__For module using SimpleMQ__

Add `SimpleMQ` into module providers (eg. [app.module.ts](https://github.com/J-Siu/ng2-simple-mq-example/blob/master/app/app.module.ts)).

```javascript
import { SimpleMQ } from 'ng2-simple-mq';

@NgModule({
	providers: [SimpleMQ]
})
```

__For each child component using SimpleMQ__

```javascript
import { SimpleMQ } from 'ng2-simple-mq';

export class ChildComponent {

	constructor(private smq: SimpleMQ) { }

}
```

#### API

###### newQueue(name: string): boolean

`newQueue` will create queue `name`.

Return `false` if queue `name` exist.

```javascript
this.smq.newQueue('broadcast');
```

###### delQueue(name: string): boolean

`delQueue` will delete queue `name`.

Return `false` if queue `name` does not exist.

```javascript
this.smq.delQueue('broadcast');
```

###### getQueue(): string[]

`getQueue` will return all queue name in string array.
```javascript
let q: string[] = this.smq.getQueue();
```

###### getSubscription(): string[]

`getSubscription` will return all subscription id in string array.
```javascript
let ids: string[] = this.st.getSubscription();
```

###### publish(name: string, msg: any, lazy = true): boolean

`publish` will put `msg` into queue `name`.

If `lazy = true`(default), queue `name` will be created automatically if not exist yet.

Return true if successful.

Return false if any of following is true:
- `lazy = false`, and queue `name` does not exist.
- `name` is undefined.
- `msg` is undefined.

```javascript
// lazy mode
message = 'This is a broadcast message';
this.smq.publish('broadcast',message);
```

###### subscribe(name: string, callback: (any) => void, lazy = true): string

`subscribe` will link `callback` function to queue `name`. Whenever queue `name` receive a new message, `callback` will be invoked.

If `lazy = true`(default), queue `name` will be created automatically if not exist yet.

Return subscription id if successful.

Return empty string if any of following is true:
- `lazy = false`, and queue `name` does not exist.
- `name` is undefined.
- `callback` is undefined.

Either use Lambda(fat arrow) in typescript to pass in callback or bind `this` to another variable in javascript, else `this` scope will be lost.

__Lambda(fat arrow)__
```javascript
broadcastMsg;

ngOnInit() {
	// lazy mode
	this.smq.subscribe('broadcast', e => this.receiveBroadcast(e));
}

receiveBroadcast(m) {
	this.broadcastMsg = m;
}
```

###### unsubscribe(id: string): boolean

`unsubscribe` will cancel subscription using `id`.

`unsubscribe` will return false if `id` is undefined or `id` is not found in subscription list.

```javascript
id: string;

this.st.unsubscribe(this.id);
```

### Example

Github: [ng2-simple-mq-example](https://github.com/J-Siu/ng2-simple-mq-example)
Plunker: [Angular2 Simple MQ Example](http://embed.plnkr.co/e8Crbf/)

### Contributors

* [John Sing Dao Siu](https://github.com/J-Siu)

### Changelog

* 0.1.0-alpha - Initial
* 0.1.1-alpha - Add Readme.md
* 0.1.2-alpha - Readme.md fix
* 0.1.3-alpha - Fix components.js
* 0.2.0
	- Complete Readme.md
	- Fix index.js and index.d.ts
* 0.2.1
	- API change
		- newQueue return boolean
	- API new
		- delQueue
		- getSubscription
		- unsubscribe
* 0.2.2
	- Support Angular2 RC5
* 0.2.3
	- Fix Readme.md
* 1.2.4
	- Support Angular2 ^2.0.0
	- Clean up package
* 1.2.5
	- Add Plunker example
* 1.2.6
	- Support Angular2 ^2.4.1
	- Replace node-uuid with angular2-uuid
	- Add instruction for `"noImplicitAny": false`
* 1.2.7
	- Due to the rapid release cycle of Angular, to minimize
		update purely due to `peerDependencies`,
		it is modified as follow:
		`"peerDependencies": { "@angular/core": ">2.4.1" }`
* 1.2.8
	- Update to support Angular 4.3.1. Please use previous version for Angular 2.x.x.
* 1.2.9
	- Fix issue#2 `delQueue`

### License

The MIT License

Copyright (c) 2017

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
