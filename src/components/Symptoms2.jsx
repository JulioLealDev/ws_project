import { useReadCypher } from "use-neo4j";
import React, { useContext }  from "react";

import { DataContext } from "../database/DataContext";

export default function Symptoms2() {

    const context = useContext(DataContext)

    const { loading, error, result } = useReadCypher('MATCH (s:Symptom {name: $simp1}) MATCH (s2:Symptom {name: $simp2}) MATCH (s)->(d:Disease)<-(s2) RETURN s, s2, d', {simp1: 'fatigue', simp2: 'vomiting'});

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

    function getSintomas(data) {
        return data.symptom.map(sintoma => {
            return (
                <div className="simptoms">
                    <input type="checkbox" value={sintoma} onClick={verification}/>
                    <label>{sintoma.replaceAll('_',' ').replace(/^./, sintoma[0].toUpperCase())}</label>
                </div>
            )
        })
    }

    function getDiseases(data) {
        return data.disease.map(disease => {
            return (
                <div className="simptoms">
                    <input type="checkbox" value={disease} onClick={verification}/>
                    <label>{disease.replaceAll('_',' ').replace(/^./, disease[0].toUpperCase())}</label>
                </div>
            )
        })
    }

    return (
        <div>
        <div className="title">
            <p>Select the symptoms</p>
        </div>
        <div className="body">
            <form className="form">

                <div className="group">
                    <div className="inputGroup">
                        {getSintomas(data)}
                        {getDiseases(data)}
                    </div>
                </div>
                
                <div className="btn">
                    <button onClick={result}>Other Symptoms</button>
                    {/* <button type="button" onClick={() => refreshSymptons(context.state.selectedSymptoms)}>Other Symptoms</button> */}
                    <button onClick={result}>Proceed</button>
                </div>
            </form>
        </div>
    </div>
    )
      
  }

};