# Getting Started

## Create New App in Bungie Developer Portal

1. Visit [**Bungie Developer Portal**](https://www.bungie.net/en/Application)
2. Fill the inputs:
   - Application Name `(Whatever you want)`
   - Website `(Optional)`
   - OAuth Client Type `(Confidential Recommended)`
   - Redirect URL `(https://localhost:4001/oauth-return)`
   - Scope
     - `Read your Destiny 2 information`
     - `Move or equip Destiny gear and other items.`
   - Origin Header `(*)`
3. Agree to [**Bungie Terms**](https://www.bungie.net/7/en/Legal/Terms)
4. Create New App

## Set the environment variables

You'll find a file in the root directory named `.env.example`.

> You can rename it to either `.env` or `.env.whatever` both will work.

Fill the keys like so

```bash
NEXT_PUBLIC_BNET_API_KEY="YOUR_BUNGIE_API_KEY"
NEXT_PUBLIC_BNET_OAUTH_CLIENT_ID="YOUR_BUNGIE_CLIENT_ID"
BNET_OAUTH_CLIENT_SECRET="YOUR_BUNGIE_CLIENT_SECRET"
```

## Get a DIM API Key `(Optional)`

If you want to locally develop any feature that touches the DIM loadouts integration you will need a DIM API Key. You can get a DIM API Key that will work for `localhost` by following [**these instructions**](https://github.com/DestinyItemManager/dim-api#get-an-api-key).

Add that key to `.env.local` like so:

```bash
NEXT_PUBLIC_DIM_API_KEY="YOUR_DIM_API_KEY"
```

## Installation

Install the required npm packages. From the root directory run:

```bash
npm i
```

## Run the App!

From the root directory run

```bash
npm run dev
```

> **IMPORTANT:** Make sure you have the local SSL working to get that make sure in the `package.js` in the dev script you have this flag `--experimental-https` when running the app, you should see a new auto-created folder named certificates, containing the certificates if this does not work, ensure that you run VSCode in administrator mode at least once.

## Deploy on Vercel

Just push to the master branch. It will deploy automatically [**here**](https://vercel.com/jbccollins/destiny-loadout-builder).

## Attribution

##### Contributions

[**View the list of contributors to this project here**](https://github.com/jbccollins/destiny-loadout-builder/blob/main/AUTHORS.md)

##### Many thanks to the folks behind these projects:

- [**Destiny Item Manager**](https://destinyitemmanager.com/)
- [**D2ArmorPicker**](https://d2armorpicker.com/#/)
- [**Destiny Sets**](https://data.destinysets.com/)
- [**Destiny Api Discussion Discord**](https://discord.com/channels/296008008956248066)
