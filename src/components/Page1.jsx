import { useReadCypher } from "use-neo4j";
import React, { useContext }  from "react";
import { useNavigate } from 'react-router-dom';

import "../style/Home.css";

import { DataContext } from "../database/DataContext";

export default function Page1() {

    function refreshSymptons(symptoms){
        console.log('sintomas: '+symptoms.selectedSymptoms)
        console.log('doenças: '+symptoms.probableIllnesses)
    }

    const navigate = useNavigate();
    
    const nextPage = async e => {
        return navigate('/page2');
    }

    const context = useContext(DataContext)

    const { loading, error, result } = useReadCypher("MATCH (s:Symptom)-[r:Manifests_in_case_of]->(d:Disease) WITH s, COUNT(r) AS num ORDER BY num DESC RETURN s LIMIT 24");

    if (loading) return (
        <div>
            <div className="title">
                <p>Select the symptoms</p>
            </div>
            <div className="body">
                <form className="form">
                    <div className="group">
                        <div className="inputGroup">
                            <h3 className="error">Loadind Symptoms...</h3>
                        </div>
                    </div>
                    
                    <div className="btn">
                        <button onClick={result}>Proceed</button>
                    </div>
                </form>
            </div>
        </div>
    );


    if (error) return (
        <div>
            <div className="title">
                <p>Select the symptoms</p>
            </div>
            <div className="body">
                <form className="form">
                    <div className="group">
                        <div className="inputGroup">
                            <h3 className="error"> Unable to load data</h3>
                        </div>
                    </div>
                    
                    <div className="btn">
                        <button onClick={result}>Proceed</button>
                    </div>
                </form>
            </div>
        </div>
    );

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
                return {
                    ...accumulator,
                    symptom: [...accumulator.symptom, currentValue.properties.name],
                };
            },
            {
            symptom: []
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
            <div>
                <div className="title">
                    <p>Select the symptoms</p>
                </div>
                <div className="body">
                    <form className="form">
                        <div className="group">
                            <div className="inputGroup">
                                {getSintomas(data.symptom)}
                            </div>
                        </div>
                        
                        <div className="btn">
                            <button type="button" onClick={() => refreshSymptons(context.state)}>Other Symptoms</button>
                            <button onClick={nextPage}>Proceed</button>
                        </div>
                    </form>
                </div>
            </div>
        )

    }

};