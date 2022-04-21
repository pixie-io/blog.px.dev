import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Search } from '@mui/icons-material';
import { SxProps } from '@mui/system';
import {
  FilledInput,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import algoliasearch from 'algoliasearch/lite';
import { useEffect, useState } from 'react';
import { Link } from 'gatsby';

const client = algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID as string, process.env.GATSBY_ALGOLIA_SEARCH_KEY as string);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const index = client.initIndex(process.env.GATSBY_DEPLOY_ENV === 'prod' ? process.env.GATSBY_ALGOLIA_PROD_INDEX_NAME : process.env.GATSBY_ALGOLIA_DEV_INDEX_NAME);

const modalStyle: SxProps = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '98%',
    md: 'auto',
  },
  minWidth: '50vw',
  maxWidth: '90vw',
  bgcolor: 'background.default',
  maxHeight: '70vh',
  borderRadius: '10px',
  boxShadow: 24,
  p: 1,
};

const shortcutStyle: SxProps = {
  backgroundColor: '#303132',
  borderRadius: 1,
  padding: 0.5,
  fontSize: 12,
  textTransform: 'initial',
};

export interface ResultType {
  objectID: string;
  slug: string;
  title: string;
  date: string;
  categories: string[];
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [results, setResults] = useState<ResultType[]>([]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const clearAll = () => {
    setResults([]);
    setSearchQuery('');
  };

  const keydownHandler = (e) => {
    if (e.keyCode === 75 && (e.ctrlKey || e.metaKey)) {
      setOpen(true);
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', keydownHandler, false);
    return () => {
      window.removeEventListener('keydown', keydownHandler, false);
    };
  }, []);
  const doSearch = (t: string) => {
    if (t && t.length > 0) {
      index.search<ResultType>(t, { hitsPerPage: 10 })
        .then(({
          hits,
          nbHits,
          query,
        }) => {
          setSearchQuery(query);
          setResults(hits);
        });
    }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    doSearch(event.target.value);
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          backgroundColor: 'rgba(33, 35, 36, 1)',
          mr: 1,
          borderRadius: 2,
        }}
      >
        <Search sx={{
          mr: {
            xs: 0,
            md: 4,
          },
        }}
        />
        <Box sx={{
          display: {
            xs: 'none',
            md: 'inline-flex',
          },
        }}
        >
          <Box sx={shortcutStyle}>Cmd/Cmd + K</Box>
        </Box>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        disableAutoFocus
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={modalStyle}>
          <FilledInput
            sx={{ width: '100%' }}
            onChange={handleSearchChange}
                        //   value={searchQuery}
            type='text'
            autoFocus
            placeholder='Search'
            startAdornment={(
              <InputAdornment position='start'>
                <Search sx={{ color: 'primary.main' }} />
              </InputAdornment>
                        )}
          />
          {results.length
            ? (
              <List sx={{
                bgcolor: 'background.paper',
                maxHeight: 'inherit',
                overflow: 'auto',
              }}
              >
                {results.map((r) => (
                  <ListItem disablePadding key={r.objectID} sx={{ mb: 1 }}>
                    <ListItemButton sx={{ p: 0 }} component={Link} to={r.slug}>
                      <ListItemText primary={r.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{
                mt: 2,
                textAlign: 'center',
              }}
              >
                {searchQuery ? 'No results' : 'No recent search'}
              </Typography>
            )}

        </Box>
      </Modal>
    </>
  );
}
