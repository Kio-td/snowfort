<center>
    <h1>Snowfort</h1>
</center>

Snowfort is a framework for Eris developed by Kio.

It's simple to use, I think. Not sure yet.

## Installation
Requirements:
 - NodeJS
 - Some sort of Database
    - SQLite works, but is not recommended.

```bash
git clone https://github.com/kio-td/snowfort
cd snowfort
npm install
node --loader ts-node/esm --inspect ./index.ts
```

## Changes you need to make to your code
- Snowfort has a custom message system. Sanity requires you to use msg.* instead of console.* (console.log -> msg.log ), to make everything look inline.

- Make full utilization of the constructors! They're there for you.

- Snowfort uses Eris, not D.JS, which is known to be much quicker and light-footed than D.JS, but strips some of the bells and whistles that D.JS offers. I'm not retrofitting D.JS, so please check that you code works with either Snowfort Compatibility, or Eris.
