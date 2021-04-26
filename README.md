# [blog.pixielabs.ai](http://blog.pixielabs.ai/) &middot; [![CC BY 4.0 license](https://img.shields.io/badge/license-CC%20BY%204.0-blue.svg)](https://creativecommons.org/licenses/by/4.0/) <a href="https://twitter.com/intent/follow?screen_name=pixie_run"><img src="https://img.shields.io/twitter/follow/pixie_run.svg?label=Follow%20@pixie_run" alt="Follow @pixie_run" /></a>

This repo contains the source code and content for the [Pixie Blog](http://blog.pixielabs.ai/) website.

## Reporting Issues
Submit any issues or enhancement requests by [filing an issue](https://github.com/pixie-labs/pixie-blog/issues/new). Please search for and review the existing open issues before submitting a new issue.

## Contributing

We are excited to have you contribute to Pixie's documentation! 

### Dev Setup

1. Fork this repo. 
2. Create a directory in `content/blogs`.
3. Add markdown files and media assets.
4. To run in development mode, run the following commands:
```shell
yarn install
yarn develop
```
5. Visit `http://localhost:8000/` to view the local build of the blog.
6. To generate a production build, run:
```shell
yarn install
yarn build
```
7. Submit a PR against the upstream  [repo](https://github.com/pixie-labs/pixie-blog).

### Markdown Guidelines

- Update `Author` , `Path`, `Title` and `Date`
- Update `category` as Guest Blogs, Pixie Team Blogs, Pixienaut Blogs
- Try to keep your images to be less than 1MB and gids less than 2MB

### Deploy Previews

Once you submit a pull request to this repo, Netlify creates a [deploy preview](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/) for the changes in the specific PR. You can view the deploy preview in the Netlify panel that appears under the PR description. 

### Publishing the Site

The Pixie website is published automatically by [Netlify](https://www.netlify.com/). Whenever changes are merged into the `prod` branch, Netlify re-builds and re-deploys the site. 

## License

Pixie is [Apache 2.0](https://github.com/pixie-labs/pixie-blog/blob/main/LICENSE) licensed.

Pixie Blog website source code is [Apache 2.0](https://github.com/pixie-labs/pixie-blog/blob/main/LICENSE) licensed.

Pixie Blog content is [Creative Commons](https://creativecommons.org/licenses/by/4.0/) licensed.
