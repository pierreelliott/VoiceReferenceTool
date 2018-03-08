// ============= GLOBALS =============

var dialogueTable;

// ===================================

document.getElementById("importFileBtn").addEventListener("click", function() {
	var input = document.getElementById("fileToImport");
	input.addEventListener("change", function() {
		if ('files' in input) {
	        if (input.files.length == 0) {
	            alert("Aucun fichier sélectionné");
	        } else {
				loadFile(input.files[0]);
	            /*for (var i = 0; i < input.files.length; i++) {
	                txt += "<br><strong>" + (i+1) + ". file</strong><br>";
	                var file = input.files[i];
	                if ('name' in file) {
	                    txt += "name: " + file.name + "<br>";
	                }
	                if ('size' in file) {
	                    txt += "size: " + file.size + " bytes <br>";
	                }
	            }*/
	        }
	    }
	    else {
	        if (input.value == "") {
	            alert("Aucun fichier sélectionné");
	        } else {
				alert("Votre navigateur ne supporte pas cette fonctionnalité");
	        }
	    }
	});
	input.click();
});

function loadFile(file) {
	var reader = new FileReader();

      // Closure to capture the file information.
	reader.onload = (function(theFile) {
		return function(e) {
			parseFileText(e.target.result);
		};
	})(file);
	reader.onprogress = updateProgress;

	reader.readAsText(file, "ANSI");

	function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      // Increase the progress bar length.
      console.log("Loaded: " + percentLoaded + "%");
    }
  }
}

function parseFileText(text) {
	var table = text.split("\n");
	table.forEach(function (value, key, array) {
		array[key] = value.split("\t");
	});

	dialogueTable = table;
	console.log("Number of lines : " + table.length);

	resetTable();
	populateTheTable(table);
}

function resetTable() {
	var table = document.getElementById("dialogueTable");
	table.getElementsByTagName("thead")[0].innerHTML = "";
	table.getElementsByTagName("tbody")[0].innerHTML = "";
	document.getElementById("columnChecker").innerHTML = "";
}

function populateTheTable(tableText) {
	var table = document.getElementById("dialogueTable");
	var columnChecker = document.getElementById("columnChecker");
	var len = tableText.length;
	var i, j;

	var line = document.createElement("tr");
	for(j = 0; j < tableText[0].length; j++) {
		createHeader(j);
	}
	table.getElementsByTagName("thead")[0].append(line);

	for(i = 1; i < len; i++) {
		let dialogueLine = document.createElement("tr");
		for(j = 0; j < tableText[i].length; j++) {
			var x = document.createElement("td");
			x.textContent = tableText[i][j];
			dialogueLine.append(x);
		}
		table.getElementsByTagName("tbody")[0].append(dialogueLine);
	}

	function createHeader(j) {
		var x = document.createElement("th");
		x.addEventListener("click", function() { sortTable(j); });
		x.textContent = tableText[0][j];
		line.append(x);

		var y = document.createElement("input");
		y.id = "column" + j;
		y.name = tableText[0][j];
		y.type = "checkbox";
		y.checked = true;
		y.addEventListener("change", function() { toggleColumn(j, y); } );
		var z = document.createElement("label");
		z.for = y.id;
		z.textContent = tableText[0][j];
		columnChecker.append(y);
		columnChecker.append(z);
	}
}

function toggleColumn(n, checkbox) {
	var table = document.getElementById("dialogueTable");
	var thead = table.getElementsByTagName("thead")[0];
	var tbody = table.getElementsByTagName("tbody")[0];
	if(checkbox.checked) {
		thead.children[0].children[n].classList.toggle("d-none", false);
		/*tbody.children.forEach(function (tr) {
			tr.children[n].toggle("d-none", false);
		});*/
	} else {
		thead.children[0].children[n].classList.toggle("d-none", true);
		/*tbody.children.forEach(function (tr) {
			tr.children[n].toggle("d-none", true);
		});*/
	}
}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("dialogueTable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare, one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place, based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
