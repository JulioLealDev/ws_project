import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../database/DataContext';
import "../style/Home.css";

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
      <div className="title">
        <h1>Select the symptoms</h1>
      </div>
      <div className="body">
        <form className="form">
          <div className="group">
            <div className="inputGroup">
              {loading ? (
                <h2 className="error">Loading Symptoms...</h2>
              ): error ? (
                <h2 className="error">{error.message}</h2>
              ): children}
            </div>
          </div>
    
          <div className="btn">
            <button type="button" onClick={handleRefreshSymptoms} disabled={context.state.remainingSymptoms.length < 24}>
              Refresh Symptoms
            </button>
            <button type="button" onClick={() => navigate('/result')}>
              Finish
            </button>
          </div>
        </form>
      </div>
    </div>)
  }