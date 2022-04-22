import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { Search } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/system';
import { styled } from '@mui/styles';
import { useEffect, useRef } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { navigate } from 'gatsby';

export interface ResultType {
  objectID: string;
  slug: string;
  title: string;
  date: string;
  categories: string[];
}
const shortcutStyle: SxProps = {
  backgroundColor: '#303132',
  color: '#B2B5BB',
  borderRadius: 1,
  padding: 0.5,
  fontSize: 12,
  textTransform: 'initial',
  position: 'absolute',
  right: 4,
  top: 4,
  zIndex: 1,
  display: {
    xs: 'none',
    sm: 'block',
  },
};
const client = algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID as string, process.env.GATSBY_ALGOLIA_SEARCH_KEY as string);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const index = client.initIndex(process.env.GATSBY_DEPLOY_ENV === 'prod' ? process.env.GATSBY_ALGOLIA_PROD_INDEX_NAME : process.env.GATSBY_ALGOLIA_DEV_INDEX_NAME);

const StyledAutocomplete = styled(Autocomplete)({
  '& .MuiAutocomplete-inputRoot': {
    padding: 0,
    color: 'white',
    '& :focus': {
      width: '30vw',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '& MuiSvgIcon-root': {
      color: 'white',
    },
  },
});

export default function SearchModal() {
  const inputRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly any[]>([]);
  const [inputValue, setInputValue] = React.useState('');

  const keydownHandler = (e: KeyboardEvent) => {
    if (e.code === 'KeyK' && (e.ctrlKey || e.metaKey)) {
      inputRef.current?.focus();
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
          setOptions(hits.map((h) => ({
            label: h.title,
            slug: h.slug,
            key: h.objectID,
          })));
        });
    }
  };
  useEffect(() => {
    let active = true;

    (async () => {
      if (active) {
        doSearch(inputValue);
      }
    })();

    return () => {
      active = false;
    };
  }, [inputValue]);
  const onSelectResultItem = async (v: { slug: string; }) => {
    if (v) {
      await navigate(v.slug);
    }
  };
  return (
    <StyledAutocomplete
      disablePortal
      size='small'
      options={options}
      popupIcon={null}
      clearOnBlur
      noOptionsText={<Box sx={{ color: 'primary.main' }}>No results</Box>}
      fullWidth={false}
      openOnFocus={false}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(e, value: any) => onSelectResultItem(value)}
      sx={{
        backgroundColor: 'rgba(33, 35, 36, 1)',
        mr: 1,
        color: 'white',
        p: 0,
        borderRadius: 2,
        minWidth: 160,
      }}
      renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{ color: '#B2B5BB' }} />
                {inputValue ? ''
                  : <Box sx={shortcutStyle} id='shortcuts-box'>Ctrl/Cmd + K</Box>}
              </InputAdornment>
            ),

          }}
          inputRef={inputRef}
        />
      )}
    />
  );
}
