import { call } from "redux-saga/effects";
import _ from "lodash";

export function* convertFile(action) {
  const { convertType, fileList } = action.payload;
  const originalFile = yield call(getFileData, fileList.toJS());

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
      d.forEach(e => (data = { ...data, ...e.value }));
      return [{ key: "merge_file", value: data }];
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
              graphic: t.graphic.reverse(),
              origin: t.origin.reverse(),
              change: t.change.reverse()
            };
          });
          target.standard_seq = this.reverseString(target.standard_seq);
          target.seq_target = this.reverseString(target.seq_target);
        });
        return { key, value };
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

        return { key, value };
      });

      return data;
    }
  };

  let convertedFile = originalFile;

  convertType.map(c => (convertedFile = convert[c](convertedFile)));

  console.log(convertedFile);
  console.log(fileList.toJS());
  try {
  } catch (error) {
    console.error(error);
  }
}

function getDataList(fileList) {
  return Promise.all(
    fileList.map(async file => await new Response(file).text())
  );
}

async function handleFileList(dataList, fileList) {
  return dataList.map((data, i) => {
    const value = JSON.parse(data);
    const key = fileList[i].name.replace(".json", "");
    return { key, value };
  });
}

async function getFileData(fileList) {
  const dataList = await getDataList(fileList);
  return handleFileList(dataList, fileList);
}
