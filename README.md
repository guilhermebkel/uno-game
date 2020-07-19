<p align="center">
	<img src="./assets/uno_icon.png" height="150" width="150" alt="icon example" />
</p>	

<h3 align="center">
  A WIP UNO Game made in Javascript 🎴
</h3>

<p align="center">
	<a href="https://lerna.js.org/">
		<img alt="lerna" src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="maintained with lerna"/>
	</a>
	<a href="https://github.com/microsoft/TypeScript">
		<img alt="typescript" src="https://camo.githubusercontent.com/41c68e9f29c6caccc084e5a147e0abd5f392d9bc/68747470733a2f2f62616467656e2e6e65742f62616467652f547970655363726970742f7374726963742532302546302539462539322541412f626c7565">
	</a>
	<a href="https://github.com/guilhermebkel/uno-game">
		<img alt="mit license" src="https://img.shields.io/github/license/guilhermebkel/uno-game?color=0051ff" />
	</a>
</p>

## 📌 Overview

A simple UNO Game made in Javascript, supposed to be blazing easier and faster than Gartic to start playing. 

## 🔧 Technologies

- Typescript
- React.js
- Socket.io
- Lerna
- Express
- Material UI
- Husky
- Lint Staged
- Git Commit Message Linter
- ESLint

## 🌇 Case Study
**What the user is supposed to do**
1. Go to Dashboard
2. Create a new room
3. Get into the created room
5. Start playing after the room gets filled

**What the user can do**
- See the existing rooms
- Send messages to the chat
- See the messages sent to the chat
- Invite friends to play together
- Make automatized plays if he is AFK

**What the user can not do**
- Make an invalid play (not allowed by server)

**Business rules**
- A room only exists if there's at least one player inside it


## 👣 Project Scope

- [X] Implementing a basic Table Page which I can use to move and buy cards.
- [X] Implementing a server integration with Table Page to make it to work.
- [ ] Refactoring the Table Page to give it a better looking.
- [X] Creating a Dashboard Page which I can use to see open rooms, create new ones and get into the ones I want to.
- [X] Implementing a server integration with Dashboard Page to make it to work.
- [ ] Refactoring the Dashboard Page to give it a better looking.
- [X] Creating a Room Page which I can use to get into a room and see its details.
- [X] Implementing a server integration with Room Page to make it to work.
- [ ] Refactoring the Room Page to give it a better looking.
- [X] Implementing a monorepository manager.
- [ ] Updating README with new info (new badges, how to get started and so on...).
- [ ] Implementing sounds.
- [X] Adding a simple account service.
- [ ] Adding an account service.
- [X] Making husky to work.
- [ ] Making CI with Github Actions.
