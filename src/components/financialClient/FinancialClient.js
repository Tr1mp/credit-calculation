import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { useHttp } from "../../hooks/http.hook";
import { thousand } from "../../hooks/numberMusk";
import ResultInfo from "../rusultInfo/ResultInfo";


import {
    sendAnswers,
    allAnswers,
    allEntities,
    // fetchAnswers,
    updateOneAnswer,
    addManyAnswer,
    capabilitiesChange,
    securingLoanChange,
    proprtyChange,
    conditionalLoanChange,
    characteristicsChange,
    totalChange,
    mounthlyPaymentChange
} from "./financialClientSlice";


import "./financialClient.scss";

const loanBankPeriod = {
    "Потребительский кредит": 48,
    "Автокредит": 84,
    "Срочный займ": 12,
    "Ипотека": 300
}

const FinancialClient = () => {
    const [loanCollateral, setLoanCollateral] = useState(0);
    // const [answers, setAnswers] = useState({});
    // const [capabilities, setCapabilities] = useState(0);
    const [arrProprty, setArrProprty] = useState([]);
    // const [securingLoan, setSecuringLoan] = useState(0);
    // const [proprty, setProprty] = useState(0);
    // const [conditionalLoan, setConditionalLoan] = useState(0);
    // const [characteristics, setCharacteristics] = useState(0);
    // const [monthlyPayment, setMonthlyPayment] = useState(0);
    const answers = useSelector(allEntities);
    const mounthlyPayment = useSelector(store => store.answers.mounthlyPayment);
    // const arrProprty = useSelector(store => store.answers.arrProprty);
    const {request} = useHttp();
    console.log("answers finansial", answers)
    const dispatch = useDispatch();

    useEffect(() => {
        const id = localStorage.getItem("id");
        console.log("id", id)
        dispatch(sendAnswers(answers))
        // request(`http://localhost:3002/usersAnswer/${id}`)
            // dispatch(fetchAnswers(id))
            // .catch(console.log)
    }, [])


   

    const answersLength = Object.keys(answers).length;
    console.log("mounthlyPayment", mounthlyPayment);
    useEffect(() => {
        console.log("answersLength", answers, mounthlyPayment);
        if (answersLength && mounthlyPayment) {
            calculateCapabilities(answers)
            calculateProprty(answers)
            calculateConditionalLoan(answers)
            calculateCharacteristics(answers)
        }
    }, [mounthlyPayment])

    useEffect(() => {
        if (answersLength) {
            calculateLoanRatio();
        }
    }, [answersLength])
    
    useEffect(() => {
        console.log(mounthlyPayment, answersLength, arrProprty.length)
        if (answersLength  && arrProprty.length) {
            calculateSecuringLoan(answers, arrProprty)
        }

    }, [mounthlyPayment, answersLength, arrProprty.length])

    const calculateLoanRatio = () => {
        const {loanPercentage, loanPeriod, loanAmount, initialPayment} = answers;

        const mounthInterestRate = loanPercentage.value / 12 / 100;
        const degree = Math.pow((1 + mounthInterestRate), loanPeriod.value)
        const monthlyPayment = (mounthInterestRate * degree) / (degree - 1) * (loanAmount.value - initialPayment.value)
        console.log("fsdhjghjdg sdsfjasfjdgh monthlyPayment Financials", monthlyPayment);
        
        dispatch(mounthlyPaymentChange(monthlyPayment));
        return monthlyPayment;
    }

    const alignmentValues = (value) => {
        return +value.toFixed(2);
    }

    const calculateCapabilities  = ({salary, income, maintenance, rent, otherExpenses, region}) => {
        const mounthlyIncome = alignmentValues(salary.value + income.value / 12);
        console.log("mounthlyIncome", mounthlyIncome)
        const maintenanceCosts = alignmentValues((maintenance.value + 1) * region.value);
        console.log("maintenanceCosts", maintenanceCosts)
        const mounthlyIncomeExpense = alignmentValues(maintenanceCosts + rent.value + otherExpenses.value);
        console.log("mounthlyIncomeExpense", mounthlyIncomeExpense)
        const clearIncome = alignmentValues(mounthlyIncome - mounthlyIncomeExpense);
        console.log("clearIncome", clearIncome)
        const monthlyPayment = alignmentValues((calculateLoanRatio()) / clearIncome);
        console.log("monthlyPayment", monthlyPayment)
        const monthlyPaymentPoint = alignmentValues(100 * (1 - monthlyPayment));
        console.log("monthlyPaymentPoint", monthlyPaymentPoint)
        console.log("monthlyPayment > 0", monthlyPayment > 0)
        if (clearIncome > 0 && monthlyPayment < 1) {
            dispatch(capabilitiesChange(monthlyPaymentPoint > 30 ? 30 : monthlyPaymentPoint));
        } else {
            dispatch(capabilitiesChange(-500));
        }
    }

    const calculateProprty = ({deposits, apartament, vehicle, loanAmount}) => {
        const proprty = alignmentValues(deposits.value + apartament.value + vehicle.value);
        console.log("proprty", proprty)
        const sufficiencyProprty = alignmentValues(proprty / loanAmount.value);
        console.log("sufficiencyProprty", sufficiencyProprty)
        const sufficiencyProprtyPoint = alignmentValues(5 * sufficiencyProprty);
        console.log("sufficiencyProprtyPoint", sufficiencyProprtyPoint)

        setArrProprty([deposits, apartament, vehicle])

        dispatch(proprtyChange(sufficiencyProprtyPoint > 5 ? 5 : sufficiencyProprtyPoint));
    }
    
    const calculateSecuringLoan = ({loanPeriod, loanAmount, initialPayment}, arrProprty) => {
        
        const newArrProprty = arrProprty.map(item => item.value);
        console.log("newArrProprty", newArrProprty);

        const totalLoan = mounthlyPayment * loanPeriod.value;

        const loanCollateral = Math.min(...newArrProprty.filter(item => item + initialPayment.value > loanAmount));
        
        setLoanCollateral(loanCollateral);
        console.log("loanCollateral", loanCollateral);

        // const securityRatio = loanCollateral * (1 - 0.2) / loanAmount.value * (1 + 2 * loanPercentage.value / 12);
        const securityRatio = loanCollateral * 0.8 / totalLoan;
        console.log("securityRatio", securityRatio);
        let securityRatioPoint = alignmentValues(10 * (securityRatio))
        console.log("securityRatioPoint", securityRatioPoint);
        
        if (securityRatioPoint < 6 || (loanCollateral === Infinity && totalLoan > 1000000)) {
            securityRatioPoint = -500;
        } else if (securityRatioPoint > 25) {
            securityRatioPoint = 25;
        }

        dispatch(securingLoanChange(securityRatioPoint));
    }

    const calculateConditionalLoan = ({initialPayment, loanPeriod, loanAmount, loanPercentage}) => {
        const sum = alignmentValues(initialPayment.value + loanAmount.value);
         console.log("sum", sum);
        const initialPaymentRatio = alignmentValues(7 * alignmentValues(initialPayment.value / sum));
         console.log("initialPaymentRatio", initialPaymentRatio);
               
        
        const constPeriod = loanBankPeriod[loanPercentage.name];
         console.log("constPeriod", constPeriod);
        const divider = alignmentValues(3 * (constPeriod - loanPeriod.value));
         console.log("divider", divider);
        const loanPeriodRatio =  alignmentValues(divider / (constPeriod - 1));
         console.log("loanPeriodRatio", loanPeriodRatio);

        const conditionalLoanPoint = initialPaymentRatio + loanPeriodRatio
         console.log("conditionalLoanPoint", conditionalLoanPoint);

        dispatch(conditionalLoanChange(conditionalLoanPoint > 10 ? 10 : conditionalLoanPoint));
    }

    const calculateCharacteristics = (answers) => {
        console.log(answers)
        let customerСharacteristics = []
        for (let key in answers) {
            if (answers[key].assessment === "nature" && answers[key].status === "point") {
                customerСharacteristics.push(answers[key].value)
            }
        }
        console.log("kjgfdfgj", customerСharacteristics)
        const characteristicsRatio = customerСharacteristics.reduce((sum, currentValue) => alignmentValues(sum + currentValue), 0)
        const characteristicConvert = characteristicsRatio > 30 ? 30 : characteristicsRatio >= 0 ? characteristicsRatio : -500
        dispatch(characteristicsChange(characteristicConvert));
    }   
    
    

    const result = <ResultInfo answers={answers} loanCollateral={loanCollateral} arrProprty={arrProprty}/>;
    console.log("Financials loanCollateral", loanCollateral)
    return (
        <div className="result">
            {result}
            
        </div>
    )
}

export default FinancialClient;