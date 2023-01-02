import { useReadCypher } from "use-neo4j";
import React, { useContext }  from "react";

import { DataContext } from "../database/DataContext";

export default function Symptoms() {

    const context = useContext(DataContext)

    const { loading, error, result } = useReadCypher("MATCH (s:Symptom)-[r:Manifests_in_case_of]->(d:Disease) WITH s, COUNT(r) AS num ORDER BY num DESC RETURN s,num LIMIT 24");

    if (loading) return <h3 className="error">Loadind Symptoms...</h3>;

    if (error) return <h3 className="error"> Unable to load data</h3>;

    if (result) {

    const verification = (e) => {
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
 
    };

    const data = result?.records
    .map((row) => row.get("s"))
    .reduce(
      (accumulator, currentValue) => {
        if (currentValue.labels.includes("Symptom")) {
          return {
            ...accumulator,
            symptom: [...accumulator.symptom, currentValue.properties.name],
          };
        } else if (currentValue.labels.includes("Disease")) {
          return {
            ...accumulator,
            disease: [...accumulator.disease, currentValue.properties.name],
          };
        }
        return {};
      },
      {
        symptom: [],
        disease: [],
      }
    );

    function getSintomas(sintomas) {
        return sintomas.map(sintoma => {
            return (
                <div className="simptoms">
                    <input type="checkbox" value={sintoma} onClick={verification}/>
                    <label>{sintoma.replaceAll('_',' ').replace(/^./, sintoma[0].toUpperCase())}</label>
                </div>
            )
        })
    }

    return (
        <div className="inputGroup">
            {getSintomas(data.symptom)}
        </div>
    )
      
  }

};