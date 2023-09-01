import "./App.css";
import { Provider } from "react-redux";
import store from "./redux";
import RouteScreen from "./Route";

function App() {
  const token = localStorage.getItem("token");
  return (
    <Provider store={store}>
      <RouteScreen />
    </Provider>
  );
}

export default App;
