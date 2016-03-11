
require(['myLibs/listBox', 
         'dojo/ready', 
         'dojo/_base/xhr', 
         'dojo/_base/array', 
         'dojo/_base/lang',
         'dojo/query'], function(listBox, ready, xhr, array, lang, query) {

	var data = {companies: 
		[
		 {id:1, name:'Test Company 1', departments: [{id:1, name:'Department 1', employees: [
		                                                                                     {id:1, name:'Mohamed Ben Mohamed'},
		                                                                                     {id:2, name: 'Mariem Ben Mariem'},
		                                                                                     {id:3, name: 'Ahmed Ben Ahmed'}
		                                                                                    	 ]},
		                                                                                    	 {id:2, name:'Department 2'},
		                                                                                    	 {id:3, name:'Department 3'}
		                                                                                    	 ]
		 },
		 {id:2, name:'Test Company 2', departments: [{id:1, name:'First Department', employees : []},
		                                             {id:2, name:'Second Department', employees : []},
		                                             {id:3, name:'Third Department', employees : []}
		                                             ]
		 },
		 {id:3, name:'Test Company 3', departments: [{id:1, name:'Test Department 1', employees : []},
		                                             {id:2, name:'Test Department 2', employees : []},
		                                             {id:3, name:'Test Department 3', employees : []}
		                                             ]
		 }
		 ]
		 };
	
	
		ready(function() {
		
				var companies = data.companies;
				var departments = [];
				var employees = [];
				
				//Used to point to the category to remove from
				var currentCategory = null;
				
				
				var newEmpModal = document.getElementById('newEmpModal');
				var deleteConfirmModal = document.getElementById('deleteConfirmModal');
				
				var companiesBox = new listBox({
					title : "Companies",
					node: "companiesNode",
					items : companies
				});
				companiesBox.render();
				
				var departmentsBox = new listBox({
					title : "Departments",
					node: "departmentsNode"
				});
				departmentsBox.render();
				
				var employeesBox = new listBox({
					title : "Employees",
					node: "employeesNode",
					addNewItems: true
				});
				employeesBox.render();
				
				//handle the click event change in sub-category for companies
				companiesBox.handleItemClick(function(){
					var company = query('.selected', companiesBox.boxNode)[0].innerText;
					var ind = companiesBox.getItemIndex(company);
					deps = companies[ind].departments;
					departmentsBox.setNewItems(deps);
					//handle the click event change in sub-category for departments
					departmentsBox.handleItemClick(function(){
						var dep = query('.selected', departmentsBox.boxNode)[0].innerText;
						var ind = departmentsBox.getItemIndex(dep);
						employees = deps[ind].employees;
						employeesBox.setNewItems(employees);
					});
				});
				
				companiesBox.handleRemoveItemClick(function(){
					currentCategory = "Companies";
					deleteConfirmModal.style.display = "block";
				});
				
				departmentsBox.handleRemoveItemClick(function() {
					currentCategory = "Departments";
					deleteConfirmModal.style.display = "block";
				});
				
				employeesBox.handleRemoveItemClick(function() {
					currentCategory = "Employees";
					deleteConfirmModal.style.display = "block";
				});
				
				var confirmButton = document.getElementById("confirm-delete-button");
				var cancelButton = document.getElementById("confirm-cancel-button");
				
				confirmButton.onclick = function(){
					switch(currentCategory) {
					case "Companies":
						//Test if there's a selected item to delete
						if(typeof query('.selected', companiesBox.boxNode)[0] !== 'undefined'){
							var company = query('.selected', companiesBox.boxNode)[0].innerText;
							var ind = companiesBox.getItemIndex(company);
							companies.splice(ind, 1);
							companiesBox.setNewItems(companies);
						}else{
							alert("Please Select the item you want to delete!");
						}
						
						break;
					case "Departments":
						if(typeof query('.selected', departmentsBox.boxNode)[0] !== 'undefined'){
							var dep = query('.selected', departmentsBox.boxNode)[0].innerText;
							var ind = departmentsBox.getItemIndex(dep);
							deps.splice(ind, 1);
							departmentsBox.setNewItems(deps);
						}else{
							alert("Please Select the item you want to delete!");
						}
						break;
					case "Employees":
						if(typeof query('.selected', employeesBox.boxNode)[0] !== 'undefined'){
						var emp = query('.selected', employeesBox.boxNode)[0].innerText;
						var ind = employeesBox.getItemIndex(emp);
						employees.splice(ind, 1);
						employeesBox.setNewItems(employees);
						}else{
							alert("Please Select the item you want to delete!");
						}
						break;
					}
					deleteConfirmModal.style.display = "none";
				}
				
				cancelButton.onclick = function(){
					deleteConfirmModal.style.display = "none";
				}

				// Get the <span> element that closes the modal
				var close1 = document.getElementById("close1");
				var close2 = document.getElementById("close2");
				
				var companySelect = document.getElementById("company-select");
				var depSelect = document.getElementById("dep-select");

				// When the user clicks the button, open the modal 
				employeesBox.handleAddItemClick(function() {			
					array.forEach(companies, function(comp){
						var option = document.createElement("option");
						option.value = comp.name;
						option.innerText = comp.name;
						companySelect.appendChild(option);
					});
					
					var comp = companies[0];
					array.forEach(comp.departments, function(dp){
						var dep = document.createElement("option");
						dep.value = dp.name;
						dep.innerText = dp.name;
						depSelect.appendChild(dep);
					});
				    newEmpModal.style.display = "block";
				});
				
				companySelect.onchange = function(){
					depSelect.options.length = 0;
					var ind = companiesBox.getItemIndex(this.value);
					departments = companies[ind].departments;
					array.forEach(departments, function(dp){
						var dep = document.createElement("option");
						dep.value = dp.name;
						dep.innerText = dp.name;
						depSelect.appendChild(dep);
					});
				}
				
				
				var modalAddButton = document.getElementById("add-button");
				modalAddButton.onclick = function() {
					var empObject = {
							name : document.getElementById("name-input").value,
							email: document.getElementById("email-input").value,
							phone: document.getElementById("phone-input").value,
							celphone: document.getElementById("celphone-input").value,
							location: document.getElementById("location-input").value	
					};
					var companyName = companySelect.value;
					var depName = depSelect.value;
					array.some(data.companies, function(company){
						if(company.name === companyName){
							array.some(company.departments, function(dep){
								if(dep.name === depName){
									dep.employees.push(empObject);
									employeesBox.setNewItems(dep.employees);
									employeesBox.rebuild();
									return false;
								}
								
							});
						}
					});
					
					newEmpModal.style.display = "none";
					depSelect.options.length = 0;
					companySelect.options.length = 0;
				}

				// When the user clicks on <span> (x), close the modal
				close1.onclick = function() {
					depSelect.options.length = 0;
					companySelect.options.length = 0;
				    newEmpModal.style.display = "none";
				}

				close2.onclick = function() {
					depSelect.options.length = 0;
					companySelect.options.length = 0;
				    deleteConfirmModal.style.display = "none"; 
				}

				// When the user clicks anywhere outside of the modal, ignore it
				window.onclick = function(event) {
				    if (event.target !== newEmpModal && event.target !== deleteConfirmModal) {
				        event.preventDefault();
				    }
				}
				
				//deps = companies[0].departments;
				//departmentsBox.setNewItems(deps);
				
				//employees = companies[0].departments[0].employees;
				//employeesBox.setNewItems(employees);
				
				
		});
	});