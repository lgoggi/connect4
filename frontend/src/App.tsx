import { SocketProvider } from "./providers/socketProvider";
import RoutesApp from "./routes";

function App() {
  return(
    <SocketProvider>
      <RoutesApp />
    </SocketProvider>
  )
}

export default App;
