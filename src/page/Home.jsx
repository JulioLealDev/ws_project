import { useEffect, useState } from "react";
import { useReadCypher } from "use-neo4j";
import { BasicLayout } from "../components/BasicLayout"
import { getSymptoms } from "../utils/getSymptoms";

export const Home = () => {

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
    
    
    return (
      <BasicLayout loading={loading} error={error}>
        {symptoms.map((symptom, index) => (
          <div key={`${symptom}-${index}`} className="simptoms">
            <label > {/*htmlFor="symptom" */}
              <input name="symptom" id="symptom" type="checkbox" value={symptom} onClick={() => console.log('symptom clicado é ', symptom)}/>
              {symptom}
            </label>
          </div>
        ))}
      </BasicLayout>
    )
}