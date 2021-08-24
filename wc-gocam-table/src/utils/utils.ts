export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}


export function extractORCID(orcid: string) {
  var checkedOrcid = orcid;
  if (orcid.includes("http://orcid.org/")) {
    checkedOrcid = orcid.replace("http://orcid.org/", "");
  }
  return checkedOrcid;
}

export function scoreGO(model1, model2, type) {
  var scorego = 0.0;
  if (model1[type] && model1[type].length > 0
    && model2[type] && model2[type].length > 0) {
    for (let m1 = 0; m1 < model1[type].length; m1++) {
      for (let m2 = 0; m2 < model2[type].length; m2++) {
        if (model1[type][m1].id == model2[type][m2].id) {
          scorego++;
          break;
        }
      }
    }
    scorego /= model1[type].length;
  }
  return scorego;
}

export function scoreModel(model1, model2) {
  var score = 0;
  let divider = 0;

  if ((model1["bp"] && model1["bp"].length > 0) || (model2["bp"] && model2["bp"].length > 0)) {
    score += scoreGO(model1, model2, "bp");
    divider++;
  }

  if ((model1["mf"] && model1["mf"].length > 0) || (model2["mf"] && model2["mf"].length > 0)) {
    score += scoreGO(model1, model2, "mf");
    divider++;
  }

  if ((model1["cc"] && model1["cc"].length > 0) || (model2["cc"] && model2["cc"].length > 0)) {
    score += scoreGO(model1, model2, "cc");
    divider++;
  }

  if (divider == 0)
    return 0;
  return score / divider;
}



export function extractGPid(gpuri) {
  var id = gpuri;
  if (id.indexOf("/") != -1) {
    id = id.substring(id.lastIndexOf("/") + 1);
  }
  return id.trim();
}


export function isObject(val) {
  return val instanceof Object && !Array.isArray(val);
}

export function stringify(data) {
  var str = "";
  Object.keys(data).forEach(field => {

    // we don't want search field which is already an aggregate
    if (field != "searchfield") {

      // if one of the field is an object (but not an array)
      if (isObject(data[field])) {
        str += stringify(data[field]);

        // if one of the field is an array
      } else if (Array.isArray(data[field])) {
        let array = "";
        data[field].forEach(elt => {
          if (isObject(elt)) {
            array += stringify(elt);
          } else {
            array += elt + "; ";
          }
        });
        if (array.endsWith("; ")) {
          array = "[" + array.substring(0, array.length - 3) + "]";
        }
        if (array.length == 0) {
          array = "[N/A]";
        }
        str += array + "\t";

        // else
      } else {
        if (data[field]) {
          if (isObject(data[field])) {
            str += stringify(data[field]);
          } else {
            str += data[field] + "\t";
          }
        } else {
          str += "N/A\t";
        }
      }

    }

  });
  return str;
}

export function customStringify(row) {
  var str = row.date + "\t" + row.gocam + "\t" + row.title;
  if (row.bp && row.bp.length > 0) {
    str += "\t" + row.bp.map(elt => { return elt.name + " (" + elt.id + ")" }).join("; ")
  } else {
    str += "\tN/A";
  }
  if (row.mf && row.mf.length > 0) {
    str += "\t" + row.mf.map(elt => { return elt.name + " (" + elt.id + ")" }).join("; ")
  } else {
    str += "\tN/A";
  }
  if (row.cc && row.cc.length > 0) {
    str += "\t" + row.cc.map(elt => { return elt.name + " (" + elt.id + ")" }).join("; ")
  } else {
    str += "\tN/A";
  }
  if (row.gp && row.gp.length > 0) {
    str += "\t" + row.gp.map(elt => { return elt.fullName + " (" + elt.id + ")" }).join("; ")
  } else {
    str += "\tN/A";
  }
  return str;
}

// Format the name of the user
export function simplifyName(name: string) {
  if (name.indexOf(" ") == -1)
    return name;
  // simple regex to divide name based on space or dash (differentiate last name dash and first name dash)
  var split = name.split(/\s|-(?=[a-zA-Zéèàïü]+\s)/);
  if (split.length == 1) {
    return name;
  }

  var firstNames = "";
  for (var i = 0; i < split.length - 1; i++) {
    firstNames += split[i].substring(0, 1) + ".";
  }
  return firstNames + split[split.length - 1];
}

export function clipboard(row) {
  console.log("clipboard: ", row);

  const el = document.createElement('textarea');
  el.value = customStringify(row);
  //    el.value = stringify(row);
  //    el.value = JSON.stringify(row);
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

}

/* extract the id of a given url xxx/{id}. By default, if this is not a URL, return the parameter itself */
export function extractURLID(url: string) {
  if (url.indexOf("/") == -1)
    return url;
  return url.substring(url.lastIndexOf("/") + 1);
}


export function concat(a, b) {
  return a + "," + b;
}
