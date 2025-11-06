// pages/_app.js
import '../styles/globals.css'; // <--- 确保这行存在！

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;