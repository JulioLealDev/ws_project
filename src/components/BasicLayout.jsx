import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../database/DataContext';
import "../style/style.css";

export const BasicLayout = ({ children, loading=false, error, setSymptoms }) => {

  const navigate = useNavigate();
  const context = useContext(DataContext)

  const handleRefreshSymptoms = () => {

      const newSymptoms = context.state.remainingSymptoms.slice(0,24)

      setSymptoms(newSymptoms)

      context.setState(
        {
            ...context.state, 
            remainingSymptoms: context.state.remainingSymptoms.filter(item => !newSymptoms.includes(item))
        }
      )

  }

  return (
    <div>
      <section className="title">
        <Link class="logo" to='/'>
          <img height="55px" width="55px" alt='teste'src="heart_icon_green.png"></img>
          <h1 id="topTriage">TopTriage</h1>
        </Link>
        <p id="homeTitle">Select the symptoms</p>
      </section>
      <div className="symptomsDiv">
        <div className="inputGroup">
          {loading ? (
            <h2 className="error">Loading Symptoms...</h2>
          ): error ? (
            <h2 className="error">{error.message}</h2>
          ): children}
        </div>
  
        <div className="buttonsDiv">
          <button type="button" onClick={handleRefreshSymptoms} disabled={context.state.remainingSymptoms.length < 24}>
            Refresh Symptoms
          </button>
          <button type="button" onClick={() => navigate('/result')}>
            Finish
          </button>
        </div>
      </div>
    </div>)
  }