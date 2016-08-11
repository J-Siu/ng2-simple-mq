# ng2-simple-mq

A simple message queue for Angular 2 inter-component communication base on RxJS.

Name/ID(string) base API. RxJS object not exposed.

(This pacakge does not communicate with RabbitMQ or any other message queue software/service.) 

## Index

<!-- TOC -->

- [Install](#install)
- [Usage](#usage)
	- [Import into Angular 2 application (typescript)](#import-into-angular-2-application-typescript)
	- [API](#api)
		- [newQueue](#newqueuename-string-boolean)
		- [delQueue](#delqueuename-string-boolean)
		- [getQueue](#getqueue-string)
		- [getSubscription](#getsubscription-string)
		- [publish](#publishname-string-msg-any-lazy-true-boolean)
		- [subscribe](#subscribename-string-callback-any-void-lazy-true-string)
		- [unsubscribe](#unsubscribeid-string-boolean)
- [Example](#example)
- [Contributors](#contributors)
- [Changelog](#changelog)
- [License](#license)

<!-- /TOC -->
## Install

```
npm install ng2-simple-mq
```

## Usage

### Import into Angular 2 application (typescript)

ng2-simple-mq is implemented as Angular 2 injectable service name __SimpleMQ__.

```javascript
import {SimpleMQ} from 'ng2-simple-mq';
```

Add SimpleMQ into providers in your top level component (eg. [app.component.ts](https://github.com/J-Siu/ng2-simple-mq-example/blob/master/app/app.component.ts)).

__Do not add to providers of child component!__

```javascript
@Component({
	'selector': 'app-component',
	'template': `...`,
	'providers': [SimpleMQ],
	'directives': [
		OneComponent,
		TwoComponent]
})
```

For each child component require SimpleMQ, add to constructor.

```javascript
constructor(private smq: SimpleMQ) { }
```

### API

##### newQueue(name: string): boolean

`newQueue` will create queue `name`.

Return `false` if queue `name` exist.

```javascript
this.smq.newQueue('broadcast');
```

##### delQueue(name: string): boolean

`delQueue` will delete queue `name`.

Return `false` if queue `name` does not exist.

```javascript
this.smq.delQueue('broadcast');
```

##### getQueue(): string[]

`getQueue` will return all queue name in string array.
```javascript
let q: string[] = this.smq.getQueue();
```

##### getSubscription(): string[]

`getSubscription` will return all subscription id in string array.
```javascript
let ids: string[] = this.st.getSubscription();
```

##### publish(name: string, msg: any, lazy = true): boolean

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

##### subscribe(name: string, callback: (any) => void, lazy = true): string

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

##### unsubscribe(id: string): boolean

`unsubscribe` will cancel subscription using `id`.

`unsubscribe` will return false if `id` is undefined or `id` is not found in subscription list.

```javascript
id: string;

this.st.unsubscribe(this.id);
```

## Example

[ng2-simple-mq-example](https://github.com/J-Siu/ng2-simple-mq-example)


## Contributors

* John Sing Dao Siu (<john.sd.siu@gmail.com>)


## Changelog

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

## License

The MIT License

Copyright (c) 2016

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


