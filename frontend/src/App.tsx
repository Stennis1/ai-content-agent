import { SystemControls } from "./SystemControls";
import { GenerateDraft } from "./GenerateDraft";
import { MediaUpload } from "./MediaUpload";
import { ContentList } from "./ContentList";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>AI Content Agent Dashboard</h1>

      <SystemControls />
      <hr />

      <MediaUpload />
      <hr />

      <GenerateDraft />
      <hr />

      <ContentList />
    </div>
  );
}

export default App;
