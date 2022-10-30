import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector
} from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';

const questionAdapter = createEntityAdapter({
    selectId: questions => questions.id
});

const initialState = questionAdapter.getInitialState({
    questionLoadingStatus: "idle",
    questionNumber: 0,
    total: 0
});

export const fetchQuestion = createAsyncThunk(
    'questions/fetchQuestion',
    async () => {
        const {request} = useHttp();
        return await request("https://loan-data-base.herokuapp.com/questions");
    }
)

export const fetchAnswer = createAsyncThunk(
    'questions/fetchQuestion',
    async (body) => {
        const {request} = useHttp();
        return await request("https://loan-data-base.herokuapp.com/questions", "UPDATE", body);
    }
)

const questionsSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        questionNumberChange: (state) => {state.questionNumber = state.questionNumber + 1},
        totalChange: (state, action) => {state.total = +(state.total + action.payload).toFixed(2)}
    },
    extraReducers: builder => {
        builder
            .addCase(fetchQuestion.pending, state => {
                state.questionLoadingStatus = "loading"
            })
            .addCase(fetchQuestion.fulfilled, (state, action) => {
                state.questionLoadingStatus = "idle"
                questionAdapter.addMany(state, action.payload);
            })
            .addCase(fetchQuestion.rejected, state => {
                state.questionLoadingStatus = "error"
            })
            
            // .addCase(fetchAnswer.fulfilled, (state) => {
            //     state.questionLoadingStatus = "idle"
            //     questionAdapter.setAll(state, action.payload);
            // })
            // .addCase(fetchAnswer.rejected, state => {
            //     state.questionLoadingStatus = "error"
            // })
            .addDefaultCase(() => {})

    }
});

const {actions, reducer} = questionsSlice;

const {selectAll} = questionAdapter.getSelectors(state => state.questions);
export const allQuestions = createSelector(selectAll, questions => questions);

export default reducer;
export const {
    questionFetching,
    questionFetched,
    questionFetchingError,
    questionNumberChange,
    totalChange
} = actions;