(function () {

    'use strict';

    var mod =
        angular
            .module('app.formentry');

    mod.run(function (formlyConfig) {
        formlyConfig.setType({
            name: 'labelled-button-field',
            template: '<div style="margin-bottom: 4px;"><strong>{{to.label}}</strong> <button ng-click="to.onClicked(this)"><strong style="{{to.buttonStyle}}" class="{{to.glyphiconStyle}}"></strong></button>  </div>',
            controller: function ($scope) {
                //confirm that the on clicked function exists
                activate();
                function activate() {
                    validateTemplateOptions();
                }
                function validateTemplateOptions() {
                    if (!$scope.to.onClicked) {
                        console.error('Template Options must define onClick function');
                        console.error($scope.to);
                    }
                    if ($scope.to.onClicked && (typeof $scope.to.onClicked) !== 'function') {
                        console.error('Template Option onClick is a function');
                        console.error($scope.to);
                    }
                }
            }
        });

    });


})();