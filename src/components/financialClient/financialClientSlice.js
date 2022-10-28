import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector
} from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';
const answersAdapter = createEntityAdapter({
    selectId: answers => answers.id
});

const initialState = answersAdapter.getInitialState({
    capabilities: 0,
    securingLoan: 0,
    proprty: 0,
    conditionalLoan: 0,
    characteristics: 0,
    total: 0,
    mounthlyPayment: 0
});

export const fetchAnswers = createAsyncThunk(
    'answers/fetchQuestion',
    async (id) => {
        const {request} = useHttp();
        return await request(`http://localhost:3002/usersAnswer/${id}`);
    }
)

const pid = localStorage.getItem("id");

const answerSlice = createSlice({
    name: "answers",
    initialState,
    reducers: {
        updateOneAnswer: (state, action) => {answersAdapter.upsertOne(state, action.payload)},
        addOneAnswer: (state, action) => {answersAdapter.addOne(state, action.payload)},
        // addManyAnswer: (state, action) => {answersAdapter.addMany(state, action.payload)},
        capabilitiesChange: (state, action) => {state.capabilities = action.payload},
        securingLoanChange: (state, action) => {state.securingLoan = action.payload},
        proprtyChange: (state, action) => {state.proprty = action.payload},
        conditionalLoanChange: (state, action) => {state.conditionalLoan = action.payload},
        characteristicsChange: (state, action) => {state.characteristics = action.payload},
        totalChange: (state, action) => {state.total = action.payload},
        mounthlyPaymentChange: (state, action) => {state.mounthlyPayment = action.payload}
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAnswers.pending, state => {
                // state.questionLoadingStatus = "loading"
            })
            .addCase(fetchAnswers.fulfilled, (state, action) => {
                // state.questionLoadingStatus = "idle"
                answersAdapter.setAll(state, action.payload);
            })
            .addCase(fetchAnswers.rejected, state => {
                // state.questionLoadingStatus = "error"
            })
            // .addCase(fetchAnswer.pending, state => {
            //     state.questionLoadingStatus = "loading"
            // })
            // .addCase(fetchAnswer.fulfilled, (state) => {
            //     state.questionLoadingStatus = "idle"
                // questionAdapter.setAll(state, action.payload);
            // })
            // .addCase(fetchAnswer.rejected, state => {
            //     state.questionLoadingStatus = "error"
            // })
            .addDefaultCase(() => {})

    }
});

const {actions, reducer} = answerSlice;

const {selectAll} = answersAdapter.getSelectors(state => state.answers);
export const allAnswers = createSelector(selectAll, answers => answers);

const {selectEntities} = answersAdapter.getSelectors(state => state.answers);
export const allEntities = createSelector(selectEntities, answers => answers);

export default reducer;
export const {
    addOneAnswer,
    updateOneAnswer,
    addManyAnswer,
    capabilitiesChange,
    securingLoanChange,
    proprtyChange,
    conditionalLoanChange,
    characteristicsChange,
    totalChange,
    mounthlyPaymentChange
} = actions;