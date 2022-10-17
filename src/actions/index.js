// import {
//     questionFetched,
//     questionFetching,
//     questionFetchingError
// } from '../components/AssessingClient/AssessingClientSlise';


// export const fetchQuestion = (request, questionNumber) => (dispatch) => {
//     dispatch(questionFetching());
//     request(`http://localhost:3001/${questionNumber}`)
//         .then(data => dispatch(questionFetched(data)))
//         .catch(dispatch(questionFetchingError()));
// }