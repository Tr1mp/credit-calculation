import { useSelector } from 'react-redux';

import AsssesingClient from "../AssessingClient/AssessingClient";
import FinancialClient from "../financialClient/FinancialClient";

import { fetchQuestion, allQuestions, questionNumberChange, totalChange } from "../AssessingClient/assessingClientSlice";

const App = () => {
    const questions = useSelector(allQuestions);
    const questionNumber = useSelector(store => store.assessingClient.questionNumber);
    console.log(questions);
    return(
        <div>
            <AsssesingClient/>
            {questions.length === questionNumber 
                ? <FinancialClient/>
                : null
            }
            
        </div>
        
    )
}

export default App;