import { thousand } from "../../hooks/numberMusk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';


import {
    allEntities,
} from "../financialClient/financialClientSlice";


const collaterals = {
    deposit: "Без залога",
    vehicle: "Автомобиль",
    apartament: "Квартира"
}


const ResultInfo = ({loanCollateral, arrProprty}) => {
    const answers = useSelector(allEntities);
    const {loanAmount, initialPayment, loanPercentage, loanPeriod} = answers;
    const mounthlyPayment = useSelector(store => store.answers.mounthlyPayment);
    const characteristics = useSelector(store => store.answers.characteristics);
    const capabilities = useSelector(store => store.answers.capabilities);
    const proprty = useSelector(store => store.answers.proprty);
    const securingLoan = useSelector(store => store.answers.securingLoan);
    const conditionalLoan = useSelector(store => store.answers.conditionalLoan);

    const answersLength = Object.keys(answers).length;
    useEffect(() => {
        console.log("result Effect")
    })

    if (!answersLength || !arrProprty.length || !loanCollateral) return (<h1> LOADING RESULT.....</h1>)

    const arrConditional = [
        {
            text: 'Сумма', 
            units: '\u20bd', 
            value: thousand(loanAmount.value)
        },
        {
            text: 'Первоначальный взнос', 
            units: '\u20bd', 
            value: thousand(initialPayment.value)
        },
        {
            text: 'Ставка', 
            units: '%', 
            value: loanPercentage.value
        },
        {
            text: 'Срок', 
            units: 'мес.', 
            value: loanPeriod.value
        }
    ];

    const ggwp = arrProprty.filter(item => item.value === loanCollateral)[0];
    const collateral = ggwp ? ggwp.id : 0;

    const arrPayment = [
        {
            text: 'Ежемесячный платёж', 
            units: '\u20bd', 
            value: thousand(mounthlyPayment)
        },
        {
            text: 'Переплата', 
            units: '\u20bd', 
            value: thousand(mounthlyPayment * loanPeriod.value - loanAmount.value + initialPayment.value)
        },
        {
            text: 'Залог', 
            units: '', 
            value: collaterals[collateral]
        }
    ];

    if (!(loanPercentage && loanAmount && loanPeriod && arrProprty.length && loanCollateral)) return
    const total = characteristics + capabilities + proprty + securingLoan + conditionalLoan;

    
    const data = {
        total,
        loanPercentage: loanPercentage.name,
        loanPeriod: loanPeriod.value,
        loanAmount: thousand(loanAmount.value),
        sum: thousand(mounthlyPayment * loanPeriod.value),
        arrConditional,
        arrPayment
    }

    return (
        <View data={data}/>
    )
}

const View = ({data}) => {
    console.log("2225 View", data);
    const {
        total,
        loanPercentage,
        sum,
        loanPeriod,
        loanAmount,
        arrConditional,
        arrPayment
    } = data;

    const layout = (label, arr) => {
        const items = arr.map(item => {
            return (
                <div key={item.text} className="description-item">
                    <p>{item.text}</p>
                    <h4><span>{item.value ? item.value : "Отсутсвует"}</span>{item.units}</h4>
                </div>
            )
        })
        return (
            <>
                <h3 className="description-label">{label}</h3>
                <div className="description">
                    {items}
                </div>
            </>
        )
    }
    
    const resultConditional = layout("Условия кредиования:", arrConditional);
    const resultPayment = layout("Платежи:", arrPayment);

    if (total > 55) {
        return (
            <div>
                <h2>{total}</h2>
                <h2 className="congratulation">Поздравляем!</h2>
                <h2>
                    Вам одобрен(а) <span>{loanPercentage}</span>
                </h2>
                {resultConditional}
                {resultPayment}
            </div>
        );
    } else {
        return (
            <div>
                <h2>{total}</h2>
                <h2>
                    Вам не одобрен(a) <span>{loanPercentage}</span> на сумму <span>{loanAmount}</span> рублей
                </h2>
                <h3>
                    На срок: <span>{loanPeriod}</span> месяцев.
                </h3>
                <h3>
                    Общая сумма выплат: <span>{sum}</span> рублей
                </h3>
            </div>
        );
    }
}

export default ResultInfo;