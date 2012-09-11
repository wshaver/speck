define(['backbone', 'module', 'text', 'dustjs-linkedin'], function(Backbone, module, text, dust) {
	var masterConfig = module.config();
	return {
		load: function(name, req, onLoad, config) {
			var url = name;
			if(masterConfig && 'speckUrl' in masterConfig && url[0] !== '.'){
				url = masterConfig.speckUrl + url;
			}
			if (url.indexOf('.dust', url.length - 5) === -1) {
				url = url + '.dust';
			}
			text.get(req.toUrl(url), function(data) {
				var compiled = dust.compile(data, name);
				dust.loadSource(compiled);
				var normalizeObject = function(obj) {
						if (obj === undefined || obj === null) {
							return {};
						}
						return JSON.parse(JSON.stringify(obj));
					};
				var render = function(element, obj){
					var ret = Backbone.$.Deferred();
					dust.render.call(dust, name, obj, function(err, out) {
						if (err) {
							ret.reject(err);
							throw err;
						}
						if(!('jquery' in element)) {
							element = Backbone.$(element);
						}
						element.html(out);
						ret.resolve(out);
					});
					return ret;
				};
				var out = {
					render: function(obj, callback) {
						dust.render.call(dust, name, obj, callback);
					},
					html: function(element, obj) {
						return render(element, obj);
					},
					view: function(view, replace){
						var obj = normalizeObject(view.model);
						var context = dust.makeBase(view);
						var instance = context.push(obj);
						if(replace) {
							var old = view.$el;
							return render(view.$el, instance).done(function(){
								var content = view.$el.contents();
								//put it in the correct place in the dom:
								view.$el.replaceWith(content);
								view.setElement(content);
							});
						}
						return render(view.$el, instance);
					},
					url: url,
					name: name,
					compiled: compiled
				};
				onLoad(out);
			});
		}
	};
});