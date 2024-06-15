import './App.css';
import Treemap from './components/treemap';
import Barchart from './components/barchart';
import TreemapJson from './components/TreemapJson';

function App() {
  return (
    <div className="App">
      <h3>letterboxd top 50 movie browser</h3>
      <TreemapJson />
    </div>
  );
}

export default App;
