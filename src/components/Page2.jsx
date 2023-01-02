import React, { useContext, useEffect, useState }  from "react";
import { useReadCypher } from "use-neo4j";
import { useNavigate } from 'react-router-dom';

import "../style/Home.css";

import { DataContext } from "../database/DataContext";

export default function Page2() {
    const { loading, error, result } = useReadCypher(
        `MATCH (s:Symptom {name: $simp}) 
        MATCH (s2:Symptom {name: $simp2})   
        MATCH (s)-[r:Manifests_in_case_of]->(d:Disease)<-[r2:Manifests_in_case_of]-(s2)
        WITH d, s.name AS s1, s2.name AS s2
        MATCH (d)<-[r3:Manifests_in_case_of]-(s:Symptom)
        WITH s, COUNT(s) AS contagem, s1, s2
        WHERE contagem < $num
        WITH s, s1, s2
        MATCH (d)<-[r]-(s)
        MATCH (:Symptom { name:s1})-[:Manifests_in_case_of]->(d:Disease)<-[:Manifests_in_case_of]-(:Symptom {name:s2})
        RETURN s, d`,{simp: 'fatigue', simp2: 'vomiting', num: 2}
    );
    
    const context = useContext(DataContext)
    
    useEffect(() => { 
        if (result?.records) {

            const a = result?.records
            .map((row) => row.get("d")) 
            .reduce(
                (accumulator, currentValue) => {
                    if(!accumulator?.disease?.includes(currentValue?.properties?.name)){
                        return {
                            ...accumulator,
                            disease: [...accumulator.disease, currentValue.properties.name],
                        };
                    }
                    return { ...accumulator};
                },
                {
                disease: []
                }
            );

            context.setState(
                {
                    ...context.state, 
                    probableIllnesses: a.disease,
                });
        } 
    }, [result?.records]);
    

    function refreshSymptons(symptoms){
        console.log('sintomas: '+symptoms.selectedSymptoms)
        console.log('doenças: ', symptoms.probableIllnesses)
    }

    const navigate = useNavigate();
    
    const nextPage = async e => {
        return navigate('/page3');
    }





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
        error.message
        // <div>
        //     <div className="title">
        //         <p>Select the symptoms</p>
        //     </div>
        //     <div className="body">
        //         <form className="form">
        //             <div className="group">
        //                 <div className="inputGroup">
        //                     <h3 className="error"> Unable to load data</h3>
        //                 </div>
        //             </div>
                    
        //             <div className="btn">
        //                 <button onClick={result}>Proceed</button>
        //             </div>
        //         </form>
        //     </div>
        // </div>
    );



    if (result) {

        const verification = (e) => {
            console.log('lista: '+context.state.selectedSymptoms)
            console.log('tipo: '+typeof context.state.selectedSymptoms)
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



        // console.log("---: "+data2.disease)

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