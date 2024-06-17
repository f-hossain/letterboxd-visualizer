import './App.css';
import TreemapJson from './components/TreemapJson';
import Filters from './components/filters';

function App() {
  const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  return (
    <div className="App">
      <h1>letterboxd visualizer.</h1>
      <p className="desc">{description}</p>
      {/* <Filters /> */}
      <TreemapJson />
      <div className='desc'>{description}</div>
    </div>
  );
}

export default App;
