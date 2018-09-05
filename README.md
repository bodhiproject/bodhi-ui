<h1 align="center">
Bodhi UI
</h1>
<p align="center">
ReactJS frontend that interacts with the Bodhi backend services
</p>

<p align="center">
    <a href="https://travis-ci.org/bodhiproject/bodhi-ui" target='_blank'>
      <img src="https://travis-ci.org/bodhiproject/bodhi-ui.svg?branch=master" alt="Travis Build Status"/>
    </a>
    <a href="https://github.com/bodhiproject/bodhi-ui/pulls">
      <img src="https://camo.githubusercontent.com/d4e0f63e9613ee474a7dfdc23c240b9795712c96/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5052732d77656c636f6d652d627269676874677265656e2e737667" />
    </a>
</p>

## Get Started

### Requirements

- [Node](https://nodejs.org/en/) version greater than 8.6.0
- [Yarn](https://yarnpkg.com/lang/en/) or [npm](https://www.npmjs.com/) version greater than 6.0.0

### Install
```bash
$ git clone https://github.com/bodhiproject/bodhi-ui.git
$ cd bodhi-ui
$ yarn
$ yarn upgrade    // this is important
$ npm install
```

### Development Environment
To run the development server, run the corresponding run script and the API will point to the remote server with the correct port. After compilation, it will show success commands & automatically redirect to the browser. Any code changes will be observed and will hot reload.
```bash
// Mainnet chain
$ yarn start:mainnet

// Testnet chain
$ yarn start:testnet

// Regtest chain - very fast block mining, can also mine blocks with API call
$ yarn start:regtest
```

### Production Build
To create an optimized production build of the app, you need to run a build command in you terminal at app root. Use the build command specific to the chain you want to point to. The build output files will be in `/build`.
```bash
// Mainnet chain
$ yarn build:mainnet

// Testnet chain
$ yarn build:testnet

// Regtest chain - very fast block mining, can also mine blocks with API call
$ yarn build:regtest
```

## Standards

### Javascript Standard

[![Airbnb Javascript Style Guide](https://camo.githubusercontent.com/546205bd8f3e039eb83c8f7f8a887238d25532d5/68747470733a2f2f7261772e6769746861636b2e636f6d2f746f6d656b77692f6a6176617363726970742f393566626638622f6261646765732f6269672e737667)](https://github.com/airbnb/javascript)

### Linting

```bash
$ npm run lint:fix    // get sweet link checking and fixing
$ npm run lint        // to see whats wrong
```

## Localization
`react-intl` is used for localization.

### Using FormattedMessage
- Try to use FormattedMessage whenever possible.
- `id` should match the id in the JSON file with all the strings.
- Put the default text inside `defaultMessage`.
- Dynamic variables can be declared in the `values` property.
```js
<FormattedMessage
  id='app.greeting'
  description='Greeting to welcome the user to the app'
  defaultMessage='Hello, {name}!'
  values={{
    name: 'Eric'
  }}
/>
```

### Using formatMessage
- For use with inline strings like string templates.
- Define messages at the top of the file using `defineMessages`.
```js
const messages = defineMessages({
  greeting: {
    id: 'app.greeting',
    defaultMessage: 'Hello, {name}!',
  },
});

const localizedMessage = this.props.intl.formatMessage(messages.greeting, { { name: 'Eric' }});
// localizedMessage = 'Hello, Eric!'
```

### Run Language Script
1. Run `npm run build:langs`
2. Update the newly translated strings in the corresponding language file. The language file is in `./src/languageProvider/locales`.

**[LGPL-3.0 License](https://github.com/bodhiproject/bodhi-ui/blob/master/LICENSE)**
