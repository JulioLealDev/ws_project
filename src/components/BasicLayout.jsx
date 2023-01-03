import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../database/DataContext';

export const BasicLayout = ({ children, loading=false, error, setSymptoms }) => {

  const navigate = useNavigate();
  const context = useContext(DataContext)

  // const handleShowContext = () => {
  //   console.log('sintomas: ', context.state.selectedSymptoms)
  //   console.log('pool: ', context.state.remainingSymptoms)
  // }

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
        <p>Select the symptoms</p>
      </div>
      <div className="body">
        <form className="form">
          <div className="group">
            <div className="inputGroup">
              {loading ? (
                <h3 className="error">Loading Symptoms...</h3>
              ): error ? (
                <h3 className="error">{error.message}</h3>
              ): children}
            </div>
          </div>
    
          <div className="btn">
            {/* <button  type="button" onClick={handleShowContext}>
              Debug
            </button> */}
            <button  type="button" onClick={handleRefreshSymptoms} disabled={context.state.remainingSymptoms.length < 24}>
              Refresh Symptoms
            </button>
            <button  type="button" onClick={() => navigate('/ranking')}>
              Finish
            </button>
          </div>
        </form>
      </div>
    </div>)
  }