import { configureStore } from '@reduxjs/toolkit';

import questions from '../components/AssessingClient/assessingClientSlice';
import answers from '../components/financialClient/financialClientSlice';
const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
};

const store = configureStore({
    reducer: {questions, answers},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
})

export default store;