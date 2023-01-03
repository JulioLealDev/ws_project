import { useContext, useEffect, useState } from "react";
import { useReadCypher } from "use-neo4j";
import { BasicLayout } from "../components/BasicLayout"
import { getSymptoms } from "../utils/getSymptoms";
import { getDiseases } from "../utils/getDiseases";
import "../style/Home.css";

import { DataContext } from "../database/DataContext";

export const Page2 = () => {

  const context = useContext(DataContext)
  const [symptoms, setSymptoms] = useState([])
  
  const { loading, error, result } = useReadCypher(`
    WITH $list as lst
    UNWIND lst AS x
    MATCH ( s:Symptom { name : x })
    MATCH (s)-[r]->(d:Disease)
    WITH d , COUNT(d) AS quantidade, lst
    WHERE quantidade = size(lst)
    MATCH (s:Symptom)-[r]->(d)
    WHERE NOT s.name IN lst
    WITH s , COUNT(s) AS quantity, d
    RETURN s, d, quantity ORDER BY quantity LIMIT 24`, {list: ['fatigue', 'chills']}
  );

  useEffect(() => { 
    if (result?.records) {

      setSymptoms(
        [...new Set(getSymptoms({
          key: 's',
          records: result?.records
        }))]
      )

      context.setState(
        {
            ...context.state, 
            probableIllnesses: [...new Set(getDiseases({
              key: 'd',
              records: result?.records
            }))],
        });

    }
  }, [result?.records])

  const handleSelectedSymptom = (e) => {
    const value = e.target.getAttribute("value")
    if(context.state.selectedSymptoms.includes(value)){
        context.setState(
            {
                ...context.state, 
                selectedSymptoms: context.state.selectedSymptoms.filter(item => item !== value)
            });
    }else{
        context.setState(
            {
                ...context.state, 
                selectedSymptoms:[ ...context.state.selectedSymptoms, value]
            });
    }
  }

  return (
    <BasicLayout loading={loading} error={error} nextPage={'/page3'}>
      {symptoms.map((symptom, index) => (
        <div key={`${symptom}-${index}`} className="symptoms">
          <input type="checkbox" id={`${symptom}-${index}`} value={symptom} onClick={handleSelectedSymptom}/>
          <label htmlFor={`${symptom}-${index}`}>{symptom}</label>
        </div>
      ))}
    </BasicLayout>
  )
}