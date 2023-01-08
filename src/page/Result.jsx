import React from "react";
import { useContext, useEffect, useState} from "react";
import { useReadCypher } from "use-neo4j";

import "../style/style.css";
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from "../database/DataContext";
import { getData} from "../utils/getData";

const time = {
    'Non-urgent': 240,
    'Standart': 120,
    'Urgent': 60,
    'Very-urgent': 10,
    'Immediate': 0
}

export const Result = () => {

    const context = useContext(DataContext)
    const [specialist, setSpecialist] = useState([])
    const [urgency, setUrgency] = useState([])

    const isEmptySymptomsSelected = context.state.selectedSymptoms.length === 0

    const navigate = useNavigate();

    const denormalizedSymptoms = context.state.selectedSymptoms.map((item) => item.replaceAll(" ", "_").toLowerCase());

    const { loading, error, result } = useReadCypher(`
        WITH $list as lst
        UNWIND lst AS x
        MATCH (s:Symptom { name : x })-[r]->(u:Disease)
        WITH u, COUNT(u) AS quant ORDER BY quant DESC
        WITH u limit 5  
        MATCH (s:Specialist)<-[r]-(u)
        WITH  u, s, COUNT(s) AS quant ORDER BY quant DESC
        RETURN u, s limit 1`,{list:denormalizedSymptoms}
    );

    useEffect(() => { 
        if (result?.records) {
    
            setSpecialist(getData({
                key: 's',
                records: result?.records
            }))

            setUrgency(getData({
                key: 'u',
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

        {urgency && (
            <div className={`urgency ${urgency}`}>
                { urgency === 'Immediate' ? <h3>You will be taken care of immediately </h3> : <h3>{urgency} - Maximum {!!time[urgency] && time[urgency]} minutes standby</h3> }
            </div>
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