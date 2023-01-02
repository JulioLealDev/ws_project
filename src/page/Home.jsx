import { useContext, useEffect, useState } from "react";
import { useReadCypher } from "use-neo4j";
import { BasicLayout } from "../components/BasicLayout"
import { getSymptoms } from "../utils/getSymptoms";

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
    console.log('lista: '+context.state.selectedSymptoms)
    console.log('typo: '+typeof context.state.selectedSymptoms)
    const value = e.target.getAttribute("value")
    console.log('value: '+value)
    if(context.state.selectedSymptoms.includes(value)){
        context.setState(
            {
                ...context.state, 
                selectedSymptoms: context.state.selectedSymptoms.filter(item => item !== value)
            });
        console.log('entrou 1: '+context.state.selectedSymptoms)
    }else{
        context.setState(
            {
                ...context.state, 
                selectedSymptoms:[ ...context.state.selectedSymptoms, value]
            });
        console.log('entrou 2: '+context.state.selectedSymptoms)
    }

  }
    
    
    return (
      <BasicLayout loading={loading} error={error}>
        {symptoms.map((symptom, index) => (
          <div key={`${symptom}-${index}`} className="simptoms">
            <label > {/*htmlFor="symptom" */}
              <input name="symptom" id="symptom" type="checkbox" value={symptom} onClick={handleSelectedSymptom}/>
              {symptom}
            </label>
          </div>
        ))}
      </BasicLayout>
    )
}