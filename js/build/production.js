define([
        "dojo/_base/lang",
        "dojo/dom",
        "dojo/dom-construct",
        "dojo/on",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/query"
        ], function(lang, dom, domConstruct, on, array, domClass, domStyle, query){

	var listBox = function(options){
		/*
		 * Our listBox settings
		 */
		var settings = {
				title : "Items",
				addNewItems : false,
				node : null,
				items : []

		};
		/*
		 * Updating the listBox settings with the given options
		 */
		lang.mixin(settings, options);
		var _self = this;
		
		//The current boxNode
		this.boxNode = null;

		/*
		 * Render the listBox using the current settings
		 */
		this.render = function(){

			//Emptying the container of the listBox
			domConstruct.empty(settings.node);

			//Creating the listBox structure
			var listBoxNode = domConstruct.create("div", { class: "chsdk-list-box" });
			var listContainer = domConstruct.create("div", { class: "list-container" });

			domConstruct.place("<span class='list-title'>"+settings.title+"</span>", listContainer);
			domConstruct.place("<input type='text' class='list-search-box' placeholder='Search for "+settings.title+" ...' />", listContainer);
			if(settings.addNewItems){
				domConstruct.place("<div class='vertical-line-separator'>|</div>", listContainer);
				domConstruct.place("<span class='new-item-button'> <span class='plus-sign'>+</span>	new</span>", listContainer);
			}

			var listItems = domConstruct.create("div", { class: "items-container" });
			array.forEach(settings.items ,function(item){
				domConstruct.place("<span class='list-item'>"+item.name+"</span>", listItems);
			});
			domConstruct.place(listItems, listContainer);
			domConstruct.place(listContainer, listBoxNode);
			domConstruct.place("<span class='remove-item-button'> <span class='cross-sign'>X</span>	Remove</span>", listBoxNode);
			
			//Setting up the item selection mechanism
			query('.list-item', listItems).forEach(function(a){
				on(a, 'click', function() {
					query('.selected', _self.boxNode).forEach(function(selected){
						if(selected !== a){
							domClass.remove(selected, "selected");
						}
					});
					domClass.add(a, "selected");
				});
			});

			//Search box handler
			on(query('.list-search-box', listBoxNode)[0], 'keyup', function(input) {
				var val = this.value;
					query('.list-item', listItems).forEach(function(a){
						var reg = RegExp(val, 'i');
						if(reg.test(a.innerText)){
							domStyle.set(a, 'display', 'block');
						}else{
							domStyle.set(a, 'display', 'none');
						}
					});
				
			});

			_self.boxNode = listBoxNode;
			//Placing the listBox in our container
			domConstruct.place(listBoxNode, settings.node);	
		};

		/*
		 * Add an item to the items list
		 * @param {object} the new item object
		 */
		this.addItem = function(item){
			//Adding the element to our items list
			settings.items.push(item);

			//Re-rendering the listBox with the updated items list
			_self.rebuild();
		};

		/*
		 * Remove an item from the items list
		 * @param {string} the item to remove
		 */
		this.removeItem = function(item){
			var ind = _self.searchItem(item);
			settings.items.splice(ind, 1);
			
			_self.rebuild();
		};

		/*
		 * Search for an item in the items list
		 * @param {string} the item to search
		 * @return {number} the index of the given item if it exists, -1 otherwise
		 */
		this.getItemIndex = function(item){
			for(i in settings.items){
				if(settings.items[i].name === item){
					return i;
				}
			}
			return -1;
		};

		/*
		 * Rebuild the listBox using the current settings
		 */
		this.rebuild = function(){
			var listItems = query('.items-container', _self.boxNode)[0];
			domConstruct.empty(listItems);
			array.forEach(settings.items ,function(item){
				domConstruct.place("<span class='list-item'>"+item.name+"</span>", listItems);
			});

			//Re-attach events
			query('.list-item', listItems).forEach(function(a){
				on(a, 'click', function() {
					query('.selected', listItems).forEach(function(selected){
						if(selected !== a){
							domClass.remove(selected, "selected");
						}
					});
					domClass.add(a, "selected");
				});
			});

			//Search box handler
			on(query('.list-search-box', _self.boxNode)[0], 'keyup', function(input) {
				var val = this.value;
					query('.list-item', listItems).forEach(function(a){
						var reg = RegExp(val, 'i');
						if(reg.test(a.innerText)){
							domStyle.set(a, 'display', 'block');
						}else{
							domStyle.set(a, 'display', 'none');
						}
					});
				
			});
		}

		/*
		 * Update the listBox items list with the provided list
		 * @param {array} the new items list
		 */
		this.setNewItems = function(items){
			settings.items = items;
			_self.rebuild();
		};

		/*
		 * Attach a click handler for the list items
		 * @param {function} the handler to attach
		 */
		this.handleItemClick = function(callback){
			if(typeof callback === 'function'){
				query('.list-item', _self.boxNode).forEach(function(a){
					on(a, 'click', callback);
				});
			}
		};

		/*
		 * Attach a click handler for the Add new button
		 * @param {function} the handler to attach
		 */
		this.handleAddItemClick = function(callback){ 
			typeof callback === 'function' ? on(query('.new-item-button', _self.boxNode)[0], 'click', function(){callback()}) : console.log('An invalid handler is specified!');
		};

		/*
		 * Attach a click handler for the remove button
		 * @param {function} the handler to attach
		 */
		this.handleRemoveItemClick = function(callback){ 
			typeof callback === 'function' ? on(query('.remove-item-button', _self.boxNode)[0], 'click', function(){callback()}) : console.log('An invalid handler is specified!');
		};
	}
	return listBox;
});
require([ 
         'dojo/ready', 
         'dojo/_base/array', 
         'dojo/_base/lang',
         'dojo/query',
         'dojo/on'], function(ready, array, lang, query, on) {

	var users = [
	             {login: "user", password: "user"},
	             {login: "admin", password: "admin"}
	             ];

	var authentication = function(login, pwd){
		var result = false;
		array.some(users, function(user){
			if(user.login === login && user.password === pwd){
				result = true;
				return false;
			}
		});
		return result;
	}
	ready(function(){
		var loginButton = document.getElementById("login-button");
		on(loginButton, 'click', function(){
			var login = document.getElementById("login").value;
			var pwd = document.getElementById("pwd").value;

				console.log(login+" -- "+pwd+" -- "+authentication(login, pwd));
				if(authentication(login, pwd)){
					localStorage.setItem("username", login);
					window.location.replace("index.html");
				}else{
					alert("The provided data is invalid !");
				}
		});
	});

});




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
				
		});
	});
