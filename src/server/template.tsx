import express from "express";

import React from "react";
import { Provider } from "react-redux";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";

import { Helmet } from "react-helmet";

import serialize from "serialize-javascript";

import App from "../common/app";

import { AppState } from "../common/store/index";

import configureStore from "../common/store/configure";

let assets: any = require(process.env.RAZZLE_ASSETS_MANIFEST || "");

const cssLinksFromAssets = (assets:any, entrypoint:string) => {
  return assets[entrypoint] ? assets[entrypoint].css ?
  assets[entrypoint].css.map((asset:any)=>
    `<link rel="stylesheet" href="${asset}">`
  ).join('') : '' : '';
};

const jsScriptTagsFromAssets = (assets: any, entrypoint: any, extra = '') => {
  return assets[entrypoint] ? assets[entrypoint].js ?
  assets[entrypoint].js.map((asset:any)=>
    `<script src="${asset}"${extra}></script>`
  ).join('') : '' : '';
};

export const render = (req: express.Request, state: AppState) => {
  const store = configureStore(state);

  const context = {};

  const markup = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.originalUrl} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );

  const finalState = store.getState();

  const helmet = Helmet.renderStatic();
  const headHelmet =
    helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();

  return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
                <meta name="theme-color" content="#000000" />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="manifest" href="/manifest.json" />
                ${headHelmet}
                ${cssLinksFromAssets(assets, 'client')}
                <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-55700de914dd69b5"></script>
                <script type="text/javascript">
function open_on_entrance(url,name)
{
   window.open('https://t.me/joinchat/DFItaUHCjJZiOGUx','Weebecash Telegram', ' menubar,resizable,dependent,status,width=1280,height=1024,left=10,top=10')
}
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-51624727-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-51624727-1');
</script>
            </head>
            <body onload="open_on_entrance()" class="${`theme-${state.global.theme}`}" style="display: none;">
            
                <div id="root">${markup}</div>
                <script>
                  window.__PRELOADED_STATE__ = ${serialize(finalState)}
                </script>
                ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
                <script type="application/ld+json">
                  {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "url": "https://weebecash.com/",
                    "potentialAction": [{
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://weebecash.com/search/?q={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }]
                  }
                </script>
                <style>
                  body {
                    display: block !important;
                  }
                </style>
                <img src="/weebecash.svg" alt="Weebecash" width="1" height="1">
                <img src="/weebecash.png" alt="Weebecash" width="1" height="1">
            </body>
        </html>`;
};
