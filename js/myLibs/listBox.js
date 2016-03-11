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
