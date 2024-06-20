import './App.css';
import TreemapJson from './components/TreemapJson';

function App() {
  const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  return (
    <div className="App">
      <h1>letterboxd visualizer</h1>
      <div className="desc">
        <p>
          This is a compiled list of the top 50 movies officially ranked by Letterboxd based on the average weighted rating of all Letterboxd users, displayed in a treemap format. Treemaps use area to convey value, and partition space into rectangles based on each nodes associated value. They are a useful way to visualize hierarchical data and can also convey overall composition within the hierarchy as well.  
        </p>
        <p>
          Below, we can see films grouped by genre, and their tile sizes and overall node values can be compared against their average rating, the number of likes the film has received on Letterboxd, the amount of ‘fans’ a film has on the platform (determined by the amount of users who have ‘favourited’ the film), and the number of watches a film has amassed in total by letterboxd users. In effect, this treemap will be able to show you the top performing films by each metric, as well as simultaneously displaying the top performing genres as well. 
        </p>
        <p>
          For more information of the film selection, please visit the <a href="https://letterboxd.com/dave/list/official-top-250-narrative-feature-films/">Official Top 250 Narrative Feature Films</a> on Letterboxd!
        </p>
  
      </div>
      <TreemapJson />
      <div className='footer'><a href="https://farihahossain.ca/">© Fariha Hossain 2024</a></div>
    </div>
  );
}

export default App;
