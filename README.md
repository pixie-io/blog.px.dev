[![Netlify Status](https://api.netlify.com/api/v1/badges/e0b67b72-c88e-4474-8083-097c91dfb2c5/deploy-status)](https://app.netlify.com/sites/distracted-beaver-cdfcdf/deploys)

# Pixie Blog

Built with [Gatsby](https://www.gatsbyjs.com/).

### Contributing

We're excited to have you contribute to Pixie's blog.
Our community has adopted the [Contributor Covenant](https://github.com/pixie-labs/pixie/blob/main/CODE_OF_CONDUCT.md) as its code of conduct, and we expect all participants to adhere to it.
Please report any violations to <community@pixielabs.ai>.
All code contributions require the [Contributor License Agreement](https://github.com/pixie-labs/pixie/blob/main/CLA.md).
The CLA can be signed when creating your first PR.

To contribute, follow these steps:

1. Fork this repo.
2. Create a directory in `content/blogs`.
3. Add markdown files and media assets.
4. Iterate and verify by building the site locally.
5. Submit a PR against the upstream  [repo](https://github.com/pixie-labs/pixie-blog).

There are many other ways to contribute to Pixie, as well:

- **Bugs:** Something not working as expected? [Send a bug report](https://github.com/pixie-labs/pixie/issues/new?template=Bug_report.md).
- **Features:** Need new Pixie capabilities? [Send a feature request](https://github.com/pixie-labs/pixie/issues/new?template=Feature_request.md).
- **Views & Scripts Requests:** Need help building a live view or pxl scripts? [Send a live view request](https://github.com/pixie-labs/pixie/issues/new?template=Live_view_request.md).
- **PxL Scripts:** PxL scripts are used by Pixie's API to query telemetry data collected by the Pixie Platform (DNS events, HTTP events, etc) and to extend the platform to collect new data sources.
  PxL can be executed using the web based Live UI, CLI or API. Look [here](https://github.com/pixie-labs/pixie/blob/main/pxl_scripts/README.md#Contributing) for more information.
- **Documentation:** Is the [documentation](https://docs.pixielabs.ai) not explaining something well enough? Contribute to its [repository](https://github.com/pixie-labs/pixie-docs/).
- **Pixienaut Community:** Interested in becoming a [Pixienaut](https://github.com/pixie-labs/pixie/tree/master/pixienauts) and in helping shape our community? [Apply here](https://pixielabs.ai/community/).
- **Community Slack:** Pixie users can also chat with one another in our [community Slack](https://pixie-community.slack.com).


### Markdown File Guidelines

- Update `Author` , `Path`, `Title` and `Date`
- Update `category` as Guest Blogs, Pixie Team Blogs, Pixienaut Blogs
- Try to keep your images to be less than 1MB and gids less than 2MB


### Local Development

To run in development mode run the following commands:

```
yarn install
yarn develop
```

Visit `http://localhost:8000/` to view the app.


### Questions

Ping us on [slack](https://slackin.withpixie.ai/) or file an issue in this repo. 
