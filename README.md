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

User will be created as not confirmed without email. When a user update his account filling email field

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
