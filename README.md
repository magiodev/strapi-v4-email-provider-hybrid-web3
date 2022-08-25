# Strapi v4 Email Provider Hybrid Web3

Override of the default Strapi v4 email provider to work with Web3 wallets in hybrid mode.

## Goal

Creating a hybrid Authentication/Authorization system based on the default Email provider of Strapi v4 REST API
framework. Let the user being able to authenticate by signing unique off-chain ECDSA messages to avoid replay attacks.

## Explanation

In order to achieve our goal, to let the user experience being simpler as possible, and to let the standard email
provider from Strapi untouched as much as we will:

- Adopt a username only authentication method
- Use the username field to store the unique wallet address
- Make the email field optional
- Ignoring username and password on user update
- Deprecate the password field as we will authenticate users with ECDSA signed message
- Create an entity/model (or content-type as Strapi defines) named AuthMessage that we will use to avoid replay attacks
- Implementing Web3.js library to recover() address who signed the message

## Replay attacks concept

It's important to permanently store on our off-chain infrastructure the list of already signed messages in order to
avoid replay attacks. Imagine that a hacker was able to save a signed message from an user, if we do not invalidate it
the attacked would be able to authenticate during lifetime.
To avoid security issues and, I implemented the use of a starting letter on the generated messages. In cases like losing
the stored list you will be able to invalidate all the "old generation" by simply changing the starting letter and start
using the new one (A to B) and start again freshly.

## Email confirmation

User will be created as not confirmed without email. When a user update his account filling email we follow the standard confirmation workflow.

<hr/>

## Usage

Copy and paste the files inside your Strapi v4 project.
Add the required .env parameters to your Strapi v4 project .env file.

## Configuration

You have to set User-permissions for the new Content-type and the new Authentication provider. To do so go on Strapi backend > Settings > USERS & PERMISSIONS PLUGIN > Roles, and enable only the following methods:

### AuthMessage
- Public: ['find']
- Authenticated: []

### User-permissions
- Public: ['callback', 'emailConfirmation']
- Authenticated: ['emailConfirmation', 'update', 'me']

<hr/>

#### Requirements

You need to have Strapi v4 framework with User Permissions plugin.


<hr />

# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project. Find the one that suits you on the [deployment section of the documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment.html).

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://docs.strapi.io) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
