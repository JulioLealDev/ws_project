import { useContext, useEffect, useState } from "react";
import { useReadCypher } from "use-neo4j";
import { BasicLayout } from "../components/BasicLayout"
import { getData} from "../utils/getData";
import "../style/Home.css";

import { DataContext } from "../database/DataContext";

export const Home = () => {

  const context = useContext(DataContext)
  const [symptoms, setSymptoms] = useState([])

  const { loading, error, result } = useReadCypher(`
    MATCH (s:Symptom)-[r:Manifests_in_case_of]->(d:Disease) 
    WITH s, COUNT(r) AS num ORDER BY num DESC 
    RETURN s
  `);

  useEffect(() => { 
    if (result?.records) {

      const symptomslist = getData({
        key: 's',
        records: result?.records
      })

      context.setState(
        {
            ...context.state, 
            remainingSymptoms: symptomslist.filter(item => !symptomslist.slice(0,24).includes(item))
        }
      );

      setSymptoms( symptomslist.slice(0,24))

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
      <BasicLayout loading={loading} error={error} setSymptoms={setSymptoms}>
        {symptoms.map((symptom, index) => (
          <div key={`${symptom}-${index}`} className="symptoms">
            <input type="checkbox" id={`${symptom}-${index}`} value={symptom} onClick={handleSelectedSymptom}/>
            <label htmlFor={`${symptom}-${index}`}>{symptom}</label>
          </div>
        ))}
      </BasicLayout>
    )
}