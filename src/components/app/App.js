import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

// import AsssesingClient from "../AssessingClient/AssessingClient";
// import FinancialClient from "../financialClient/FinancialClient";
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

import Header from '../header/Header';

import { fetchQuestion, allQuestions, questionNumberChange, totalChange } from "../AssessingClient/assessingClientSlice";

import "./app.scss";

const FinancialClient = lazy(() => import("../financialClient/FinancialClient"));
const AsssesingClient = lazy(() => import("../AssessingClient/AssessingClient"));

const App = () => {
    const questions = useSelector(allQuestions);
    const questionNumber = useSelector(store => store.questions.questionNumber);

    return(
        <Router>
            <div className='app'>
                <Header/>
                <Suspense fallback={<><h1>ggwp</h1></>}>
                <Routes>
                    <Route path="/credit" element={<AsssesingClient/>}/>
                    <Route path="/result" element={<FinancialClient/>}/>
                </Routes>
                </Suspense>
                
            </div>
        </Router>
    )

    // return(
    //     <Router>
    //         <div className='app'>
    //             <Route path="/credit" element={<AsssesingClient/>}/>
    //             <Route path="/result" element={<FinancialClient/>}/>

                
    //             {questions.length && questions.length === questionNumber 
    //                 ? <FinancialClient/>
    //                 : <AsssesingClient/>
    //             }
    //         </div>
    //     </Router>
        
    // )
}

export default App;