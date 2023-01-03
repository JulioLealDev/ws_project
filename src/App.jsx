import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Result } from "./page/Result";
import { Ranking } from "./page/Ranking";
import { DataContext, data } from './database/DataContext';
import { Home } from './page/Home';

export default function MyApp() {
  const [state, setState]= useState(data)

  return (
    <DataContext.Provider value={{state, setState}}>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/result' element={<Result/>} />
          <Route exact path='/ranking' element={<Ranking/>} />
        </Routes>
      </Router>
    </DataContext.Provider>
  );
}

