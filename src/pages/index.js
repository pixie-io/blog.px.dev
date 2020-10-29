import React, { useEffect, useState } from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import slugify from 'slugify';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Layout from '../components/layout';
import SEO from '../components/seo';
import BlogPostItem from '../components/shared/blog-post-item';
import styles from '../scss/pages/blog.module.scss';
import blogIcon from '../images/blog-icon.svg';

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.palette.type === 'light' ? 'white' : '#161616',
  },
}));
const Blog = (props) => {
  const PIXIE_TEAM_BLOGS = 'Pixie Team Blogs';
  const {
    data,
    pageContext: { category: urlCategory },
    location = { href: '' },
  } = props;
  const pageSize = 9;
  const paginate = (posts, pageNumber) => posts.slice(0, (pageNumber + 1) * pageSize);
  const muiClasses = useStyles();

  const {
    posts: { nodes: allPosts },
  } = data;
  const {
    categories: { distinct: allCategories },
  } = data;

  let categories = allCategories
    .map((c) => ({
      label: c,
      count: allPosts.filter((pos) => pos.frontmatter.categories.includes(c.toString())).length,
      order: c === PIXIE_TEAM_BLOGS ? 99 : c.length,
    }));
  categories = categories.sort((a, b) => (a.order >= b.order ? -1 : 1));


  const [category] = useState(urlCategory);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState(paginate(allPosts, 0));
  const [hasMore, setHasMore] = useState(allPosts.length > pageSize);

  const filterPosts = (p, c) => {
    const filteredPosts = c
      ? allPosts.filter((pos) => pos.frontmatter.categories.some((pc) => pc === c))
      : allPosts;
    const paginatedPosts = paginate(filteredPosts, p);
    setPosts(paginatedPosts);
    setPage(p);
    setHasMore(filteredPosts.length > paginatedPosts.length);
  };

  const loadMore = () => {
    filterPosts(page + 1, category);
  };

  useEffect(() => {
    filterPosts(0, category);
  }, []);

  return (
    <Layout>
      <SEO
        title='Blog'
        url={location.href}
      />
      <section className={`${styles.latestStories}  ${muiClasses.body}`}>
        <div className='container'>
          <div className={`row ${styles.blogCategory}`}>
            <div className='col-12'>
              <img src={blogIcon} alt='blog icon' className={styles.blogLogo} />
              <Typography variant='h1'>
                The latest news and announcements on Pixie, products, partners,
                and more.
              </Typography>
            </div>
            <div className='col-12'>
              <ul>
                <li>
                  <Link to='/'>
                    <button
                      type='button'
                      className={!category ? styles.active : ''}
                    >
                      All (
                      {allPosts.length}
                      )
                    </button>
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.label}>
                    <Link
                      to={`/${slugify(cat.label)
                        .toLowerCase()}`}
                    >
                      <button
                        type='button'
                        className={category === cat.label ? styles.active : ''}
                      >
                        {cat.label}
                        {' '}
                        (
                        {cat.count}
                        )
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {posts.map((post) => (
            <BlogPostItem post={post} key={post.id} />
          ))}
          <div className='clearfix' />
          <div className='row'>
            <div className={`col-12 ${styles.blogViewAll}`}>
              {hasMore ? (
                <button type='button' onClick={() => loadMore()}>
                  View all Blog posts
                  {' '}
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className='clearfix' />
        </div>
      </section>
    </Layout>
  );
};

Blog.propTypes = {
  pageContext: PropTypes.shape({
    category: PropTypes.string,
  }),
  location: PropTypes.shape({
    href: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    posts: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
    categories: PropTypes.shape({
      distinct: PropTypes.array.isRequired,
    }),
  }).isRequired,
};
Blog.defaultProps = {
  pageContext: {
    category: null,
  },
};
export default Blog;

export const pageQuery = graphql`
  query {
    posts: allMdx(
      filter: { frontmatter: { featured: { eq: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        id
        timeToRead
        excerpt(pruneLength: 200)
        frontmatter {
          title
          author
          authors
          email
          emails
          categories
          date(formatString: "MMMM DD YYYY")
          featured_image {
            childImageSharp {
              id
              fluid(maxHeight: 320) {
                base64
                aspectRatio
                src
                srcSet
                sizes
              }
            }
          }
        }
      }
    }

   categories: allMdx(sort: {fields: fields___slug, order: ASC}) {
      distinct(field: frontmatter___categories)
    }
  }
`;
