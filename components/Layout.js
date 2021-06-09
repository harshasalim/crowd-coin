import React from 'react';
import Head from 'next/head';
import { Container } from 'semantic-ui-react'
//import 'semantic-ui-css/semantic.min.css'

import Header from './Header';

const Layout = (props) => {
    return(
        <Container>
            <Head>
            <link
                async
                rel="stylesheet"
                href="//cdn.jsdelivr.net/npm/semantic-ui@2.0.3/dist/semantic.min.css"
                />
            </Head>
            <Header />
            {props.children}
        </Container>
    );
};
  
export default Layout;

/* In the next.js documentation, an additional script was also recommended to be added - for jquery
<script
                async
                src="//cdn.jsdelivr.net/npm/semantic-ui@2.0.3/dist/semantic.min.js"
                ></script>
Here 2.0.3 - semantic-ui-react's version number in this app

OR
Instead of using both the above script and link in the head tag, import semantic-ui-css as shown in the comment above
*/