import { PageContainer } from "@toolpad/core/PageContainer";
import HeadTitle from "./components/HeadTitle";
import Board from "./components/Board";
import Columns from "./components/Columns";

function App() {
  return (
    <div className="App">
      <PageContainer>
        <HeadTitle></HeadTitle>
        <Columns></Columns>
      </PageContainer>
    </div>
  );
}

export default App;
