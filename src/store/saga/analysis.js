

export function* analysisFiles(action) {
  try {
    console.log(action.payload)
  } catch(error) {
    console.error(error);
  }
}

