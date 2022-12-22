import '../styles/globals.css'
import {Router} from "next/router";
import Head from 'next/head'
import NProgress from 'nprogress'
import { ChakraProvider} from "@chakra-ui/react";
import Layout from "../components/Layout";
import 'nprogress/nprogress.css';
import {BrowserRouter, Router as Ruoter} from "react-router-dom";



function MyApp({ Component, pageProps }) {

    NProgress.configure({ showSpinner: false });

    Router.events.on('routeChangeStart', () => {
        NProgress.start();
    });

    Router.events.on('routeChangeComplete', () => {
        NProgress.done();
    });

  return (
      <>
        <Head>
            <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css' integrity='sha512-42kB9yDlYiCEfx2xVwq0q7hTDNEpUTHQoQUJMHLrErGJyHg89uy71MyuHxGJMg3mHkUt9nNuTDxunHF0/EgxLQ==' crossOrigin='anonymous' referrerPolicy='no-referrer' />
            <title>HousED - Find a Home</title>
        </Head>
             <ChakraProvider>
                     <Layout>
                         <Component {...pageProps}/>
                     </Layout>
             </ChakraProvider>


      </>
  )
}

export default MyApp
