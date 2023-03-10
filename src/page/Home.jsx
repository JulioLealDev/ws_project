import { useContext, useEffect, useState } from "react";
import { useReadCypher } from "use-neo4j";
import { BasicLayout } from "../components/BasicLayout"
import { getSymptoms } from "../utils/getSymptoms";
import "../style/Home.css";

import { DataContext } from "../database/DataContext";

export const Home = () => {

  const context = useContext(DataContext)
  const [symptoms, setSymptoms] = useState([])
  

  const { loading, error, result } = useReadCypher(`
    MATCH (s:Symptom)-[r:Manifests_in_case_of]->(d:Disease) 
    WITH s, COUNT(r) AS num ORDER BY num DESC 
    RETURN s LIMIT 24
  `);

  useEffect(() => { 
    if (result?.records) {

      setSymptoms(
        getSymptoms({
          key: 's',
          records: result?.records
        })
      )

    }
  }, [result?.records])

  const handleSelectedSymptom =  (e) => {
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
      <BasicLayout loading={loading} error={error} nextPage={'/page2'}>
        {symptoms.map((symptom, index) => (
          <div key={`${symptom}-${index}`} className="symptoms">
            <input type="checkbox" id={`${symptom}-${index}`} value={symptom} onClick={handleSelectedSymptom}/>
            <label htmlFor={`${symptom}-${index}`}>{symptom}</label>
          </div>
        ))}
      </BasicLayout>
    )
}