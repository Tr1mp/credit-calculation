import { useCallback, useEffect, useMemo, useState } from "react";
import { useHttp } from "../../hooks/http.hook";

const FinancialClient = () => {
    const [inputValue, setInputValue] = useState("");
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [livingExpenses, setLivingExpenses] = useState(0);
    const [incomePerMounth, setIncomePerMounth] = useState(0);
    const {request} = useHttp();

    useEffect(() => {
        request('http://localhost:3001/financialsClient')
            .then(setQuestions)
            .catch(console.log)
    }, [])

    const onChangeValue = (input, {division = null}) => {
        const value = +input.replace(/\D/g, '');
        return division ? value/+division : value
    }
    const calculateValues = (answers, {action = null}) => {
        const value = answers.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
        );
        const switchAction = {
            multiply: () => value * 12500,
        }
        
        return switchAction[action]
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const question = questions[questionNumber];
        const value = onChangeValue(e.target[0].value, question)
        setAnswers(answers => [...answers, value])
        // dispatch(totalChange(+value.toFixed(2)));
        setInputValue("");

        // if (value !== 1 && question.checkQuestion) {
        //     setSwitchQuestion(question.checkQuestion)
        // } else {
        //     setSwitchQuestion(false);
        // }

        changeQuestion();
        console.log(value, answers);
    }

    const changeQuestion = () => {
        setQuestionNumber(questionNumber => questionNumber + 1);
    }

    const renderForm = (question) => {
        if (!question) return

        return (
            <form onSubmit={onSubmit}> 
                <h1>{question.question}</h1>
                <h3>{question.clarification}</h3>
                <input required
                    name={question.question}
                    id={question.id}
                    type="text"
                    placeholder={question.answers.placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit">Next</button>
            </form>
        )

    }

    const element = renderForm(questions[questionNumber]);

    return (
        <>
            {element}
        </>
    )
}

export default FinancialClient;