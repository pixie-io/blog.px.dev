import * as React from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../../src/theme';
import {ColorThemeProvider} from "../../src/components/color-theme.provider";

export default function TopLayout(props) {
    return (
        <React.Fragment>
            <Helmet>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
                <link
                    href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <ColorThemeProvider>
                    {props.children}
                </ColorThemeProvider>
            </ThemeProvider>
        </React.Fragment>
    );
}

TopLayout.propTypes = {
    children: PropTypes.node,
};
