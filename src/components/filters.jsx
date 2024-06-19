// import { useEffect, useRef, useState, useCallback } from "react";
// import TreemapJson from "./TreemapJson";
// import top50 from '../top50.json'
// import * as react from 'react'

// function Filters() {
//     const ref = useRef();
//     let [data, setData] = useState(top50)
//     let [size, setSize] = useState("rating")

//     let changeSize = () => {
//         console.log('changing size')
//         setSize("likes")
//     }

//     useEffect( () => {
//     }, []);


//     return (
//         <div>
//             <div className="filter-inputs">
//                 <label>calculate by: </label>
//                 <select>
//                     <option>rating</option>
//                     <option>likes</option>
//                     <option>fans</option>
//                     <option>watches</option>
//                 </select>
//                 <label> genres: </label>
//                 <div className="genres">
//                     <button onClick={changeSize}>acshun</button>
//                     <button>crime</button>
//                     <button>drama</button>
//                 </div>
//             </div>
//             <TreemapJson data={data} sizeParam={size} />
//         </div>
//     )

// };

// export default Filters;