import uniqid from "uniqid";

export const getUniqId = (prefix, suffix) => {
  const preId = uniqid(prefix);
  const suffId = uniqid(suffix);

  return preId + suffId;
};

function getDataList(fileList) {
  return Promise.all(
    fileList.map(async file => await new Response(file).text())
  );
}

async function handleFileList(dataList, fileList) {
  return dataList.map((data, i) => {
    const d = JSON.parse(data);
    const key = fileList[i].name.replace(".json", "");
    return { key, ...d };
  });
}

export async function getFileData(fileList) {
  const dataList = await getDataList(fileList);
  return handleFileList(dataList, fileList);
}
