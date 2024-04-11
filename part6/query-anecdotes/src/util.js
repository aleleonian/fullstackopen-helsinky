export function customLog(variable) {
    if (typeof variable !== 'string') {
      const variableName = Object.keys(window).find(key => window[key] === variable);
      console.log(`${variableName} ->`, JSON.stringify(variable));
    } else {
      console.log(variable);
    }
  }
  