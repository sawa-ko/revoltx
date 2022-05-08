<div align="center">

![RevoltX Logo](https://raw.githubusercontent.com/kaname-png/revoltx/development/.github/assets/logo-transparent.png)

# @kaname-png/revoltx

**Create Revolt bots in a simple, fast and fun way**

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
-   Command Handler, Arguments, Preconditions and Listeners Store
-   Powered by [@sapphire/framework](https://github.com/sapphiredev/framework) preconditions and arguments system

# 🔎 Introduction

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
import { join } from 'path';
import { fileURLToPath } from 'url';

const start = () => {
	const client = new Client({ prefix: '!' });
	await client.login('<BOT_TOKEN>');
};

void start();
```

Now you can start bot as follows:

```
node --experimental-specifier-resolution=node client.js
```

To set the path to the commands, listeners, etc. you need to indicate the path to your "main.js" file (the file which starts your bot) in the "main" property of your `package.json` file.

> Remember that the name of your main file `(main.js)` is up to you.

For JavaScript it should be for example:

```json
{
	"name": "my-awesome-bot",
	"version": "1.0.0",
	"main": "src/main.js"
}
```

For TypeScript it should be for example:

```json
{
	"name": "my-awesome-bot",
	"version": "1.0.0",
	"main": "dist/main.js"
}
```

### 📁 Folder Structure

Once the client is created and instantiated, it is time to configure where all your commands, listeners, arguments, etc. are located.

```typescript
import { Client } from '@kaname-png/revoltx';
import { join } from 'path';
import { fileURLToPath } from 'url';

const start = () => {
	const client = new Client({ prefix: '!' });
	await client.login('<BOT_TOKEN>');
};
```

Our project should have a folder structure like this.

```
├───commands
│   └───help.js
└───main.js
```

# 📝 Create command

Basic structure of a basic command.

Commands are actions that users can request to the bot by means of a prefix and command name, e.g.: `n!help`.

```typescript
// commands/help.ts
import { Command } from '@kaname-png/revoltx';
import type { Message } from 'revolt.js';
import type { PieceContext } from '@sapphire/pieces';

export class HelpCommands extends Command {
	// If you need to add extra options to the command, you can do it in the constructor, it is not required if you don't need to add options.
	constructor(context: PieceContext) {
		super(context, {
			alias: ['helpme']
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

The listeners have the function of listening to events that the client emits by default, but you can assign the emitter you need and listen to the events of that emitter.

```typescript
// listener/message.ts
import { Listener, ClientEvents } from '@kaname-png/revoltx';
import type { Message } from 'revolt.js';
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
Arguments are parameters that the bot receives from the message sent by the user. This argument system allows to use arguments dynamically as needed, and not only by configuring the command options.

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
		const resolved = message.member?.server?.owner === parameter;
		if (!resolved) return this.ok(true);

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

// Command Usage
// User Input: n!server @kaname-png
import { Args, Command } from '@kaname-png/revoltx';
import type { Message } from 'revolt.js';

export class ServerCommand extends Command {
	public run(message: Message, args: Args) {
		const owner = await args.pick('ServerOwner');
		return message.channel?.sendMessage(owner ? 'You are server owner.' : 'You are not the owner of the server.');
	}
}
```

# 🛡️ Create Precondition

Basic structure of a basic precondition.

```typescript
// preconditions/nsfw.ts
import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'revolt.js';

import { Identifiers } from '../lib/errors/identifiers';
import { Precondition, PreconditionResult } from '../lib/structures/precondition';

export class CorePrecondition extends Precondition {
	public constructor(context: PieceContext) {
		super(context, { name: 'NSFW' });
	}

	public run(message: Message): PreconditionResult {
		return message.channel?.nsfw === true
			? this.ok()
			: this.error({ identifier: Identifiers.PreconditionsNsfw, message: 'You cannot run this command outside NSFW channels.' });
	}
}

// For TypeScript users only.
declare module '@kaname-png/revoltx' {
	interface Preconditions {
		// Name of precondition
		NSFW: never;
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
import type { Message } from 'revolt.js';
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
<table>
  <tr>
    <td align="center"><a href="https://kaname.netlify.app"><img src="https://avatars.githubusercontent.com/u/56084970?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kaname</b></sub></a><br /><a href="https://github.com/kaname-png/revoltx/issues?q=author%3Akaname-png" title="Bug reports">🐛</a> <a href="https://github.com/kaname-png/revoltx/commits?author=kaname-png" title="Code">💻</a> <a href="https://github.com/kaname-png/revoltx/commits?author=kaname-png" title="Documentation">📖</a> <a href="#ideas-kaname-png" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-kaname-png" title="Maintenance">🚧</a> <a href="#projectManagement-kaname-png" title="Project Management">📆</a> <a href="https://github.com/kaname-png/revoltx/pulls?q=is%3Apr+reviewed-by%3Akaname-png" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
