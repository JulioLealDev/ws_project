import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Result from "./components/Result";
import Page1 from "./components/Page1";
import Page2 from './components/Page2';
import Ranking from "./components/Ranking";
import { DataContext, data } from './database/DataContext';
import { Home } from './page/Home';



export default function MyApp() {
  const [state, setState]= useState(data)

  return (
    <DataContext.Provider value={{state, setState}}>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/page2' element={<Page2/>} />
          <Route path='/result' element={<Result/>} />
          <Route path='/ranking' element={<Ranking/>} />
        </Routes>
      </Router>
    </DataContext.Provider>
  );
}

