// src/app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>Estetica Matiz</title>
        <meta name="description" content="Agenda tu cita" />
        <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/72/72179.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}