speck
=====

A set of utility functions for easily rendering linkedin-dust javascript templates in a backbone project with requirejs. 

##basic usage

###dust file:
```html
<h1>Friends of {name}</h1>
<ul>
{#friends}
 <li>{name}</li>
{/friends}
</ul>
```

###your model:
```javascript
new UserModel({name:'Bob', id:444, friends: [{name:'Joe'},{name:'Alex'}]});
```

###a simple model based view
```javascript
define(['backbone', 'speck!./user'], function(Backbone, speck){
	return Backbone.View.extend({
		render: function(){
			speck.view(this); //uses this.model and this.$el
		}
	});
});
```

##Backbone Views as context

###dust file:
```html
<h1>Friends of {getName}</h1>
```

### A view with a member for the template
```javascript
define(['backbone', 'speck!./user'], function(Backbone, speck){
	return Backbone.View.extend({
		render: function(){
			speck.view(this); //uses this.model and this.$el
		}, 
		//the view is in the template's context so it will call this function
		getName: function(){
			return "Bob";
		}
	});
});
```

##Replace the DOM element in your backbone view
###dust file:
```html
<li class="large">{name}</li>
```

###A list item view
```javascript
define(['backbone', 'speck!./userList'], function(Backbone, speck){
	return Backbone.View.extend({
		render: function(){
			//The second boolean parameter means the default 
			//"div" element will be replaced with the template contents.
			speck.view(this, true); 
		}		
	});
});
```

##run code after render completes
###dust file:
```html
<li class="large">{getAjaxName}</li>
```

###A list item view with delayed rendering
```javascript
define(['backbone', 'speck!./userList'], function(Backbone, speck){
	return Backbone.View.extend({
		render: function(){
			//The second boolean parameter means the default 
			//"div" element will be replaced with the template contents.
			speck.view(this, true).done(function(){
				//this uses jquery deferreds, so .done, .finally, and .then all work.
				
				//the dom elements are done rendering here.
				var existsNow = $('.large'); 
			});
			var doesNotExistYet = $('.large'); //it won't be in the dom here yet
		},
		someText:function(chunk, context, bodies){
			return chunk.map(function(chunk) {
				//assume some ajax call here instead of just setTimeout
				setTimeout(function() {
					chunk.end("Async"); //tells dust we're done with this chunk
				},1000);
			});
		}
	});
});
```


##Full API

```javascript
//render the dust template and then callback with the standard dustjs callback
//returns undefined
speck.render(objectContext, element);

//render the dust template to the element using the provided context
//returns a deferred that is resolved when rendering is complete
speck.html(element, objectContext); 

//render the dust template using the model and view as context
//optionally replace the existing $el of the view with the contents 
//of the rendered template
speck.view(backboneViewInstance, [replace=false])

//get the name of the dust object as it was passed in
//this is the name that dust uses to register the template, and can 
//be used by other templates for partials
speck.name;

//get the resolved url of the dust object
speck.url

//get the compiled speck source
speck.compiled;
```

## Requirements

* Requirejs: http://requirejs.org/
* Text plugin: http://requirejs.org/docs/download.html#text
* linkedin djustjs: https://github.com/linkedin/dustjs/
* Backbone (optional, but designed to use with): http://backbonejs.org/

The code assumes you have 'dustjs-linkedin' path and shim defined in your requirejs constructor:

```javascript
require.config({
	paths: {
		//change to wherever your files are stored
		'dustjs-linkedin': '../libs/dust', 
		text: '../libs/text',
		speck: '../libs/speck'
	},
	shim: {
		'dustjs-linkedin': {
			exports: 'dust'
		},
		'speck' : {
			deps: ['dustjs-linkedin', 'text']
		}
	}
});
```