import Routes from "./routes";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./theme/theme-provider";

function App() {
  const router = createBrowserRouter(Routes);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
