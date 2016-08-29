/*jshint -W026, -W030 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function () {
  'use strict';
  describe('OpenMRS Permission Service unit tests', function () {
    beforeEach(function () {
      module('ngAmrsApp');
      module('app.openmrsRestServices');
      module('mock.data');
    });

    var permissionService;
    var openmrsRestService;
    var getUserService;
    var mockData;

    beforeEach(inject(function ($injector) {
      permissionService = $injector.get('permissionService');
      openmrsRestService = $injector.get('OpenmrsRestService');
      mockData = $injector.get('mockData');
    }));

    it('should have permissionService injected for this to work', function () {
      expect(permissionService).to.exist;
    });

    it('should have openmrsRestServices injected', function () {
      expect(openmrsRestService).to.exist;
    });

    it('should have the following  method to exist and defined',
      function () {
        expect(permissionService.hasPrivileges).to.exist;
        expect(permissionService.hasPrivileges).to.be.an('function');

      });
    it('should return false when user is not signed in or user has no any roles or privileges',
      function () {
        //stubbing a user with appropriate privilege
        getUserService = sinon.stub(openmrsRestService, 'getUserService', function () {
          return {
            user:''
          }
        });
        //my expectation
        expect(permissionService.hasPrivileges('Void User')).to.equal(false);

      });

    it('should return true when signed in user has a super user userRole',
      function () {
        //stubbing a system developer
        getUserService = sinon.stub(openmrsRestService, 'getUserService', function () {
          return {
            user: {
              openmrsModel: function () {
                return {
                  userRole: [
                    {
                      name: 'Provider',
                      privileges: []
                    },
                    {
                      name: 'System Developer',
                      privileges: []
                    }
                  ]
                }
              }
            }

          }
        })
        expect(permissionService.hasPrivileges('Edit User')).to.equal(true);

      });

    it('should return true when signed in user has an appropriate privilege and is not a super user',
      function () {
        //stubbing a user with appropriate privilege
        getUserService = sinon.stub(openmrsRestService, 'getUserService', function () {
          return {
            user: {
              openmrsModel: function () {
                return {
                  userRole: [
                    {
                      name: 'Provider',
                      privileges: [
                        {
                          name: 'Get User'
                        },
                        {
                          name: 'Edit User'
                        }
                      ]
                    },
                    {
                      name: 'Data Manager',
                      privileges: []
                    }
                  ]
                }
              }
            }

          }
        });
        //my expectation
        expect(permissionService.hasPrivileges('Edit User')).to.equal(true);

      });

    it('should return false when signed in user does not have required privileges and in not a super user',
      function () {
        //stubbing a user with appropriate privilege
        getUserService = sinon.stub(openmrsRestService, 'getUserService', function () {
          return {
            user: {
              openmrsModel: function () {
                return {
                  userRole: [
                    {
                      name: 'Provider',
                      privileges: [
                        {
                          name: 'Get User'
                        },
                        {
                          name: 'Edit User'
                        }
                      ]
                    },
                    {
                      name: 'Data Manager',
                      privileges: []
                    }
                  ]
                }
              }
            }

          }
        });
        //my expectation
        expect(permissionService.hasPrivileges('Void User')).to.equal(false);

      });

  });
})();
