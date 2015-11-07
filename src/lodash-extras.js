import lodashUtils from 'wildcat/utils/lodash/_core/lodash-utils';


/**
 * Collection of all the utils in here. Add to this as you go.
 */
let lodashExtras = {};


/**
 * Helper to check if a variable is defined and present
 *
 * @namespace _
 * @method isPresent
 * @param {*} value: Value to check
 * @return {Boolean}
 */
export var isPresent = (value) => (!_.isUndefined(value) && !_.isNull(value));
lodashExtras.isPresent = isPresent;


/**
 * Helper to check if a variable is defined and present
 *
 * @namespace _
 * @method isBlank
 * @param {*} value: Value to check
 * @return {Boolean}
 */
export var isBlank = (value) => !_.isPresent(value);
lodashExtras.isBlank = isBlank;


/**
 * Helper to check if a variable is a promise
 *
 * @namespace _
 * @method isPromise
 * @param {*} value: Value to check
 * @return {Boolean}
 */
export var isPromise = (value) => _.isFunction(value, 'then');
lodashExtras.isPromise = isPromise;


/**
 * Helper to check a value for an array of LoDash boolean conditions
 * TODO: Name this `isAnd` and create `isOr`...
 *
 * @namespace _
 * @method is
 * @param {*} value: Value to check
 * @param {Array} conditions: LoDash methods to have value tested against (as strings)
 * @return {Boolean}
 */
export var is = function(value, conditions) {
	if (_.isString(conditions)) conditions = [conditions];
	if (_.isPresent(conditions) && !_.isArray(conditions)) conditions = [];
	if (conditions.length <= 1) console.error("Don't call `is` helper with just one condition- use that condition directly");
	return _.every(conditions, function(condition) {
		let result, not;

		// Check for valid condition
		if (!_.isString(condition)) {
			console.warn("`condition` was not a string: " + condition);
			return false;
		}

		// Handle not condition
		not = false;
		if (_.startsWith(condition, '!')) {
			not = true;
			condition = condition.replace('!', '');
		}

		// Be EXTRA (too) helpful (prepend 'is' if ommitted)
		if (!_.startsWith(condition, 'is')) {
			condition = 'is' + condition;
		}

		// Make sure `condition` is a valid lodash method
		if (!_.isFunction(_[condition])) {
			console.warn("`condition` was not a valid lodash method: " + condition);
			return false;
		}

		// Determine result and return
		result = _[condition](value);
		if (not === true) return !result;

		return result;
	});
};
lodashExtras.is = is;


/**
 * Generate `ensure` methods- Ensure that value is of type x
 *
 * @namespace _
 * @method ensure{Type}
 * @param {*} value: To check
 * @param {*} [valueDefault=defaults[condition]: What to default to
 * @return {*} Ensured value
 * @since v1.3.0
 */
_.forEach(_.keys(lodashUtils.typeDefaults()), (type) => {
	lodashExtras[`ensure${type}`] = lodashUtils.makeEnsureType(type);
});


/**
 * Javascript `typeof` alias
 *
 * @namespace _
 * @method typeOf
 * @param {*} value: Value to check
 * @return {String} The type of `value`
 */
export var typeOf = (value) => typeof(value);
lodashExtras.typeOf = typeOf;


export default lodashExtras;
