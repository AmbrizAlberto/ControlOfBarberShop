// layout.jsx

'use client';
import Head from 'next/head';
import React from 'react';

export default function RootLayout1({ children }) {

  return (
    <html className="html">
      <head>
        <title>Dashboard</title>
        <meta name="description" content="Photography"/>
        <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/4100/4100416.png" />
      </head>
      <body>
            {children}
      </body>
    </html>
  );
}