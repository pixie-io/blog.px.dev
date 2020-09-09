import * as React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import { ThemeModeContext } from '../mainThemeProvider';

const SvgRenderer = ({ src, title }) => (
  <StaticQuery
    query={graphql`
      query {
        images: allFile {
          edges {
            node {
              relativePath
              name
             publicURL
            }
          }
        }
      }
    `}
    render={(data) => {
      const lastDot = src.lastIndexOf('.');

      const fileName = src.substring(0, lastDot);
      const ext = src.substring(lastDot + 1);

      const image = data.images.edges.find((n) => n.node.relativePath.endsWith(`/${src}`));
      const lightImage = data.images.edges.find((n) => n.node.relativePath.endsWith(`/${fileName}-light.${ext}`));
      const darkImage = data.images.edges.find((n) => n.node.relativePath.endsWith(`/${fileName}-dark.${ext}`));

      const getImageSrc = (theme) => {
        if (theme === 'light' && lightImage) {
          return lightImage.node.publicURL;
        }
        if (theme === 'dark' && darkImage) {
          return darkImage.node.publicURL;
        }
        return image.node.publicURL;
      };
      if (!image) {
        return null;
      }
      return (
        <ThemeModeContext.Consumer>
          {({ theme }) => (
            <figure className='gatsby-resp-image-figure'>
              <img src={getImageSrc(theme)} className='blog-image' />
              <figcaption className='gatsby-resp-image-figcaption MuiTypography-body1'>{title}</figcaption>
            </figure>
          )}
        </ThemeModeContext.Consumer>
      );
    }}
  />
);

export default SvgRenderer;
