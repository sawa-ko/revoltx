<div align="center">

![RevoltX Logo](https://raw.githubusercontent.com/kaname-png/revoltx/development/.github/assets/logo-transparent.png)

# @kaname-png/revoltx

**Bots for Revolt powered by @sapphire/framework.**

[![GitHub](https://img.shields.io/github/license/kaname-png/revoltx)](https://github.com/kaname-png/revoltx/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/kaname-png/revoltx/branch/main/graph/badge.svg?token=0MSAyoZNxz)](https://codecov.io/gh/kaname-png/revoltx)
[![npm](https://img.shields.io/npm/v/@kaname-png/revoltx?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@kaname-png/revoltx)
[![npm](https://img.shields.io/npm/dt/@kaname-png/revoltx?color=crimson&logo=npm)](https://www.npmjs.com/package/@kaname-png/revoltx)

</div>

## Features

-   Full ESM
-   TypeScript & JavaScript support
-   Written in TypeScript
-   Completely Modular and Extendable
-   Command Handler, Arguments, Preconditions (soon) and Listeners Store

# 🔎 Introduction

RevoltX is a framework for creating Revolt bots, powered by the @sapphire/framework Arguments and Preconditions system.

With RevoltX you have at your disposal the creation of highly typed, secure and easy to make bots with a wide variety of tools and utilities available.

# ❗ Usage

Now you can continue installing the necessary packages.

```
npm i @kaname-png/revoltx revolt.js
```

### 🤖 Client

This is how the client is created and the bot is started.

```typescript
// client.js
import { Client } from '@kaname-png/revoltx';

const start = () => {
	const client = new Client({ prefix: '!' });
	await client.login('<BOT_TOKEN>');
};
```

Now you can start bot as follows:

```
node --experimental-specifier-resolution=node client.js
```

### 📁 Folder Structure

Once the client is created and instantiated, it is time to configure where all your commands, listeners, arguments, etc. are located.

```typescript
import { Client } from '@kaname-png/revoltx';
import { join } from 'path';
import { fileURLToPath } from 'url';

const start = () => {
	const client = new Client({ prefix: '!', baseDirectory: join(fileURLToPath(import.meta.url), '..') });
	await client.login('<BOT_TOKEN>');
};
```

Our project should have a folder structure like this.

```
├───commands
│   └───help.js
└───client.js
```

If you want to change the path of the client instance, for example, to be inside a directory called `lib`, you can do the following.

```typescript
import { Client } from '@kaname-png/revoltx';
import { join } from 'path';
import { fileURLToPath } from 'url';

const start = () => {
	const client = new Client({ prefix: '!', baseDirectory: join(fileURLToPath(import.meta.url), '..', '..') });
	await client.login('<BOT_TOKEN>');
};
```

Our project should have a folder structure like this.

```
├───commands
│   └───help.js
└───lib
    └───client.js
```

And so, you can choose the place you want.

# 📝 Create command

Basic structure of a basic command.

```typescript
// commands/help.ts
import { Command } from '@kaname-png/revoltx';
import type { Message } from 'revolt.js/dist/maps/Messages';
import type { PieceContext } from '@sapphire/pieces';

export class HelpCommands extends Command {
	// If you need to add extra options to the command, you can do it in the constructor, it is not required if you don't need to add options.
	constructor(context: PieceContext) {
		super(context, {
			/*optional commands options*/
		});
	}

	public async run(message: Message) {
		return message.reply('@kaname-png/revoltx');
	}
}
```

# 🔉 Create listener

Basic structure of a basic listener.

```typescript
// listener/message.ts
import { Listener, ClientEvents } from '@kaname-png/revoltx';
import type { Message } from 'revolt.js/dist/maps/Messages';
import type { PieceContext } from '@sapphire/pieces';

export class MessageListener extends Listener {
	// You can set the event name you need.
	constructor(context: PieceContext) {
		super(context, { event: ClientEvents.MessageCreate /* More listener optional options*/ });
	}

	public async run(message: Message) {
		return message.reply('@kaname-png/revoltx');
	}
}
```

# 🛡️ Create Argument

Basic structure of a basic argument.

```typescript
// arguments/serverOwner.ts
import type { PieceContext } from '@sapphire/pieces';

import { Argument, ArgumentResult } from '../lib/structures/argument';
import type { ArgumentContext } from '../utils/interfaces/argument';

// <boolean> is for TypeScript users only.
export class CoreArgument extends Argument<boolean> {
	// Asign name of argument
	public constructor(context: PieceContext) {
		super(context, { name: 'ServerOwner' });
	}

	public run(parameter: string, context: ArgumentContext): ArgumentResult<boolean> {
		const resolved = message.member?.server?.owner !== parameter;
		if (resolved) return this.ok(true);

		return this.error({
			parameter,
			identifier: resolved.error,
			message: 'The argument did not resolve to server owner.',
			context
		});
	}
}

// For TypeScript users only.
declare module '@kaname-png/revoltx' {
	interface ArgType {
		// The type returned by the this.ok() method;
		ServerOwner: boolean;
	}
}
```

# 📚 Notes

1. More examples in the comments of the corresponding classes.
2. The examples shown are written in TypeScript, but you can replicate them in JavaScript by simply removing the variable types.

#### Example of converting TypeScript code to JavaScript code:

> This also applies to arguments and listeners.

TypeScript code

```typescript
// commands/help.ts
import { Command } from '@kaname-png/revoltx';
import type { Message } from 'revolt.js/dist/maps/Messages';
import type { PieceContext } from '@sapphire/pieces';

export class HelpCommands extends Command {
	// If you need to add extra options to the command, you can do it in the constructor, it is not required if you don't need to add options.
	constructor(context: PieceContext) {
		super(context, {
			/*optional commands options*/
		});
	}

	public run(message: Message) {
		return message.reply('@kaname-png/revoltx');
	}
}
```

JavaScript code

```javascript
// commands/help.js
import { Command } from '@kaname-png/revoltx';

export class HelpCommands extends Command {
	// If you need to add extra options to the command, you can do it in the constructor, it is not required if you don't need to add options.
	constructor(context) {
		super(context, {
			/*optional commands options*/
		});
	}

	run(message) {
		return message.reply('@kaname-png/revoltx');
	}
}
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
