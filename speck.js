define(['text', 'dustjs-linkedin'], function(text, dust) {
	return {
		load: function(name, req, onLoad, config) {
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
					dust.render.call(dust, name, obj, function(err, out) {
						if (err) {
							throw err;
						}
						if (!('jquery' in element)) {
							element = $(element);
						}
						element.html(out);
					});
				};
				var out = {
					render: function(obj, callback) {
						dust.render.call(dust, name, obj, callback);
					},
					html: function(element, obj) {
						render(element, obj);
					},
					view: function(view){
						var obj = normalizeObject(view.model);
						var context = dust.makeBase(view);
						var instance = context.push(obj);
						render(view.$el, instance);
					},
					name: name,
					compiled: compiled
				};
				onLoad(out);
			});
		}
	};
});