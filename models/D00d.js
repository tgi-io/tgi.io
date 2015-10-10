var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * D00d Model
 * ==========
 */

var D00d = new keystone.List('D00d');

D00d.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
D00d.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

D00d.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

D00d.defaultColumns = 'name, email, isAdmin';
D00d.register();
