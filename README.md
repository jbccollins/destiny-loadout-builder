This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

#### Create a your own app on Bungie.net
TODO: Fill in instructions on how to do this and what to put
in the .env.local file

#### Get a DIM API key
TODO: Fill in instructions on how to do this. This probably is optional for most people

#### Installation
Install the required packages using

```bash
npm i
```

#### Get local SSL working

The Bungie API requires that your app run using https due to some OAuth stuff. To make https work locally we hack up a local ssl certificate.

The local dev server will run on [http://localhost:40001](http://localhost:4001)

Before doing anything else run these commands ([source](https://github.com/vercel/next.js/discussions/10935#discussioncomment-2855809)):
     
> brew install mkcert
> mkcert -install
> mkcert localhost
> npm install -g local-ssl-proxy // This actually is done with npx in the script so it's not necessary atm
TODO: Can local-ssl-proxy be installed as a dev dependency instead??


#### Run the app!
Run the development server:

```bash
npm run dev
```

Open [http://localhost:40001](http://localhost:4001) with your browser to see the result.

You can start editing any file and see your changes automatically propagate to the browser.

## Deploy on Vercel

Just push to master. It will deploy automatically [here](https://vercel.com/jbccollins/destiny-loadout-builder).

### Attribution
#### Many thanks to the folks behind these projects:
- DIM
- D2ArmorPicker
- [Destiny Sets](https://discord.com/channels/296008008956248066/296008136785920001/899068290138275921)
- Destiny Data Explorer

### TODOS
- Turn strict mode back on in tsconfig.json