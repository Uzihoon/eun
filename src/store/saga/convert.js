import { call, put } from "redux-saga/effects";
import _ from "lodash";
import * as ConvertActions from "store/modules/convert";
import * as StateActions from "store/modules/state";
import JSZip from "jszip";
import { getFileData } from "lib/utility";
import { saveAs } from "file-saver";

export function* convertFile(action) {
  const { convertType, fileList } = action.payload;
  const originalFile = yield call(getFileData, fileList.toJS());

  // for (let i; i < originalFile.length; i++) {
  //   const value = originalFile[i].value;
  //   for (let i in value) {
  //     if (!value[i].standard_seq) {
  //       yield put(
  //         StateActions.showMsg({
  //           status: "error",
  //           content: "Please input correct file!"
  //         })
  //       );
  //       return;
  //     }
  //   }
  // }

  const convert = {
    cp: data => _.cloneDeep(data),
    reverseString: str =>
      str
        .split("")
        .reverse()
        .join(""),
    changeType: type => {
      let changed;
      switch (type.toLowerCase()) {
        case "g":
          changed = "C";
          break;
        case "a":
          changed = "T";
          break;
        case "t":
          changed = "A";
          break;
        case "c":
          changed = "G";
          break;
        default:
          break;
      }

      return changed;
    },
    joinAfterChange: (seq, c) => {
      return seq
        .split("")
        .map(s => c(s))
        .join("");
    },
    merge(d) {
      let data = {};
      d.forEach(
        e =>
          (data = {
            value: { ...data.value, ...e.value },
            format: e.format,
            summary: e.summary
          })
      );
      return [{ key: "merge_file", ...data }];
    },
    reverseSeq(d) {
      const data = d.map(e => {
        const key = e.key;
        const value = this.cp(e.value);
        Object.keys(value).forEach(v => {
          const target = value[v];
          target.table = target.table.map(t => {
            return {
              ...t,
              graphic: this.reverseString(t.graphic),
              origin: this.reverseString(t.origin),
              change: this.reverseString(t.change)
            };
          });
          target.standard_seq = this.reverseString(target.standard_seq);
          target.seq_target = this.reverseString(target.seq_target);
        });
        return { key, value, format: e.format, summary: e.summary };
      });
      return data;
    },
    reverseNucleo(d) {
      const c = this.changeType;

      const data = d.map(e => {
        const key = e.key;
        const value = this.cp(e.value);

        Object.keys(value).forEach(v => {
          const target = value[v];
          target.table = target.table.map(t => {
            return {
              ...t,
              origin: this.joinAfterChange(t.origin, c),
              change: this.joinAfterChange(t.change, c)
            };
          });

          target.standard_seq = this.joinAfterChange(target.standard_seq, c);
          target.seq_target = this.joinAfterChange(target.seq_target, c);
        });

        return { key, value, format: e.format, summary: e.summary };
      });
      return data;
    }
  };

  let convertedFile = originalFile;
  yield put(ConvertActions.setGauge(50));
  convertType.map(c => (convertedFile = convert[c](convertedFile)));
  yield put(ConvertActions.setGauge(100));

  const zip = new JSZip();
  convertedFile.map(file => {
    const data = {
      value: file.value,
      format: file.format,
      summary: file.summary
    };
    zip.file(`${file.key}.json`, JSON.stringify(data));
  });

  const zipName = "EUN_Convert_File.zip";
  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, zipName);
  });
  try {
  } catch (error) {
    console.error(error);
  }
}
