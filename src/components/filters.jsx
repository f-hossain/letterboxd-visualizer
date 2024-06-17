import { useEffect, useRef, useState } from "react";

const Filters = () => {
    const ref = useRef();

    let [sizeParam, setSizeParam] = useState("fans")

    useEffect( () => {
    }, []);


    return (
        <div >
            <button>acshun</button>
            <button>crime</button>
            <button>drama</button>
        </div>
    )

};

export default Filters;