import NavBar from "./components/NavBar";
import {BrowserRouter} from "react-router-dom";
import Footer from "./components/Footer";
import AppRouter from "./components/AppRouter";
function App() {
  return (
      <BrowserRouter>
          <NavBar/>
          <AppRouter />
          <Footer />
      </BrowserRouter>
  );
}

export default App;
