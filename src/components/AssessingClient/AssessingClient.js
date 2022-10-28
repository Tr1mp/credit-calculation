import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

import { useHttp } from "../../hooks/http.hook";
import { thousand } from "../../hooks/numberMusk";

import { updateOneAnswer, addOneAnswer } from "../financialClient/financialClientSlice";
import { fetchQuestion, allQuestions, questionNumberChange, totalChange } from "./assessingClientSlice";


import "./assessingClient.scss";


const onChangeValue = (value, { answers }) => {
    value = +value.replace(/\s+/g, '');
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

    const total = useSelector(store => store.questions.total);
    const questions = useSelector(allQuestions);
    const questionNumber = useSelector(store => store.questions.questionNumber);
    const questionLoadingStatus = useSelector(store => store.questions.questionLoadingStatus);
    
    const navigate = useNavigate();

    const { request } = useHttp();

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("pizdec",questionNumber, questions.length);

        if (questions.length && questionNumber === questions.length) {
            navigate("/result");
        }
        
    });

    useEffect(() => {
        dispatch(fetchQuestion());
    }, [])

    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        if (localStorage.getItem("id")) {
            const id = localStorage.getItem("id");
            dispatch(addOneAnswer({id}))
            return
        }
        const id = uuidv4();
        localStorage.setItem("id", id)
        dispatch(addOneAnswer({id}))
        // request(`http://localhost:3002/usersAnswer/`, "POST", JSON.stringify({ id: id }))
    }

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
                    ? { "disabled": "disabled" }
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

            return (
                <div className="form" >
                    <select required
                        className="form_data"
                        autoFocus={true}
                        id={question.id}
                        name={question.question}
                        value={inputValue}
                        onChange={(e) => setInputValue(+e.target.value)}
                    >
                        {answer}
                        
                    </select>
                    <svg className="form-arrow" xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <polyline points="2 2 12 13 22 2"/>
                    </svg>
                </div>
            )

        } else if (question.type === "input") {
            return (
                <div className="form">
                    <input required
                        className="form_data"
                        id={question.id}
                        name={question.question}
                        type="text"
                        placeholder={question.answers.placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(thousand(e.target.value))}
                    />
                </div>
                
            )
        }
        return (<h1>Error</h1>);
    }



    const addUserAnswer = ({ id, answers, status, assessment }, value) => {
        const answerValue = answers.length
            ? answers.filter(item => item.value === value)[0].name
            : id

        const answer = {
                id: [id],
                name: answerValue,
                value: value,
                status,
                assessment
            
        }
        console.log("answer", answer);
        const userId = localStorage.getItem("id")
        dispatch(updateOneAnswer(answer))
        // request(`http://localhost:3002/usersAnswer/${id}`, "PATCH", JSON.stringify(answer))
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const question = questions[questionNumber];
        const value = onChangeValue(e.target[0].value, question)

        addUserAnswer(question, +value.toFixed(2));
        setInputValue("");

        if (value !== 1 && question.checkQuestion) {
            setSwitchQuestion(question.checkQuestion)
        } else {
            setSwitchQuestion(false);
        }

        changeQuestion();
        console.log(+value.toFixed(2));
    }

    const changeQuestion = () => {
        dispatch(questionNumberChange());
    }

    const answers = chooseAnswers(questions[questionNumber]);

    return (
        <div className="assessingClient">
            {questions.length > questionNumber
                ? <form name="info" onSubmit={onSubmit}>
                    <h2>{questions[questionNumber].question}</h2>
                    <h3>{questions[questionNumber].clarification}</h3>
                    {answers}
                    <div>
                        <button className="button" type="submit"><div></div></button>
                    </div>
                </form>
                : null
            }

        </div>

    )
}


export default AsssesingClient;