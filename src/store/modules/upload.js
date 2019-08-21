import { createAction, handleActions } from "redux-actions";
import { Map, List, fromJS } from "immutable";

const HANDLE_FILE_LIST = "upload/HANDLE_FILE_LIST";
const DELETE_FILE_LIST = "upload/DELTE_FILE_LIST";
const FORMAT_DATA = "upload/FORMAT_DATA";
const SET_UPLOAD = "upload/SET_UPLOAD";
const RESET_UPLOAD = "upload/RESET_UPLOAD";

export const handleFileList = createAction(HANDLE_FILE_LIST);
export const deleteFileList = createAction(DELETE_FILE_LIST);
export const formatData = createAction(FORMAT_DATA);
export const setUpload = createAction(SET_UPLOAD);
export const resetUpload = createAction(RESET_UPLOAD);

const initialState = Map({
  fileList: List([]),
  nucleaseTypeList: List([
    {
      title: "Single nuclease",
      value: "0"
    },
    {
      title: "Paried nuclease",
      value: "1"
    }
  ]),
  nucleaseList: List([
    {
      title: "SpCas9 from Streptococcus pyogenes: 5'-NGG-3'",
      value: "1"
    },
    {
      title:
        "StCas9 from Streptococcus thermophilus: 5'-NNAGAAW-3' (W = A or T)",
      value: "2"
    },
    {
      title: "NmCas9 from Neisseria meningitidis: 5'-NNNNGMTT-3' (M = A or C)",
      value: "3"
    },
    {
      title: "SaCas9 from Staphylococcus aureus: 5'-NNGRRT-'3 (R=A or G)",
      value: "4"
    },
    {
      title: "CjCas9 from Campylobacter jejuni: 5'-NNNNACAC-3'",
      value: "5"
    },
    {
      title:
        "AsCpf1 from Acidaminococcus or LbCpf1 from Lachnospiraceae: 5'-TTTN-3'",
      value: "6"
    },
    {
      title: "xCas9 from Streptococcus pyogene 5'-NGT-3'",
      value: "11"
    },
    {
      title: "FnCpf1 from francisella novicida: 5'-TTN-3'",
      value: "12"
    },
    {
      title:
        "Spy-macCas9 from Streptococcus pyogenes and Streptococcus macacae: 5'-NAAN-3'",
      value: "13"
    },
    {
      title: "XCas9 3.7 (TLIKDIV SpCas9) from Streptococcus pyogenes: 5'-NG-3'",
      value: "14"
    }
  ]),
  format: Map({})
});

export default handleActions(
  {
    [HANDLE_FILE_LIST]: (state, action) => {
      const { payload: file } = action;
      const fileList = state.get("fileList").toJS();
      fileList.push(file);
      return state.set("fileList", fromJS(fileList));
    },
    [DELETE_FILE_LIST]: (state, action) => {
      const { payload: file } = action;
      const fileList = state.get("fileList").toJS();
      const newFileList = fileList.filter(e => e.name !== file.name);
      return state.set("fileList", fromJS(newFileList));
    },
    [SET_UPLOAD]: (state, action) => {
      const { type, data } = action.payload;
      return state.set(type, fromJS(data));
    },
    [RESET_UPLOAD]: (state, action) => {
      return state.set("fileList", List([])).set("format", Map({}));
    }
  },
  initialState
);
