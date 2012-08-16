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

##advanced usage - view as context

###dust file:
```html
<h1>Friends of {getName}</h1>
```

### No-model view
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


##other functions:

```javascript
//render the dust template to the element using the provided context
speck.html(element, objectContext); 

//render the dust template and then callback with the standard dustjs callback
speck.render(objectContext, element);

//get the name of the dust object
speck.name;

//get the compiled speck source
speck.compiled;


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