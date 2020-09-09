import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import Img from 'gatsby-image';

const PostPlaceholder = () => (
  <StaticQuery
    query={graphql`
      query {
        images: allFile(
          filter: {
            name: { eq: "pixie" }
            sourceInstanceName: { eq: "images" }
          }
        ) {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                fluid(maxWidth: 1291, quality: 70) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    `}
    render={(data) => {
      const { fluid } = data.images.edges[0].node.childImageSharp;

      return <Img loading='lazy' fluid={fluid} fadeIn={false} />;
    }}
  />
);

export default PostPlaceholder;
