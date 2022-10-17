import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector
} from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';

const questionAdapter = createEntityAdapter();

const initialState = questionAdapter.getInitialState({
    questionLoadingStatus: "idle",
    questionNumber: 14,
    total: 0
});

export const fetchQuestion = createAsyncThunk(
    'assessingClient/fetchQuestion',
    async () => {
        const {request} = useHttp();
        return await request("http://localhost:3001/assessingClient");
    }
)

const assessingClientSlice = createSlice({
    name: "assessingClient",
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
                questionAdapter.setAll(state, action.payload);
            })
            .addCase(fetchQuestion.rejected, state => {
                state.questionLoadingStatus = "error"
            })
            .addDefaultCase(() => {})

    }
});

const {actions, reducer} = assessingClientSlice;

const {selectAll} = questionAdapter.getSelectors(state => state.assessingClient);
export const allQuestions = createSelector(selectAll, assessingClient => assessingClient);

export default reducer;
export const {
    questionFetching,
    questionFetched,
    questionFetchingError,
    questionNumberChange,
    totalChange
} = actions;