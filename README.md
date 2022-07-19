# Steps to Contribute

### If you wish to contribute to the user guide, kindly join our slack channel to align and discuss.
<a href="https://join.slack.com/t/automatest-workspace/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw" target="_blank"><img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="automatest-workspace" width="50" height="50"/></a>

### The contribution process is very simple:
1. Fork this project.
2. Create your own .md files under the "docs" directory. you can follow the provided sample to learn how to use markdown syntax for the .md files and you can use something like https://dillinger.io/ to help you create the .md file.
3. Edit this file https://github.com/ShaftHQ/SHAFT_Engine_Docusaurus/blob/master/sidebars.js to add your newly created .md file.
4. Follow the steps here https://github.com/ShaftHQ/SHAFT_Engine_Docusaurus#installation to build and run the project locally to make sure that it's working as expected.
5. Create a pull request to merge your contribution to the main user guide project.
6. After the PR is reviewed and merged, the new docs will be built and released automatically via CI/CD to this url: https://ShaftHQ.github.io/SHAFT_Engine_Docusaurus/

# SHAFT User Guide

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

```
$ GIT_USER=<Your GitHub username> USE_SSH=true yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
