## What this is

An attempt to use <https://replicad.xyz> to build an isomorphic keyboard. Work in progress.

## How to use

I still have not tried to replicate the workflow on another machine.
However, this should work.

Install deps with

```bash
bun install
```

Then start the compilation cycle with

```bash
bun build ./src/index.ts --outfile ./dist/bundle.js \
  --format esm --watch
```

Lastly, visit <https://studio.replicad.xyz/visualiser> with a Chromium-equivalent browser and point it to `dist/bundle.js`. Everything should magically update as you edit the project.

### For Nix people

If you are a Nix [user](https://en.wikipedia.org/wiki/Addiction) like yours truly, the incantations would be respectively:

```bash
nix run .#install-deps
```

```bash
nix run .#watch
```

I intend to nixify this properly one day.

## Re. code style

I have no experience with TypeScript, I'm treating it more like an uncomfortable instrument.
That's why I write TypeScript pretending it's a functional language.
I know it's not idiomatic, and what is more readable to me will be less readable to seasoned TypeScript devs. 
If something is unclear to you and you would like to understand what it is/does, open an issue or get in touch somehow.
I am always happy to corrupt more people.
