<p align="center">
	<img src="./assets/uno_icon.png" width="200" alt="icon example" />
</p>	

<h3 align="center">
  An UNO Game made in Javascript 🎴
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
<p align="center">
	<a href="https://github.com/guilhermebkel/uno-game">
		<img alt="unoenty build" src="https://github.com/guilhermebkel/uno-game/workflows/Unoenty%20CI/badge.svg" />
	</a>
	<a href="https://github.com/guilhermebkel/uno-game">
		<img alt="unapy build" src="https://github.com/guilhermebkel/uno-game/workflows/Unapy%20CI/badge.svg" />
	</a>
</p>

<p align="center">
	<img src="./assets/main_preview.gif" alt="mockup" />
	<br></br>
	<a href="https://uno.guilherr.me">Click here to play this game</a>
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
- React DnD
- MsgPackParser

## 🚀 Getting started

1. Clone this repository
2. Run the following command
```sh
# Install all shared dependencies
# Install dependencies for api
# Install dependencies for client
# Link all packages dependencies together
# Add env file for api
# Add env file for client
npm run setup
```

3. Run the command below inside the root folder to startup all the needed resources (such as Redis).
```sh
npm run dev:resources
```

3. Run the command bellow inside **packages/unoenty** and **packages/unapy** to start api and client.
```sh
npm run dev
```

Right here everything should be working fine. So, **api** will be available at **http://localhost:5000** and **client** will be available at **http://localhost:4000**.

## 👏 Contributing

1. Clone this repository to your machine.
2. Create a new branch locally following the **Git Karma** pattern. Ex: feat/my-awesome-feature.
3. Then, after coding your contribution, make a merge request for your branch.

## 🗺️ Roadmap
Since we want to keep improving this game, you are able to see what we plan to do next on our [**Roadmap**](https://github.com/guilhermebkel/uno-game/projects/1). Any idea or suggestion of improvement and bug solving is welcome!

## 💫 Contributors

Thanks to all the people who contributed on this project!

<table>
  <tr>
    <td align="center">
			<a
				href="https://github.com/ArcaneDiver" 
				title="ArcaneDiver"
			>
				<img src="https://avatars.githubusercontent.com/ArcaneDiver" width="100px;" alt=""/>
				<br />
				<sub>
					<b>Michele Della Mea</b>
				</sub>
			</a>
		</td>
		<td align="center">
			<a
				href="https://github.com/lcscout" 
				title="lcscout"
			>
				<img src="https://avatars.githubusercontent.com/lcscout" width="100px;" alt=""/>
				<br />
				<sub>
					<b>Lucas Coutinho de Oliveira</b>
				</sub>
			</a>
		</td>
  </tr>
</table>
