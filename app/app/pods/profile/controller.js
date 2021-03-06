// Copyright 2016 Documize Inc. <legal@documize.com>. All rights reserved.
//
// This software (Documize Community Edition) is licensed under 
// GNU AGPL v3 http://www.gnu.org/licenses/agpl-3.0.en.html
//
// You can operate outside the AGPL restrictions by purchasing
// Documize Enterprise Edition and obtaining a commercial license
// by contacting <sales@documize.com>. 
//
// https://documize.com

import Ember from 'ember';

export default Ember.Controller.extend({
	userService: Ember.inject.service('user'),
	password: { password: "", confirmation: "" },
	session: Ember.inject.service(),

	actions: {
		save: function () {
			if (is.empty(this.model.get('firstname'))) {
				$("#firstname").addClass("error").focus();
				return;
			}
			if (is.empty(this.model.get('lastname'))) {
				$("#lastname").addClass("error").focus();
				return;
			}
			if (is.empty(this.model.get('email'))) {
				$("#email").addClass("error").focus();
				return;
			}
			if (is.not.empty(this.password.password) && is.empty(this.password.confirmation)) {
				$("#confirmPassword").addClass("error").focus();
				return;
			}
			if (is.empty(this.password.password) && is.not.empty(this.password.confirmation)) {
				$("#password").addClass("error").focus();
				return;
			}
			if (is.not.equal(this.password.password, this.password.confirmation)) {
				$("#password").addClass("error").focus();
				return;
			}

			let self = this;

			this.get('userService').save(this.model).then(function () {
				if (is.not.empty(self.password.password) && is.not.empty(self.password.confirmation)) {
					self.get('userService').updatePassword(self.model.get('id'), self.password.password).then(function () {
						self.password.password = "";
						self.password.confirmation = "";
					});
				}
				self.model.generateInitials();
				self.get('session').set('user', self.model);
			});

			this.transitionToRoute('folders');
		}
	}
});