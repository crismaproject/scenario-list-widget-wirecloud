angular.module(
    'de.cismet.crisma.widgets.scenarioListWidgetWirecloud',
    [
        'de.cismet.crisma.widgets.scenarioListWidget',
        'de.cismet.crisma.ICMM.Worldstates',
        'de.cismet.commons.angular.angularTools'
    ]
).controller(
    'de.cismet.crisma.widgets.scenarioListWidgetWirecloud.wire',
    [
        '$scope',
        'de.cismet.crisma.ICMM.Worldstates',
        'de.cismet.commons.angular.angularTools.AngularTools',
        'DEBUG',
        function (
            $scope,
            Worldstates,
            AngularTools,
            DEBUG
        ) {
            'use strict';

            var mashupPlatform, setActiveWSWirecloud;

            if (typeof MashupPlatform === 'undefined') {
                if (DEBUG) {
                    console.log('mashup platform not available');
                }
            } else {
                // enable minification
                mashupPlatform = MashupPlatform;
                
                $scope.activeWS = {};

                $scope.$watch('activeWS', function (n, o) {
                    if (n && o && n.id && o.id && n.id === o.id) {
                        // not rethrowing in case of same object set twice
                        return;
                    }

                    if (DEBUG) {
                        console.log('BEGIN: pushing active worldstate event: ' + n);
                    }

                    if (n && n.id) {
                        if (DEBUG) {
                            console.log('DO: pushing active worldstate event: ' + n.id);
                        }

                        mashupPlatform.wiring.pushEvent('getActiveWorldstate', n.id.toString());

                        if (DEBUG) {
                            console.log('DONE: pushing active worldstate event: ' + n.id);
                        }
                    }
                });

                setActiveWSWirecloud = function (newActiveWs) {
                    var setWs;

                    if (DEBUG) {
                        console.log('BEGIN: receiving active worldstate event: ' + newActiveWs);
                    }

                    setWs = function (ws) {
                        if (DEBUG) {
                            console.log('DO: receiving active worldstate event: ' + ws);
                        }

                        AngularTools.safeApply($scope, function () {
                            $scope.activeWS = ws;
                        });

                        if (DEBUG) {
                            console.log('DONE: receiving active worldstate event: ' + ws);
                        }
                    };

                    if (newActiveWs) {
                        try {
                            Worldstates.get({wsId: newActiveWs}).$promise.then(function (ws) {
                                setWs(ws);
                            });
                        } catch (e) {
                            if (DEBUG) {
                                console.log(e);
                            }
                            setWs({});
                        }
                    } else {
                        setWs({});
                    }
                };

                mashupPlatform.wiring.registerCallback('setActiveWorldstate', setActiveWSWirecloud);
            }
        }
    ]
).config(
    [
        '$provide',
        function ($provide) {
            'use strict';

            var mashupPlatform;

            if (typeof MashupPlatform === 'undefined') {
                console.log('mashup platform not available');
            } else {
                // enable minification
                mashupPlatform = MashupPlatform;
                $provide.constant('DEBUG', mashupPlatform.prefs.get('DEBUG'));
                $provide.constant('CRISMA_DOMAIN', mashupPlatform.prefs.get('CRISMA_DOMAIN'));
                $provide.constant('CRISMA_ICMM_API', mashupPlatform.prefs.get('CRISMA_ICMM_API'));
            }
        }
    ]
);
