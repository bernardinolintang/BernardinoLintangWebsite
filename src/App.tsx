import { Portfolio } from "./components/Portfolio";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <Portfolio />
    </ThemeProvider>
  );
}