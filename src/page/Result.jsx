import React from "react";
import { useContext, useEffect, useState} from "react";
import { useReadCypher } from "use-neo4j";

import "../style/style.css";
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from "../database/DataContext";
import { getData} from "../utils/getData";


export const Result = () => {

    const context = useContext(DataContext)
    const [specialist, setSpecialist] = useState([])

    const isEmptySymptomsSelected = context.state.selectedSymptoms.length === 0

    const navigate = useNavigate();

    const denormalizedSymptoms = context.state.selectedSymptoms.map((item) => item.replaceAll(" ", "_").toLowerCase());

    const { loading, error, result } = useReadCypher(`
        WITH $list as lst
        UNWIND lst AS x
        MATCH (s:Symptom { name : x })-[r]->(d:Disease)
        WITH d, COUNT(d) AS quant ORDER BY quant DESC
        WITH d limit 5 
        MATCH (s:Specialist)<-[r]-(d)
        WITH s, COUNT(s) AS quant ORDER BY quant DESC
        RETURN s limit 1`,{list:denormalizedSymptoms}
    );

    useEffect(() => { 
        if (result?.records) {
    
            setSpecialist(getData({
                key: 's',
                records: result?.records
            }))
        }

    }, [result?.records])

    return (
        <>
        <section className="title">
            <Link class="logo" to='/'>
                <img height="55px" width="55px" alt='teste'src="heart_icon_green.png"></img>
                <h1 id="topTriage">TopTriage</h1>
            </Link>
        </section>
        { isEmptySymptomsSelected ? (
            <>
                <div className="resultDiv">
                    <p>You din't select any symptoms.</p>
                    <p>Please go back and select the symptoms you have.</p>
                </div>
            </>
        ) : (
            <>
                <div className="resultDiv">
                    <h1>You will be forwarded to the appointment with the </h1>
                    {loading ? (
                        <p className="error">Loading data...</p>
                    ) : error ? (
                        <p className="error">{error.message}</p>
                    ) :
                        <p>{specialist}</p>}
                </div>
            </>
        )}

        <div className="buttonsDiv">
            <button className="buttonsFooter" onClick={() => {
                context.setState(oldState => ({
                    ...oldState,
                    selectedSymptoms: [],
                }))
                navigate('/')
            }}>Back</button>
            <button className="buttonsFooter" disabled={isEmptySymptomsSelected} onClick={() => navigate('/ranking')}>Ranking</button>
        </div>
        </>
    )
};