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

### download
```bash
$ git clone https://github.com/bodhiproject/bodhi-ui.git
$ cd bodhi-ui
$ yarn
$ yarn upgrade    // this is important
$ npm install
```

### to use

1. Start the app
  `yarn start` 
  After the compiled process completed successfully, it will show success commands & redirect to the http://localhost:3000/ of browser where you will find the login screen of the app.
2. To create an Optimized Product Build of the app, you need to run a build command in you terminal at app root.
  `yarn build`

## Development

### Prepare Database data

#### Importing

1. Use `which mongo` find mongo install directory, in which you will also find a mongorestore executable.

2. `mongorestore --db <dbname> topics.json`
  bodhi-ui use "bodhiapi" as <dbname>, if you use other name you need to go to bodhi-graphql/src/db/index.js to update it.
  This command will create a table with file name 'topics' in database <dbname>.

### Exporting

1. Use `which mongo` to find mongo install directory, in which you will also find a mongodump executable.

2. `mongodump --db bodhiapi --collection <colleciton_name> --out - > <output_path>/<filename>.bson` Note that filename is best to be same as collection name for the ease of importing.


## Coding

### Javascript Standard

[![Airbnb Javascript Style Guide](https://camo.githubusercontent.com/546205bd8f3e039eb83c8f7f8a887238d25532d5/68747470733a2f2f7261772e6769746861636b2e636f6d2f746f6d656b77692f6a6176617363726970742f393566626638622f6261646765732f6269672e737667)](https://github.com/airbnb/javascript)

### to do style checking

```bash
npm run lint:fix    // get sweet link checking and fixing
npm run lint        // to see whats wrong
```

### Responsive Layout

There are 2 ways to achieve responsive layout

1. Using React layout in js, for example use medium={4} to set column width and showOnlyFor={Breakpoints.SMALL} to set visible option on different devices

  ```js
    <Row>
      <Column small={6} medium={4}>
        <Callout color={Colors.SECONDARY}>
          <Block showOnlyFor={Breakpoints.SMALL}>On a small screen, I have gutters!</Block>
          <Block showOnlyFor={Breakpoints.MEDIUM}>On a medium screen, I have gutters!</Block>
          <Block showFor={Breakpoints.LARGE}>On a large screen, I have no gutters!</Block>
        </Callout>
      </Column>
    </Row>
  ```

2. Using Sass mixin defined in app/containers/app/index.scss. Media query variables are defined with the same value as those in Foundation. Usage example:

  ```css
    .some-class{
      @include breakpoint(small) {
          height: 20%;
      }
      @include breakpoint(medium) {
          height: 40%;
      }
    }
  ```

## Localization

for most of the text, use
  
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

put the default text inside defaultMessage, also you can put the variables within `{}` like the example.
For string inside placeholder or previous method can not handle, define messages in the top of the file using `defindMessages`

```js
  const messages = defineMessages({
      greeting: {
          id: 'app.greeting',
          defaultMessage: 'Hello, {name}!',
          description: 'Greeting to welcome the user to the app',
      },
  });
```

Then put `this.props.intl.formatMessage(messages.greeting, { {name: 'Eric'}})` at the place where you want to put the text, also support variables by putting variables within `{}`

Run `run build:langs`

update the translated string in the corresponding language file

The language file is in `./src/languageProvider/locales`

## [LGPL-3.0 License](https://github.com/bodhiproject/bodhi-ui/blob/master/LICENSE)
