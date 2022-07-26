import React, { useRef, useEffect,useState } from "react";
import { useSelector } from "react-redux";
import "./Filter.scss";



const GenderCharacter = () => {
    //const appDispatchAction = useAppDispatch();
  
    //const { filterKey, filteredOccurrences, occurrenceHighlightColor } =
      //useSelector((store: RootStoreI) => store.filterReducer);
      const [data, setData] = useState({temporal : []})

  useEffect(() => {
    fetch("http://127.0.0.1:5000/result").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
    
  }, []);
      const genderType = ['female', 'male']
  
    return (
      
      <div className="report--filter">
        <div className="filter--content">
          {genderType.map((sectionName) => {
            return (
              <div key={sectionName}>
                <h2>{sectionName}</h2>
  
                <div className="filter--content--module">
                  {data.temporal.filter((item) => item.gender == sectionName).map((item) => {
                    return (
                      <p key={item.verb_start_byte}>
                        <span
                        >{item.event}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      
    );
  };
  
  export default GenderCharacter;
  