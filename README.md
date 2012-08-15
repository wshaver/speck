speck
=====

A set of utility functions for easily rendering dust javascript templates in a backbone project with requirejs. 

A basic usage, given that your model has properties referenced in the dust file:
#dust:
```html
<h1>Friends of {name}</h1>
<ul>
{#friends}
 <li>{name}</li>
{/friends}
</ul>
```

#model:
```javascript
new UserModel({name:'Bob', id:444, friends: [{name:'Joe'},{name:'Alex'}]});
```

#view
```javascript
define(['backbone', 'speck!./user'], function(Backbone, speck){
	return Backbone.View.extend({
		render: function(){
			speck.html(this.model, this.$el);
		}
	});
});
```

If your view's model is a collection you'll need to pass in a collection name to dust:

#userListView
```javascript
define(['backbone', 'speck!./userList'], function(Backbone, speck){
	return Backbone.View.extend({
		render: function(){
			speck.html({users: this.model}, this.$el);
		}
	});
});
```

The plugin assumes you have 'dustjs-linkedin' path and shim defined in your requirejs constructor:

```javascript
require.config({
	paths: {
		'dustjs-linkedin': '../libs/dust'
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