import { useContext, useEffect, useState } from "react";
import { useReadCypher } from "use-neo4j";
import { BasicLayout } from "../components/BasicLayout"
import { getData} from "../utils/getData";
import "../style/style.css";

import { DataContext } from "../database/DataContext";

export const Home = () => {

  const { state: stateContext, setState: setStateContext } = useContext(DataContext)
  const [symptoms, setSymptoms] = useState([])

  const { loading, error, result } = useReadCypher(`
    MATCH (s:Symptom)-[r:Manifests_in_case_of]->(d:Disease) 
    WITH s, COUNT(r) AS num ORDER BY num DESC 
    RETURN s
  `);

  useEffect(() => { 
    if (result?.records) {

      const symptomsList = getData({
        key: 's',
        records: result?.records
      })

      setStateContext( oldStateContext =>
        ({
            ...oldStateContext, 
            remainingSymptoms: symptomsList.filter(item => !symptomsList.slice(0,24).includes(item))
        })
      );

      setSymptoms( symptomsList.slice(0,24))

    }
  }, [result?.records, setStateContext])

  const handleSelectedSymptom =  (e) => {
    const value = e.target.getAttribute("value")
    if(stateContext.selectedSymptoms.includes(value)){
        setStateContext(
            {
                ...stateContext, 
                selectedSymptoms: stateContext.selectedSymptoms.filter(item => item !== value)
            });
    }else{
        setStateContext(
            {
                ...stateContext, 
                selectedSymptoms:[ ...stateContext.selectedSymptoms, value]
            });
    }
  }
    
    return (
      <BasicLayout loading={loading} error={error} setSymptoms={setSymptoms}>
        {symptoms.map((symptom, index) => (
          <div key={`${symptom}-${index}`} className="symptoms">
            <input type="checkbox" name={`${symptom}-${index}`} id={`${symptom}-${index}`} value={symptom} onClick={handleSelectedSymptom}/>
            <label for={`${symptom}-${index}`}>{symptom}</label>
          </div>
        ))}
      </BasicLayout>
    )
}