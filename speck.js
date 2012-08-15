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
				var out = {
					render: function(obj, callback) {
						obj = normalizeObject(obj);
						dust.render.call(this, name, obj, callback);
					},
					html: function(element, obj) {
						obj = normalizeObject(obj);
						dust.render.call(this, name, obj, function(err, out) {
							if (err) {
								throw err;
							}
							if (!('jquery' in element)) {
								element = $(element);
							}
							element.html(out);
						});
					},
					name: name,
					compiled: compiled
				};
				onLoad(out);
			});
		}
	};
});