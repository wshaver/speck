define(['backbone', 'module', 'text', 'dustjs-linkedin'], function(Backbone, module, text, dust) {
	var masterConfig = module.config();
	return {
		load: function(name, req, onLoad, config) {
			if(masterConfig && 'speckUrl' in masterConfig && name[0] !== '.'){
				name = masterConfig.speckUrl + name;
			}
			if (name.indexOf('.dust', name.length - 5) === -1) {
				name = name + '.dust';
			}
			text.get(req.toUrl(name), function(data) {
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
					view: function(view){
						var obj = normalizeObject(view.model);
						var context = dust.makeBase(view);
						var instance = context.push(obj);
						return render(view.$el, instance);
					},
					name: name,
					compiled: compiled
				};
				onLoad(out);
			});
		}
	};
});