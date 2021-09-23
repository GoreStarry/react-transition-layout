# react-scss-modules-storybook-library-template

template to create reusable react components

* `create-react-app` based
  * CSS modules
  * SASS(SCSS)
* `Storybook` set by preset-create-react-app
* build package bundle by `Rollup.js`
* generate storybook site and also create default App page to `gh-pages` folder
---
## `Ｗarning：`Can't write JSX in `.js` file, use `.jsx` instead
It's Rollup.js bundle error... you can try to fix it and create a pull request THX~~

---
## `Ｗarning：`Import by relative path directly


If you import this lib directly by relative path, not by package. 
maybe you will get the Error message

```
Invalid hook call. Hooks can only be called inside of the body of a function component. 
```

It's since you got the duplicate React.

Try link the repo to resolve this.

```sh
npm link ../your_lib_path/node_modules/react
```


---
## Available Scripts

In the project directory, you can run:

### `npm run build`
* bundle components package to `dist` folder
* create App index page to `gh-pages` (default ignored)
* storybook site to `gh-pages/storybook`

### `npm run dev`
* watch package rollup bundle
* watch storybook

---
## Inspired by 
* [Creating a React Component Library using Rollup, Typescript, Sass, and Storybook by Harvey Delaney](https://blog.harveydelaney.com/creating-your-own-react-component-library/)


