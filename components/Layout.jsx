import Head from 'next/head'
import { Box } from '@chakra-ui/react'


import React from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";



const Layout = ({children}) => (
    <>
        <Head>
            <title>
                HousED Real Estate
            </title>
        </Head>
        <Box maxWidth="1280px" m="auto">
            <header>
                <Navbar/>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <Footer/>
            </footer>
        </Box>

    </>
)

export default Layout;
