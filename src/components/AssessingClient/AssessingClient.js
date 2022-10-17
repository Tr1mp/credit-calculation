import { useEffect,  useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { fetchQuestion, allQuestions, questionNumberChange, totalChange } from "./assessingClientSlice";

const onChangeValue = (value, {answers}) => {
    if (value >= answers.min && value <= answers.max) {
        return value * answers.ratio;
    } else if (value < answers.min) {
        return answers.minRatio;
    } else if (value > answers.max) {
        return answers.maxRatio;
    } else {
        return value;
    }
}


const AsssesingClient = () => {
    const [inputValue, setInputValue] = useState("");
    const [switchQuestion, setSwitchQuestion] = useState(false);

    const total = useSelector(store => store.assessingClient.total);
    const questions = useSelector(allQuestions);
    const questionNumber = useSelector(store => store.assessingClient.questionNumber);
    const questionLoadingStatus = useSelector(store => store.assessingClient.questionLoadingStatus);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchQuestion());
    }, [])

    useEffect(() => {
        if (questions[questionNumber] && questions[questionNumber].changeQuestion && switchQuestion) {
            changeQuestion();
        }
    }, [switchQuestion, questionNumber])

    if (questionLoadingStatus === "loading") {
        return <h1>loading...</h1>
    } else if (questionLoadingStatus === "error") {
        return <h1>error...</h1>
    } 

    const chooseAnswers = (question) => {
        if (!question) return;

        if (question.type === "select") {
            const answer = question.answers.map(item => {
                const isDefault = item.value === "" 
                                ? {"disabled": "disabled"} 
                                : null;
                return (
                    <option 
                        {...isDefault}
                        key={item.name} 
                        value={item.value}
                    >
                        {item.name}
                    </option>
                )
            })

            return(
                <select required
                    className="form-select" 
                    id={question.id}
                    name={question.question}
                    value={inputValue}
                    onChange={(e) => setInputValue(+e.target.value)}
                >
                    {answer}
                </select>
            )

        } else if (question.type === "input") {
            return(
                <input required
                    id={question.id}
                    name={question.question}
                    type="text"
                    placeholder={question.answers.placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(+e.target.value.replace(/\D/g, ''))}
                />
            )
        }
        return(<h1>pizdec</h1>);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const question = questions[questionNumber];
        const value = onChangeValue(+e.target[0].value, question)
        
        dispatch(totalChange(+value.toFixed(2)));
        setInputValue("");

        if (value !== 1 && question.checkQuestion) {
            setSwitchQuestion(question.checkQuestion)
        } else {
            setSwitchQuestion(false);
        }

        changeQuestion();
        console.log(value, total);
    }

    const changeQuestion = () => {
        dispatch(questionNumberChange());
    }

    const answers = chooseAnswers(questions[questionNumber]);

    return (
        <>
            {questions.length > questionNumber  
                ?   <form onSubmit={onSubmit}> 
                        <h1>{questions[questionNumber].question}</h1>
                        <h3>{questions[questionNumber].clarification}</h3>
                        {answers}
                    
                        <button type="submit">Next</button>
                    </form>
                : null
            }
            
        </>
        
    )
}


export default AsssesingClient;